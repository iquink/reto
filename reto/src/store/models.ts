import { types } from "mobx-state-tree";

export const UserModel = types.model("User", {
    id: types.identifier,
    username: types.string,
    email: types.string,
});

// IssueModel according to issues table
export const IssueModel = types.model("Issue", {
    id: types.identifierNumber,
    userId: types.number,
    title: types.string,
    description: types.maybeNull(types.string),
    photos: types.maybeNull(types.frozen()), // JSON array or null
    coordinates: types.maybeNull(types.string),
    created_at: types.string,
    updated_at: types.string,
});