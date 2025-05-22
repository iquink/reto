import { types } from "mobx-state-tree";

export const UserModel = types.model("User", {
    id: types.identifier,
    username: types.string,
    email: types.string,
  });    