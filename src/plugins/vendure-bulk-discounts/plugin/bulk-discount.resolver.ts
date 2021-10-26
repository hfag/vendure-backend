import {
  Allow,
  Ctx,
  ID,
  Product,
  ProductService,
  ProductVariant,
  ProductVariantService,
  RequestContext,
  Transaction,
} from "@vendure/core";
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { Permission } from "@vendure/common/lib/generated-types";

import { BulkDiscount } from "./bulk-discount.entity";
import { BulkDiscountInput } from ".";
import { BulkDiscountService } from "./bulk-discount.service";
import { Translated } from "@vendure/core/dist/common/types/locale-types";

@Resolver()
export class BulkDiscountAdminResolver {
  constructor(private bulkDiscountService: BulkDiscountService) {}

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
    const promises: Promise<any>[] = [];

    for (const discount of args.updates) {
      const discounts = await this.bulkDiscountService.findAll({
        where: { productVariant: discount.productVariantId },
      });

      if (discounts.length < discount.discounts.length) {
        promises.push(
          this.bulkDiscountService.create({
            productVariantId: discount.productVariantId,
            discounts: discount.discounts.slice(
              discounts.length,
              discount.discounts.length
            ),
          })
        );
      } else if (discount.discounts.length < discounts.length) {
        promises.push(
          this.bulkDiscountService.delete(
            discounts
              .slice(discount.discounts.length, discounts.length)
              .map((d) => d.id)
          )
        );
      }

      for (let i = 0; i < discounts.length; i++) {
        promises.push(
          this.bulkDiscountService.update(
            discounts[i].id,
            discount.discounts[i].quantity,
            discount.discounts[i].price
          )
        );
      }
    }

    await Promise.all(promises);

    return true;
  }

  @Query()
  async productBulkDiscounts(
    @Ctx() ctx: RequestContext,
    @Args() args: { productId: ID }
  ): Promise<BulkDiscount[]> {
    return await this.bulkDiscountService.findByProductId(args.productId);
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
    return await this.bulkDiscountService.findByProductId(args.productId);
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
    return this.bulkDiscountService.findByProductVariantId(productVariant.id);
  }
}
