import * as path from "path";

import { compileUiExtensions } from "@vendure/ui-devkit/compiler";

import { BulkDiscountsInputModule } from "./plugins/vendure-bulk-discounts";

export const ADMIN_UI_EXTENSIONS = [
  /*{
    extensionPath: path.join(
      // "/Users/mac/synced-data/Projekte/web-development/node/vendure-product-recommendations/src/ui-extensions/modules/"
      __dirname,
      "../node_modules/vendure-product-recommendations/ui-extensions/modules/"
    ),
    ngModules: [ProductRecommendationsInputModule],
  },*/
  {
    extensionPath: path.join(
      __dirname,
      "plugins/vendure-bulk-discounts/ui-extensions/modules/"
    ),
    ngModules: [BulkDiscountsInputModule],
  },
];

compileUiExtensions({
  outputPath: path.join(__dirname, "..", "dist/admin-ui/"),
  extensions: ADMIN_UI_EXTENSIONS,
})
  .compile?.()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => console.error(e));
