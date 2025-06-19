import { types, flow, Instance } from "mobx-state-tree";
import { UserModel } from "./models";
import { adminApi } from "@api/index";

export const AdminStore = types
  .model("AdminStore", {
    users: types.optional(types.array(UserModel), []),
    isLoading: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
  })
  .actions((self) => ({
    setUsers(users: Instance<typeof UserModel>[]) {
      self.users.replace(users.map((user) => UserModel.create(user)));
    },
    setLoading(loading: boolean) {
      self.isLoading = loading;
    },
    setError(error: string | null) {
      self.error = error;
    },
  }))
  .actions((self) => ({
    getUsers: flow(function* () {
      self.setLoading(true);
      self.setError(null);
      try {
        const data = yield adminApi.getUsers();
        self.setUsers(data);
      } catch {
        self.setError("Failed to fetch users");
      } finally {
        self.setLoading(false);
      }
    }),
  }));
