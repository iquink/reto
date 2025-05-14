import { types } from "mobx-state-tree";
import { UserModel } from "./models";

// Define the IUser interface
interface IUser {
    id: string;
    name: string;
    email: string;
  }

// Define the AuthStore model
export const AuthStore = types
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