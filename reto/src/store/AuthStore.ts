import { types, flow } from "mobx-state-tree";
import { UserModel } from "./models";
import authApi from "@api/authApi";
import { navigate } from "wouter/use-browser-location";

// Define the IUser interface
interface IUser {
  id: string;
  username: string;
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
    logout: flow(function* () {
      try {
        yield authApi.logout();
        self.isAuthenticated = false;
        self.user = null;
        navigate("/");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }),
  }))
  .actions((self) => ({
    checkAuthorization: flow(function* () {
      try {
        const user = yield authApi.getCurrentUser();
        self.login({ ...user, id: user.id.toString() }); // Update the store with user data
      } catch (error) {
        console.error("Authorization check failed:", error);
        self.isAuthenticated = false;
        self.user = null;
      }
    }),
  }));
