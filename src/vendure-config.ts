import {
  examplePaymentHandler,
  DefaultSearchPlugin,
  VendureConfig,
  LanguageCode,
} from "@vendure/core";
import { defaultEmailHandlers, EmailPlugin } from "@vendure/email-plugin";
import { AssetServerPlugin } from "@vendure/asset-server-plugin";
import { AdminUiPlugin } from "@vendure/admin-ui-plugin";
import { compileUiExtensions } from "@vendure/ui-devkit/compiler";
import path from "path";

import {
  ProductRecommendationsPlugin,
  ProductRecommendationsInputModule,
} from "vendure-product-recommendations";
import {
  BulkDiscountPlugin,
  BulkDiscountsInputModule,
} from "vendure-bulk-discounts";
import { ProductDiscountsPlugin } from "./plugins/product-discounts/product-discounts";
import { ProductMinimumOrderQuantityPlugin } from "./plugins/product-minimum-order-quantity/product-minimum-order-quantity";
import { bulkDiscountModules } from "./ui-extensions/modules/ng-module-config";
import { ProductGroupKeyPlugin } from "./plugins/product-group-key-plugin/product-group-key";
import { SeoDescriptionsPlugin } from "./plugins/seo-descriptions/seo-descriptions";
import { CollectionProductsPlugin } from "./plugins/collection-products/collection-products";
import { ProductBySlugPlugin } from "./plugins/product-by-slug/product-by-slug";

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
    type: "mysql",
    synchronize: true, // turn this off for production
    logging: false,
    database: "vendure",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "toor",
    migrations: [path.join(__dirname, "../migrations/*.ts")],
  },
  paymentOptions: {
    paymentMethodHandlers: [examplePaymentHandler],
  },
  customFields: {},
  plugins: [
    AssetServerPlugin.init({
      route: "assets",
      assetUploadDir: path.join(__dirname, "../static/assets"),
      port: 3001,
    }),
    DefaultSearchPlugin,
    EmailPlugin.init({
      devMode: true,
      outputPath: path.join(__dirname, "../static/email/test-emails"),
      mailboxPort: 3003,
      handlers: defaultEmailHandlers,
      templatePath: path.join(__dirname, "../static/email/templates"),
      globalTemplateVars: {
        // The following variables will change depending on your storefront implementation
        fromAddress: '"example" <noreply@example.com>',
        verifyEmailAddressUrl: "http://localhost:8080/verify",
        passwordResetUrl: "http://localhost:8080/password-reset",
        changeEmailAddressUrl:
          "http://localhost:8080/verify-email-address-change",
      },
    }),
    AdminUiPlugin.init({
      port: 3002,
      app: compileUiExtensions({
        outputPath: path.join(__dirname, "../__admin-ui"),
        extensions: [
          {
            // Points to the path containing our Angular "glue code" module
            extensionPath: path.join(__dirname, "ui-extensions/modules"),
            ngModules: [...bulkDiscountModules],
            staticAssets: [
              {
                path: path.join(__dirname, "ui-extensions/react-app/build"),
                rename: "react-app",
              },
            ],
          },
          {
            extensionPath: path.join(
              __dirname,
              "../node_modules/vendure-product-recommendations/ui-extensions/modules/"
            ),
            ngModules: [ProductRecommendationsInputModule],
          },
          {
            extensionPath: path.join(
              __dirname,
              "../node_modules/vendure-bulk-discounts/ui-extensions/modules/"
            ),
            ngModules: [BulkDiscountsInputModule],
          },
        ],
        devMode: true,
      }),
    }),
    ProductRecommendationsPlugin,
    BulkDiscountPlugin,
    ProductDiscountsPlugin,
    ProductMinimumOrderQuantityPlugin,
    ProductGroupKeyPlugin,
    SeoDescriptionsPlugin,
    CollectionProductsPlugin,
    ProductBySlugPlugin,
  ],
};
