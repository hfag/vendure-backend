import { AdminUiExtensionSharedModule } from "@vendure/ui-devkit/compiler";

export { BulkDiscountPlugin } from "./plugin";

export const BulkDiscountsInputModule: AdminUiExtensionSharedModule = {
  type: "shared",
  ngModuleFileName: "bulk-discount-input.module.ts",
  ngModuleName: "BulkDiscountInputModule",
};
