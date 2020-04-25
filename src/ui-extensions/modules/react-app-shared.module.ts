import { NgModule } from "@angular/core";
import { SharedModule, addNavMenuSection } from "@vendure/admin-ui/core";

@NgModule({
  imports: [SharedModule],
  providers: [
    addNavMenuSection(
      {
        id: "react-app",
        label: "React app",
        items: [
          {
            id: "react-app",
            label: "React app",
            routerLink: ["/extensions/react-app"],
            icon: "coin-bag",
          },
        ],
      },
      // Add this section before the "settings" section
      "settings"
    ),
  ],
})
export class ReactAppSharedModule {}
