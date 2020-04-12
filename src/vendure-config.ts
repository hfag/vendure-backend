import {
  examplePaymentHandler,
  DefaultSearchPlugin,
  VendureConfig,
} from "@vendure/core";
import { defaultEmailHandlers, EmailPlugin } from "@vendure/email-plugin";
import { AssetServerPlugin } from "@vendure/asset-server-plugin";
import { AdminUiPlugin } from "@vendure/admin-ui-plugin";
import path from "path";

import { RandomCatPlugin } from "./plugins/random-cats";
import { ProductRecommendationPlugin } from "./plugins/product-recommendations/product-recommendations";

export const config: VendureConfig = {
  authOptions: {
    sessionSecret: "54snj4hf5e",
  },
  port: 3000,
  adminApiPath: "admin-api",
  shopApiPath: "shop-api",
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
    AdminUiPlugin.init({ port: 3002 }),
    RandomCatPlugin,
    ProductRecommendationPlugin,
  ],
};
