import {
  ActiveOrderService,
  Allow,
  Ctx,
  ErrorResultUnion,
  Order,
  OrderService,
  Permission,
  ProductService,
  ProductVariantService,
  RequestContext,
  Transaction,
} from "@vendure/core";
import { Args, Mutation, Resolver } from "@nestjs/graphql";

import {
  MutationAddItemToOrderArgs,
  UpdateOrderItemsResult,
} from "@vendure/common/lib/generated-shop-types";
import { OrderModificationError } from "@vendure/core/dist/common/error/generated-graphql-shop-errors";

@Resolver()
export class ProductCustomerCustomizationsResolver {
  constructor(
    private orderService: OrderService,
    private activeOrderService: ActiveOrderService,
    private productVariantService: ProductVariantService,
    private productService: ProductService
  ) {}

  @Transaction()
  @Mutation()
  @Allow(Permission.UpdateOrder, Permission.Owner)
  async addCustomItemToOrder(
    @Ctx() ctx: RequestContext,
    @Args()
    args: MutationAddItemToOrderArgs & { customizations?: string }
  ): Promise<ErrorResultUnion<UpdateOrderItemsResult, Order>> {
    const order = await this.activeOrderService.getOrderFromContext(ctx, true);

    let customizations: { [key: string]: any } | null = null;

    if (args.customizations) {
      try {
        const validatedCustomizations: { [key: string]: any } = {};
        const input: { [key: string]: any } = JSON.parse(args.customizations);

        const productVariant = await this.productVariantService.findOne(
          ctx,
          args.productVariantId
        );
        if (!productVariant) {
          return new OrderModificationError();
        }
        const product = await this.productService.findOne(
          ctx,
          productVariant.productId
        );
        if (!product) {
          return new OrderModificationError();
        }

        const customFields = product.customFields as any;

        if ("customizationOptions" in customFields) {
          const customizationOptions = JSON.parse(
            customFields.customizationOptions
          );
          const keys = Object.keys(customizationOptions);

          for (const key of keys) {
            switch (customizationOptions[key].type) {
              case "text":
                validatedCustomizations[key] = input[key];
                break;
              default:
                break;
            }
          }
        }

        customizations = validatedCustomizations;
      } catch (e) {
        return new OrderModificationError();
      }
    }

    return this.orderService.addItemToOrder(
      ctx,
      order.id,
      args.productVariantId,
      args.quantity,
      customizations
        ? { customizations: JSON.stringify(customizations) }
        : undefined
    );
  }
}
