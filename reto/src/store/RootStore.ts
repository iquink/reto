import { Instance, types } from "mobx-state-tree";
import { AuthStore } from "./AuthStore";
import { IssuesStore } from "./IssuesStore";
import { SettingsStore } from "./SettingsStore";
import { CommonStore } from "./CommonStore";
import { createContext } from "react";
import React from "react";
import { AdminStore } from "./AdminStore";

// Define the RootStore model
const rootStoreModel = types.model("RootStore", {
  authStore: AuthStore,
  issuesStore: IssuesStore,
  settingsStore: SettingsStore,
  adminStore: AdminStore,
  commonStore: CommonStore,
});

// Create an instance of the store
export const rootStore = rootStoreModel.create({
  authStore: {},
  issuesStore: {
    selectedLocation: [],
  },
  settingsStore: {},
  adminStore: {},
  commonStore: {
    breadcrumbs: [],
  },
});

const RootStoreContext = createContext<null | Instance<typeof rootStore>>(null);
export const StoreProvider = RootStoreContext.Provider;

export function useStore() {
  const store = React.useContext(RootStoreContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
}
