import {
  VendureConfig,
  LanguageCode,
  DefaultSearchPlugin,
  DefaultJobQueuePlugin,
} from "@vendure/core";
import { ElasticsearchPlugin } from "@vendure/elasticsearch-plugin";
import { EmailPlugin } from "@vendure/email-plugin";
import { AssetServerPlugin } from "@vendure/asset-server-plugin";
import { AdminUiPlugin } from "@vendure/admin-ui-plugin";
import path from "path";

import { ProductRecommendationsPlugin } from "vendure-product-recommendations";
import { BulkDiscountPlugin } from "vendure-bulk-discounts";
import { ProductMinimumOrderQuantityPlugin } from "./plugins/product-minimum-order-quantity/product-minimum-order-quantity";
import { ProductGroupKeyPlugin } from "./plugins/product-group-key-plugin/product-group-key";
import { CollectionProductsPlugin } from "./plugins/collection-products/collection-products";
import { ProductBySlugPlugin } from "./plugins/product-by-slug/product-by-slug";
import { InvoicePaymentIntegration } from "./plugins/invoice-payment-method/invoice-payment-method";
import { emailHandlers } from "./plugins/custom-emails/custom-emails";
import { CustomerGroupDiscountsPlugin } from "./plugins/customer-group-discounts/customer-group-discounts";
import { CollectionLinksPlugin } from "./plugins/collection-links";
import { AssetByNamePlugin } from "./plugins/asset-by-name/asset-by-name";
import { ADMIN_UI_EXTENSIONS } from "./compile-admin-ui";

export const config: VendureConfig = {
  defaultLanguageCode: LanguageCode.de,
  authOptions: {
    tokenMethod: "bearer",
  },
  apiOptions: {
    port: 3000,
    adminApiPath: "admin-api",
    shopApiPath: "shop-api",
    adminApiPlayground: true,
    shopApiPlayground: true,
  },
  dbConnectionOptions: {
    type: "sqlite",
    synchronize: true, // turn this off for production
    logging: false,
    database: "vendure",
    migrations: [path.join(__dirname, "../migrations/*.ts")],
    // debug: ["ComQueryPacket"],
  },
  paymentOptions: {
    paymentMethodHandlers: [InvoicePaymentIntegration],
  },
  customFields: {},
  plugins: [
    AssetServerPlugin.init({
      route: "assets",
      assetUploadDir: path.join(__dirname, "../static/assets"),
    }),
    DefaultJobQueuePlugin,
    DefaultSearchPlugin,
    // ElasticsearchPlugin.init({
    //   host: "http://localhost",
    //   port: 9200,
    //   searchConfig: {
    //     boostFields: {
    //       sku: 100 /* if sku matches, give really high score */,
    //     },
    //     mapQuery: (query, input, searchConfig, channelId, enabledOnly) => {
    //       if (query.bool.must) {
    //         delete query.bool.must;
    //       }
    //       query.bool.should = [
    //         {
    //           query_string: {
    //             query: "*" + input + "*",
    //             fields: [
    //               `productName^${searchConfig.boostFields.productName}`,
    //               `productVariantName^${searchConfig.boostFields.productVariantName}`,
    //             ],
    //           },
    //         },
    //         {
    //           multi_match: {
    //             query: input,
    //             type: searchConfig.multiMatchType,
    //             fields: [
    //               `description^${searchConfig.boostFields.description}`,
    //               `sku^${searchConfig.boostFields.sku}`,
    //             ],
    //           },
    //         },
    //       ];

    //       return query;
    //     },
    //   },
    // }),
    EmailPlugin.init({
      route: "mailbox",
      handlers: emailHandlers,
      templatePath: path.join(__dirname, "../static/email/templates"),
      devMode: true,
      outputPath: path.join(__dirname, "../static/email/test-emails"),
      globalTemplateVars: {
        // The following variables will change depending on your storefront implementation
        fromAddress: '"Hauser Feuerschutz AG" <info@feuerschutz.ch>',
        frontendUrl: "https://beta.feuerschutz.ch",
        assetUrl: "https://vendure.feuerschutz.ch/assets",
      },
    }),
    AdminUiPlugin.init({
      route: "admin",
      port: 3002,
      app: {
        path: path.join(__dirname, "..", "admin-ui/admin-ui/dist"),
      },
    }),
    CollectionLinksPlugin,
    ProductRecommendationsPlugin,
    BulkDiscountPlugin,
    CustomerGroupDiscountsPlugin,
    ProductMinimumOrderQuantityPlugin,
    ProductGroupKeyPlugin,
    CollectionProductsPlugin,
    ProductBySlugPlugin,
    AssetByNamePlugin,
  ],
};
