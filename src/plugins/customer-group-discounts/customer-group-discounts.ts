import {
  VendurePlugin,
  PluginCommonModule,
  PromotionCondition,
  LanguageCode,
  CustomerService,
} from "@vendure/core";
import gql from "graphql-tag";

import {
  CustomerResellerDiscountResolver,
  ProductResellerDiscountResolver,
  ProductVariantResellerDiscountResolver,
} from "./customer-group-discounts.resolver";

const schemaExtension = gql`
  type ResellerDiscount {
    facetValueIds: [ID!]!
    discount: Int!
  }

  extend type Customer {
    resellerDiscounts: [ResellerDiscount!]!
  }

  extend type Product {
    resellerDiscount: Int!
  }

  extend type ProductVariant {
    resellerDiscount: Int!
  }
`;

let customerService: CustomerService;

const groupMemberAny = new PromotionCondition({
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Customer is member of any of the groups with ids { groups }",
    },
    {
      languageCode: LanguageCode.de,
      value: "Der Kunde ist Mitglied einer Gruppe mit einer der IDs { groups }",
    },
  ],
  code: "group-member-any",
  args: {
    groups: { type: "string", list: true },
  },
  init(injector) {
    customerService = injector.get(CustomerService);
  },
  async check(ctx, order, args) {
    if (!order.customer || !customerService) {
      return false;
    }

    const groups = await customerService.getCustomerGroups(
      ctx,
      order.customer.id
    );
    return groups.reduce<boolean>((b, group) => {
      return (
        b ||
        (args.groups.find((g) => g.toString() === group.id.toString())
          ? true
          : false)
      );
    }, false);
  },
  priorityValue: 10,
});

const groupMemberAll = new PromotionCondition({
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Customer is member of all of the groups with ids { groups }",
    },
    {
      languageCode: LanguageCode.de,
      value: "Der Kunde ist Mitglied aller Gruppen mit den IDs { groups }",
    },
  ],
  code: "group-member-all",
  args: {
    groups: { type: "string", list: true },
  },
  init(injector) {
    customerService = injector.get(CustomerService);
  },
  async check(ctx, order, args) {
    if (!order.customer || !customerService) {
      return false;
    }

    const groups = await customerService.getCustomerGroups(
      ctx,
      order.customer.id
    );
    return args.groups.reduce<boolean>(
      (b, group) =>
        b &&
        (groups.find((g) => g.id.toString() === group.toString())
          ? true
          : false),
      true
    );
  },
  priorityValue: 10,
});

const notGroupMember = new PromotionCondition({
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Customer isn't a member of any of the groups with ids { groups }",
    },
    {
      languageCode: LanguageCode.de,
      value: "Der Kunde ist nicht Mitglied einer Gruppe mit den IDs { groups }",
    },
  ],
  code: "not-group-member",
  args: {
    groups: { type: "string", list: true },
  },
  init(injector) {
    customerService = injector.get(CustomerService);
  },
  async check(ctx, order, args) {
    if (!customerService) {
      return false;
    }

    if (!order.customer) {
      return true;
    }

    const groups = await customerService.getCustomerGroups(
      ctx,
      order.customer.id
    );

    return (
      groups.length === 0 ||
      groups.reduce<boolean>((b, group) => {
        return (
          b && !args.groups.find((g) => g.toString() === group.id.toString())
        );
      }, true)
    );
  },
  priorityValue: 10,
});

const groupMemberPrefix = new PromotionCondition({
  description: [
    {
      languageCode: LanguageCode.en,
      value:
        'Customer is a member of any group whose name starts with "{ prefix }"',
    },
    {
      languageCode: LanguageCode.de,
      value:
        'Der Kunde ist Mitglied einer Gruppe deren Name mit "{ prefix }" beginnt',
    },
  ],
  code: "group-member-prefix",
  args: {
    prefix: { type: "string" },
  },
  init(injector) {
    customerService = injector.get(CustomerService);
  },
  async check(ctx, order, args) {
    if (!customerService) {
      return false;
    }

    if (!order.customer) {
      return true;
    }

    const groups = await customerService.getCustomerGroups(
      ctx,
      order.customer.id
    );

    return order.customer
      ? groups.reduce<boolean>((b, group) => {
          return b || group.name.startsWith(args.prefix);
        }, false)
      : false;
  },
  priorityValue: 10,
});

const notGroupMemberPrefix = new PromotionCondition({
  description: [
    {
      languageCode: LanguageCode.en,
      value:
        "Customer isn't a member of any group whose name starts with '{ prefix }'",
    },
    {
      languageCode: LanguageCode.de,
      value:
        'Der Kunde ist nicht Mitglied einer Gruppe deren Name mit "{ prefix }" beginnt',
    },
  ],
  code: "not-group-member-prefix",
  args: {
    prefix: { type: "string" },
  },
  init(injector) {
    customerService = injector.get(CustomerService);
  },
  async check(ctx, order, args) {
    if (!customerService) {
      return false;
    }

    if (!order.customer) {
      return true;
    }

    const groups = await customerService.getCustomerGroups(
      ctx,
      order.customer.id
    );

    return (
      groups.length === 0 ||
      groups.reduce<boolean>((b, group) => {
        return b && !group.name.startsWith(args.prefix);
      }, true)
    );
  },
  priorityValue: 10,
});

@VendurePlugin({
  imports: [PluginCommonModule],
  shopApiExtensions: {
    schema: schemaExtension,
    resolvers: [
      CustomerResellerDiscountResolver,
      ProductResellerDiscountResolver,
      ProductVariantResellerDiscountResolver,
    ],
  },
  configuration: (config) => {
    if (!config.promotionOptions.promotionActions) {
      config.promotionOptions.promotionActions = [];
    }

    if (!config.promotionOptions.promotionConditions) {
      config.promotionOptions.promotionConditions = [];
    }

    config.promotionOptions.promotionConditions.push(groupMemberAny);
    config.promotionOptions.promotionConditions.push(groupMemberAll);
    config.promotionOptions.promotionConditions.push(notGroupMember);
    config.promotionOptions.promotionConditions.push(groupMemberPrefix);
    config.promotionOptions.promotionConditions.push(notGroupMemberPrefix);

    return config;
  },
})
export class CustomerGroupDiscountsPlugin {}
