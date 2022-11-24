import {
  AuthenticationStrategy,
  CustomerGroupService,
  CustomerService,
  ExternalAuthenticationService,
  ID,
  Injector,
  NativeAuthenticationMethod,
  PasswordCipher,
  RequestContext,
  TransactionalConnection,
  User,
  isGraphQlErrorResult,
} from "@vendure/core";
import { DocumentNode } from "graphql";
import gql from "graphql-tag";
import fetch from "node-fetch";

type WPAddress = {
  additional_line_above: string;
  company: string;
  first_name: string;
  last_name: string;
  address_1: string;
  post_office_box: string;
  postcode: string;
  city: string;
  state: string;
  country: string;
  email: string;
  phone: string;
};

export type LegacyAuthData = {
  email: string;
  password: string;
};

export class LegacyAuthenticationStrategy
  implements AuthenticationStrategy<LegacyAuthData>
{
  readonly name = "legacy";
  private customerService: CustomerService;
  private customerGroupService: CustomerGroupService;
  private connection: TransactionalConnection;
  private passwordCipher: PasswordCipher;

  constructor(private url: string) {}

  init(injector: Injector) {
    this.customerService = injector.get(CustomerService);
    this.customerGroupService = injector.get(CustomerGroupService);
    this.connection = injector.get(TransactionalConnection);
    this.passwordCipher = injector.get(PasswordCipher);
  }

  defineInputType(): DocumentNode {
    // Here we define the expected input object expected by the `authenticate` mutation
    // under the "google" key.
    return gql`
      input LegacyAuthInput {
        email: String!
        password: String!
      }
    `;
  }

  async authenticate(
    ctx: RequestContext,
    data: LegacyAuthData
  ): Promise<User | false> {
    //first part is copy paste from the legacy authentication strategy

    const user = await this.getUserFromIdentifier(ctx, data.email);
    if (!user) {
      //but in case no user is found, we also try to authenticate with the old shop
      const req: {
        success: boolean;
        account: {
          email: string;
          billing: WPAddress;
          shipping: WPAddress;
        };
        groups: string[];
      } = await fetch(this.url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        //make sure to serialize your JSON body
        body: JSON.stringify({
          username: data.email,
          password: data.password,
        }),
      }).then((response) => response.json());

      if (!req.success) {
        //the old shop also denies authentication
        return false;
      }

      //now create an account using the same password and native authentication strategy, i.e. local
      const result = await this.customerService.create(
        ctx,
        {
          emailAddress: data.email,
          firstName: req.account.billing.first_name,
          lastName: req.account.billing.last_name,
          phoneNumber: req.account.billing.phone,
        },
        data.password
      );
      if (isGraphQlErrorResult(result)) {
        console.error("Legacy authentication try", result);
        return false;
      } else {
        //now just obtain the account
        const user = await this.getUserFromIdentifier(ctx, data.email);
        if (!user) {
          console.error(
            "Account wasn't found even though it was just created?! (legacy authentication)"
          );
          return false;
        }

        //add billing and shipping addresses
        const customer = await this.customerService.findOneByUserId(
          ctx,
          user.id
        );
        if (!customer) {
          console.error(
            "Customer wasn't found even though it was just created?! (legacy authentication)"
          );
          return false;
        }

        const resellerGroups = await this.customerGroupService.findAll(ctx, {
          filter: { name: { contains: "Wiederverkäufer" } },
        });
        const promises = [];
        for (const g of req.groups) {
          const [productGroup, discount] = g.split("-");
          const resellerGroup = resellerGroups.items.find(
            (rg) => rg.name == `Wiederverkäufer ${productGroup} ${discount}`
          );

          if (resellerGroup) {
            promises.push(
              this.customerGroupService.addCustomersToGroup(ctx, {
                customerGroupId: resellerGroup.id,
                customerIds: [customer.id],
              })
            );
          }
        }

        await Promise.all(promises);

        if (
          req.account.billing.address_1.length > 0 &&
          req.account.billing.country.length === 2
        ) {
          await this.customerService.createAddress(ctx, customer.id, {
            defaultBillingAddress: true,
            fullName: req.account.billing.last_name
              ? req.account.billing.first_name
                ? `${req.account.billing.first_name} ${req.account.billing.last_name}`
                : req.account.billing.last_name
              : req.account.billing.first_name,
            streetLine1: req.account.billing.additional_line_above
              ? req.account.billing.additional_line_above
              : req.account.billing.address_1,
            streetLine2: req.account.billing.additional_line_above
              ? `${req.account.billing.address_1} ${req.account.billing.post_office_box}`
              : req.account.billing.post_office_box,
            postalCode: req.account.billing.postcode,
            city: req.account.billing.city,
            province: req.account.billing.state,
            countryCode: req.account.billing.country.toUpperCase(),
            company: req.account.billing.company,
            phoneNumber: req.account.billing.phone,
          });
        }

        if (
          req.account.shipping.address_1.length > 0 &&
          req.account.shipping.country.length === 2
        ) {
          await this.customerService.createAddress(ctx, customer.id, {
            defaultShippingAddress: true,
            fullName: req.account.shipping.last_name
              ? req.account.shipping.first_name
                ? `${req.account.shipping.first_name} ${req.account.shipping.last_name}`
                : req.account.shipping.last_name
              : req.account.shipping.first_name,
            streetLine1: req.account.shipping.additional_line_above
              ? req.account.shipping.additional_line_above
              : req.account.shipping.address_1,
            streetLine2: req.account.shipping.additional_line_above
              ? `${req.account.shipping.address_1} ${req.account.shipping.post_office_box}`
              : req.account.shipping.post_office_box,
            postalCode: req.account.shipping.postcode,
            city: req.account.shipping.city,
            province: req.account.shipping.state,
            countryCode: req.account.shipping.country.toUpperCase(),
            company: req.account.shipping.company,
            phoneNumber: req.account.shipping.phone,
          });
        }

        return user;
      }
    }
    //continue as usual (native authentication strategy)
    const passwordMatch = await this.verifyUserPassword(
      ctx,
      user.id,
      data.password
    );
    if (!passwordMatch) {
      return false;
    }

    return user;
  }

  private getUserFromIdentifier(
    ctx: RequestContext,
    identifier: string
  ): Promise<User | undefined> {
    return this.connection.getRepository(ctx, User).findOne({
      where: { identifier, deletedAt: null },
      relations: ["roles", "roles.channels"],
    });
  }

  async verifyUserPassword(
    ctx: RequestContext,
    userId: ID,
    password: string
  ): Promise<boolean> {
    const user = await this.connection
      .getRepository(ctx, User)
      .findOne(userId, {
        relations: ["authenticationMethods"],
      });
    if (!user) {
      return false;
    }
    const nativeAuthMethod = user.getNativeAuthenticationMethod();
    const pw =
      (
        await this.connection
          .getRepository(ctx, NativeAuthenticationMethod)
          .findOne(nativeAuthMethod.id, {
            select: ["passwordHash"],
          })
      )?.passwordHash ?? "";

    const passwordMatches = await this.passwordCipher.check(password, pw);
    if (!passwordMatches) {
      return false;
    }
    return true;
  }
}
