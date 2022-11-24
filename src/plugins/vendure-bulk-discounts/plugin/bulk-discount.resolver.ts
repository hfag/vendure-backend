import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { Permission } from "@vendure/common/lib/generated-types";
import {
  Allow,
  Ctx,
  EventBus,
  ID,
  ProductVariant,
  ProductVariantService,
  RequestContext,
  Transaction,
} from "@vendure/core";
import { Translated } from "@vendure/core/dist/common/types/locale-types";

import { BulkDiscountInput } from ".";
import { BulkDiscount } from "./bulk-discount.entity";
import { BulkDiscountService } from "./bulk-discount.service";

@Resolver()
export class BulkDiscountAdminResolver {
  constructor(
    private bulkDiscountService: BulkDiscountService,
    private productVariantService: ProductVariantService,
    private eventBus: EventBus
  ) {}

  @Transaction()
  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async updateBulkDiscounts(
    @Ctx() ctx: RequestContext,
    @Args()
    args: {
      updates: {
        productVariantId: ID;
        discounts: BulkDiscountInput["discounts"];
      }[];
    }
  ): Promise<boolean> {
    const updates: { id: number; quantity: number; price: number }[] = [];
    const creations: {
      [productVariantId: string]: { price: number; quantity: number }[];
    } = {};
    const deletions: number[] = [];

    for (const discount of args.updates) {
      //check if all received quantites are unique
      const quantities = discount.discounts.map((d) => d.quantity);
      const uniqueQuantities = new Set(quantities);

      if (quantities.length !== uniqueQuantities.size) {
        return false;
      }

      const discounts = await this.bulkDiscountService.findAll(ctx, {
        where: { productVariant: discount.productVariantId },
      });

      for (const d of discount.discounts) {
        // for each received discount check whether an entry with the same quantity exists
        const existingDiscount = discounts.find(
          (d2) => d2.quantity === d.quantity
        );
        if (existingDiscount) {
          // if there is one, update the price
          updates.push({
            id: existingDiscount.id,
            quantity: existingDiscount.quantity,
            price: d.price,
          });
        } else {
          // if none exists yet we create a new one
          if (creations[discount.productVariantId]) {
            creations[discount.productVariantId].push({
              price: d.price,
              quantity: d.quantity,
            });
          } else {
            creations[discount.productVariantId] = [
              { price: d.price, quantity: d.quantity },
            ];
          }
        }
      }

      for (const d of discounts) {
        // for each existing discount check whether there is still one with the same quantity
        const newDiscount = discount.discounts.find(
          (d2) => d2.quantity === d.quantity
        );
        if (!newDiscount) {
          // if there is none, delete it
          deletions.push(d.id);
        }
      }
    }

    const promises: Promise<unknown>[] = [];
    for (const update of updates) {
      promises.push(
        this.bulkDiscountService.update(
          ctx,
          update.id,
          update.quantity,
          update.price
        )
      );
    }
    for (const productVariantId of Object.keys(creations)) {
      promises.push(
        this.bulkDiscountService.create(ctx, {
          productVariantId: productVariantId,
          discounts: creations[productVariantId],
        })
      );
    }
    promises.push(this.bulkDiscountService.delete(deletions));

    await Promise.all(promises);

    return true;
  }

  @Query()
  async productBulkDiscounts(
    @Ctx() ctx: RequestContext,
    @Args() args: { productId: ID }
  ): Promise<BulkDiscount[]> {
    return await this.bulkDiscountService.findByProductId(ctx, args.productId);
  }
}

@Resolver()
export class BulkDiscountShopResolver {
  constructor(private bulkDiscountService: BulkDiscountService) {}

  @Query()
  async productBulkDiscounts(
    @Ctx() ctx: RequestContext,
    @Args() args: { productId: ID }
  ): Promise<BulkDiscount[]> {
    return await this.bulkDiscountService.findByProductId(ctx, args.productId);
  }
}

@Resolver("BulkDiscount")
export class BulkDiscountEntityResolver {
  constructor(private productVariantService: ProductVariantService) {}

  @ResolveField()
  async productVariant(
    @Ctx() ctx: RequestContext,
    @Parent() bulkDiscount: BulkDiscount
  ): Promise<Translated<ProductVariant>> {
    const productVariant = await this.productVariantService.findOne(
      ctx,
      bulkDiscount.productVariant.id
    );

    if (!productVariant) {
      throw new Error(
        `Invalid database records for bulk discount with the id ${bulkDiscount.id}`
      );
    }

    return productVariant;
  }
}

@Resolver("ProductVariant")
export class ProductVariantEntityResolver {
  constructor(private bulkDiscountService: BulkDiscountService) {}

  @ResolveField()
  async bulkDiscounts(
    @Ctx() ctx: RequestContext,
    @Parent() productVariant: ProductVariant
  ): Promise<BulkDiscount[]> {
    return this.bulkDiscountService.findByProductVariantId(
      ctx,
      productVariant.id
    );
  }
}
