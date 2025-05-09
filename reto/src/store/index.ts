import { types } from "mobx-state-tree";

// Define the IUser interface
interface IUser {
  id: string;
  name: string;
  email: string;
}

const UserModel = types.model("User", {
  id: types.identifier,
  name: types.string,
  email: types.string,
});

// Define the AuthStore model
const AuthStore = types
  .model("AuthStore", {
    isAuthenticated: types.optional(types.boolean, false),
    user: types.maybeNull(UserModel),
  })
  .actions((self) => ({
    login(user: IUser) {
      self.isAuthenticated = true;
      self.user = UserModel.create(user);
    },
    logout() {
      self.isAuthenticated = false;
      self.user = null;
    },
  }));

// Define the RootStore model
const RootStore = types.model("RootStore", {
  authStore: AuthStore,
});

// Create an instance of the store
const rootStore = RootStore.create({
  authStore: {},
});

export default rootStore;
