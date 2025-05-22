import { cast, types } from "mobx-state-tree";

// Define the IssuesStore model (empty, similar structure to AuthStore)
export const IssuesStore = types
  .model("IssuesStore", {
    selectedLocation: types.maybeNull(types.array(types.number)),
  })
  .actions((self) => ({
    setSelectedLocation(location: number[] | null) {
      self.selectedLocation = location ? cast(location) : null;
    },
  }));
