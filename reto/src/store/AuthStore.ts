import { types, flow, Instance } from "mobx-state-tree";
import { UserModel } from "./models";
import { authApi, ApiError } from "@api/index";
import { navigate } from "wouter/use-browser-location";

// Define the AuthStore model
export const AuthStore = types
  .model("AuthStore", {
    user: types.maybeNull(UserModel),
    isAuthenticated: types.optional(types.boolean, false),
    isLoading: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
  })
  .actions((self) => ({
    setUser(user: Instance<typeof UserModel>) {
      self.user = UserModel.create(user);
    },
  }))
  .actions((self) => ({
    login: flow(function* (email: string, password: string) {
      self.isLoading = true;
      self.error = null;
      try {
        const response = yield authApi.login(email, password);
        const user = response.user;
        self.isAuthenticated = true;
        self.setUser(user);
        navigate("/");
        return { success: true };
      } catch (error: unknown) {
        self.error =
          (error as ApiError).message || "Login failed. Please try again.";
        return { success: false, message: self.error };
      } finally {
        self.isLoading = false;
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
    clearAuth() {
      self.user = null;
      self.isAuthenticated = false;
      self.error = null;
    },
  }))
  .actions((self) => ({
    setupAuthListeners() {
      window.addEventListener("auth:expired", () => {
        self.clearAuth();
      });
    },
  }))
  .actions((self) => ({
    afterCreate() {
      self.setupAuthListeners();
    },
  }));
