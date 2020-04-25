import { AdminUiExtension } from "@vendure/ui-devkit/compiler";

export const bulkDiscountModules: AdminUiExtension["ngModules"] = [
  {
    // We want to lazy-load our extension...
    type: "lazy",
    // ...when the `/admin/extensions/react-ui`
    // route is activated
    route: "react-app",
    // The filename of the extension module
    // relative to the `extensionPath` above
    ngModuleFileName: "react-app.module.ts",
    // The name of the extension module class exported
    // from the module file.
    ngModuleName: "ReactAppModule",
  },
  {
    type: "shared",
    ngModuleFileName: "react-app-shared.module.ts",
    ngModuleName: "ReactAppSharedModule",
  },
];
