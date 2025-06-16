import { types, flow, Instance } from "mobx-state-tree";
import { UserModel } from "./models";
import { authApi, ApiError } from "@api/index";
import { navigate } from "wouter/use-browser-location";

// Define the AuthStore model
export const AuthStore = types
  .model("AuthStore", {
    isAuthenticated: types.optional(types.boolean, false),
    user: types.maybeNull(UserModel),
  })
  .actions((self) => ({
    setUser(user: Instance<typeof UserModel>) {
      self.user = UserModel.create(user);
    },
  }))
  .actions((self) => ({
    login: flow(function* (email: string, password: string) {
      try {
        const response = yield authApi.login(email, password);
        const user = response.user;
        self.isAuthenticated = true;
        self.setUser(user);
        navigate("/");
        return { success: true };
      } catch (error: unknown) {
        return {
          success: false,
          message:
            (error as ApiError).message || "Login failed. Please try again.",
        };
      }
    }),
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
    checkAuthorization: flow(function* () {
      try {
        const user = yield authApi.getCurrentUser();
        self.isAuthenticated = true;
        self.setUser(user);
      } catch (error) {
        console.error("Authorization check failed:", error);
        self.isAuthenticated = false;
        self.user = null;
      }
    }),
  }));
