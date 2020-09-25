import { compileUiExtensions } from "@vendure/ui-devkit/compiler";
import * as path from "path";
import { CollectionLinkInputModule } from "./plugins/collection-links";
import { BulkDiscountsInputModule } from "vendure-bulk-discounts";
import { ProductRecommendationsInputModule } from "vendure-product-recommendations";

export const ADMIN_UI_EXTENSIONS = [
  {
    extensionPath: path.join(
      // "/Users/mac/synced-data/Projekte/web-development/node/vendure-product-recommendations/src/ui-extensions/modules/"
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
