import { Injectable } from "@nestjs/common";
import {
  DeletionResponse,
  DeletionResult,
} from "@vendure/common/lib/generated-types";
import {
  ID,
  assertFound,
  ProductVariant,
  TransactionalConnection,
  RequestContext,
} from "@vendure/core";
import { In } from "typeorm";
import { FindManyOptions } from "typeorm/find-options/FindManyOptions";

import { BulkDiscount } from "./bulk-discount.entity";
import { BulkDiscountInput } from "./index";

@Injectable()
export class BulkDiscountService {
  constructor(private connection: TransactionalConnection) {}

  findAll(
    ctx: RequestContext,
    options: FindManyOptions<BulkDiscount> | undefined
  ): Promise<BulkDiscount[]> {
    return this.connection.getRepository(ctx, BulkDiscount).find(options);
  }

  findByProductVariantSku(
    ctx: RequestContext,
    productVariantSku: string
  ): Promise<BulkDiscount[]> {
    return this.connection
      .getRepository(ctx, BulkDiscount)
      .createQueryBuilder("bulkDiscount")
      .leftJoinAndSelect("bulkDiscount.productVariant", "productVariant")
      .where("productVariant.sku = :sku", { sku: productVariantSku })
      .getMany();
  }

  findByProductVariantId(
    ctx: RequestContext,
    productVariantId: ID
  ): Promise<BulkDiscount[]> {
    return this.connection
      .getRepository(ctx, BulkDiscount)
      .createQueryBuilder("bulkDiscount")
      .leftJoinAndSelect("bulkDiscount.productVariant", "productVariant")
      .where("productVariant.id = :productVariantId", { productVariantId })
      .getMany();
  }

  findByProductId(ctx: RequestContext, productId: ID): Promise<BulkDiscount[]> {
    return this.connection
      .getRepository(ctx, BulkDiscount)
      .createQueryBuilder("bulkDiscount")
      .leftJoinAndSelect("bulkDiscount.productVariant", "productVariant")
      .where("productVariant.productId = :productId", { productId })
      .getMany();
  }

  async findProductVariantIdBySku(
    ctx: RequestContext,
    sku: string
  ): Promise<ID> {
    return assertFound(
      this.connection
        .getRepository(ctx, ProductVariant)
        .findOne({ where: { sku } })
    ).then((v) => {
      return v.id;
    });
  }

  findOne(
    ctx: RequestContext,
    recommendationId: number
  ): Promise<BulkDiscount | undefined> {
    return this.connection
      .getRepository(ctx, BulkDiscount)
      .findOne({ where: { id: recommendationId }, loadEagerRelations: true });
  }

  async create(
    ctx: RequestContext,
    input: BulkDiscountInput
  ): Promise<BulkDiscount[]> {
    const discounts = [];

    for (const d of input.discounts) {
      const discount = new BulkDiscount({
        productVariant: await this.connection
          .getRepository(ctx, ProductVariant)
          .findOne({ where: { id: input.productVariantId } }),
        quantity: d.quantity,
        price: d.price,
      });

      discounts.push(
        assertFound(
          this.connection.getRepository(ctx, BulkDiscount).save(discount)
        )
      );
    }

    return Promise.all(discounts);
  }

  async update(
    ctx: RequestContext,
    id: number,
    quantity: number,
    price: number
  ) {
    return this.connection
      .getRepository(ctx, BulkDiscount)
      .update({ id }, { quantity, price });
  }

  async delete(ids: ID[]): Promise<DeletionResponse> {
    try {
      await this.connection.rawConnection
        .createQueryBuilder()
        .delete()
        .from(BulkDiscount)
        .where({ id: In(ids) })
        .execute();

      return {
        result: DeletionResult.DELETED,
      };
    } catch (e) {
      return {
        result: DeletionResult.NOT_DELETED,
        message: e?.toString() || `Unkown error: ${JSON.stringify(e)}`,
      };
    }
  }
}
