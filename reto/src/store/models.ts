import { types } from "mobx-state-tree";

export const UserModel = types.model("User", {
  id: types.identifier,
  username: types.string,
  email: types.string,
});

// IssueModel according to issues table
export const IssueModel = types.model("Issue", {
  id: types.identifierNumber,
  title: types.string,
  description: types.maybeNull(types.string),
  photos: types.maybeNull(types.frozen()), // JSON array or null
  coordinates: types.maybeNull(
    types.model({
      x: types.number,
      y: types.number,
    })
  ),
  created_at: types.string,   // ISO string, e.g. "2025-05-28T07:55:49.000Z"
  updated_at: types.string,   // ISO string, e.g. "2025-05-28T07:55:49.000Z"
});

export const UserIssuesListItemModel = types.model("UserIssuesListItem", {
  id: types.identifierNumber,
  title: types.string,
  created_at: types.string,   // ISO string
  updated_at: types.string,   // ISO string
  status: types.string, // Assuming status is a string, adjust as needed
});