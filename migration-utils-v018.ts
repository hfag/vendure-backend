import { QueryRunner } from "typeorm";

export async function migrateOrderItemPromotionsAndTaxes(
  queryRunner: QueryRunner
) {
  const items = await q(
    queryRunner,
    {
      mysql: "SELECT `id`, `adjustments`, `taxRate` from `order_item`",
      postgres: 'SELECT "id", "adjustments", "taxRate" from "order_item"',
    },
    []
  );
  for (const item of items) {
    const adjustments = JSON.parse(item.adjustments);
    const promotions = [];
    const taxLines = [];
    for (const adjustment of adjustments) {
      if (adjustment.type === "TAX") {
        taxLines.push({ description: "tax", taxRate: item.taxRate });
      }
      if (adjustment.type === "PROMOTION") {
        promotions.push(adjustment);
      }
    }
    await q(
      queryRunner,
      {
        mysql: "UPDATE `order_item` SET `adjustments` = ? WHERE `id` = ?",
        postgres: 'UPDATE "order_item" SET "adjustments" = $1 WHERE "id" = $2',
      },
      [JSON.stringify(promotions), item.id]
    );

    await q(
      queryRunner,
      {
        mysql: "UPDATE `order_item` SET `taxLines` = ? WHERE `id` = ?",
        postgres: 'UPDATE "order_item" SET "taxLines" = $1 WHERE "id" = $2',
      },
      [JSON.stringify(taxLines), item.id]
    );
  }
}

export async function migrateOrderShippingToShippingLines(
  queryRunner: QueryRunner
) {
  const orders = await q(
    queryRunner,
    {
      mysql:
        "SELECT `id`, `shipping`, `shippingWithTax`, `shippingMethodId` from `order` WHERE `shippingMethodId` IS NOT NULL",
      postgres:
        'SELECT "id", "shipping", "shippingWithTax", "shippingMethodId" from "order" WHERE "shippingMethodId" IS NOT NULL',
    },
    []
  );
  for (const order of orders) {
    const shippingTax = (order.shippingWithTax / order.shipping) * 100 - 100;
    const taxLines = JSON.stringify([
      { description: "shipping tax", taxRate: shippingTax.toFixed(2) },
    ]);
    await q(
      queryRunner,
      {
        mysql:
          "INSERT INTO `shipping_line` (`listPrice`, `listPriceIncludesTax`, `adjustments`, `taxLines`, `shippingMethodId`, `orderId`) " +
          " VALUES (?, ?, ?, ?, ?, ?)",
        postgres:
          'INSERT INTO "shipping_line" ("listPrice", "listPriceIncludesTax", "adjustments", "taxLines", "shippingMethodId", "orderId") ' +
          " VALUES ($1, $2, $3, $4, $5, $6)",
      },
      [order.shipping, false, "[]", taxLines, order.shippingMethodId, order.id]
    );
  }
}

export async function addProductVariantsToProductChannels(
  queryRunner: QueryRunner
) {
  const variants = await q(
    queryRunner,
    {
      mysql:
        "SELECT `v`.`id` AS productVariantId, `pcc`.`productId` AS productId, `pcc`.`channelId` as channelId FROM " +
        "`product_variant` AS `v` INNER JOIN `product_channels_channel` AS `pcc` ON `pcc`.`productId` = `v`.`productId`",
      postgres:
        'SELECT "v"."id" AS "productVariantId", "pcc"."productId" AS "productId", "pcc"."channelId" as "channelId" FROM ' +
        '"product_variant" AS "v" INNER JOIN "product_channels_channel" AS "pcc" ON "pcc"."productId" = "v"."productId"',
    },
    []
  );
  for (const variant of variants) {
    await q(
      queryRunner,
      {
        mysql:
          "INSERT INTO `product_variant_channels_channel` (`productVariantId`, `channelId`) VALUES (?, ?)",
        postgres:
          'INSERT INTO "product_variant_channels_channel" ("productVariantId", "channelId") VALUES ($1, $2)',
      },
      [variant.productVariantId, variant.channelId]
    );
  }
}

export async function migrateOrderAdjustmentsToSurcharges(
  queryRunner: QueryRunner
) {
  const orders = await q(queryRunner, {
    mysql: "SELECT `id`, `pendingAdjustments` from `order`",
    postgres: 'SELECT "id", "pendingAdjustments" from "order"',
  });
  for (const order of orders) {
    const adjustments = JSON.parse(order.pendingAdjustments);
    for (const adjustment of adjustments) {
      await q(
        queryRunner,
        {
          mysql:
            "INSERT INTO `surcharge` (`description`, `sku`, `listPrice`, `listPriceIncludesTax`, `taxLines`, `orderId`) VALUES (?, ?, ?, ?, ?, ?)",
          postgres:
            'INSERT INTO "surcharge" ("description", "sku", "listPrice", "listPriceIncludesTax", "taxLines", "orderId") VALUES ($1, $2, $3, $4, $5, $6)',
        },
        [adjustment.description, "", adjustment.amount, true, "[]", order.id]
      );
      await q(
        queryRunner,
        {
          mysql:
            "UPDATE `order` SET `subTotal` = `subTotal` + ?, `subTotalWithTax` = `subTotalWithTax` + ? WHERE `id` = ?",
          postgres:
            'UPDATE "order" SET "subTotal" = "subTotal" + $1, "subTotalWithTax" = "subTotalWithTax" + $2 WHERE "id" = $3',
        },
        [adjustment.amount, adjustment.amount, order.id]
      );
    }
  }
}

export async function migrateDefaultShippingCalculatorArgs(
  queryRunner: QueryRunner
) {
  const methods = await q(queryRunner, {
    mysql: "SELECT `id`, `calculator` from `shipping_method`",
    postgres: 'SELECT "id", "calculator" from "shipping_method"',
  });
  for (const method of methods) {
    const calculator = JSON.parse(method.calculator);
    if (calculator.code === "default-shipping-calculator") {
      calculator.args.push({ name: "includesTax", value: "auto" });
      await q(
        queryRunner,
        {
          mysql: "UPDATE `shipping_method` SET `calculator` = ? WHERE `id` = ?",
          postgres:
            'UPDATE "shipping_method" SET "calculator" = $1 WHERE "id" = $2',
        },
        [JSON.stringify(calculator), method.id]
      );
    }
  }
}

function q(
  queryRunner: QueryRunner,
  query: { mysql: string; postgres: string },
  params: any[] = []
) {
  return queryRunner.query(
    isPostgres(queryRunner) ? query.postgres : query.mysql,
    params
  );
}

function isPostgres(queryRunner: QueryRunner): boolean {
  const { type } = queryRunner.connection.options;
  return type === "postgres" || type === "cockroachdb";
}
