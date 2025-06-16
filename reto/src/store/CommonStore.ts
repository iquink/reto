import { types, Instance } from "mobx-state-tree";
import { BreadcrumbItemModel } from "./models";

export const CommonStore = types
  .model("CommonStore", {
    breadcrumbs: types.array(BreadcrumbItemModel),
  })
  .actions((self) => ({
    setBreadcrumbs(items: Instance<typeof BreadcrumbItemModel>[]) {
      self.breadcrumbs.replace(items);
    },
  }));