import { types } from "mobx-state-tree";

export enum Language {
  EN = "en-US",
  RU = "ru-RU",
  FI = "fi-FI",
  SYSTEM = "system",
}

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
  created_at: types.string, // ISO string, e.g. "2025-05-28T07:55:49.000Z"
  updated_at: types.string, // ISO string, e.g. "2025-05-28T07:55:49.000Z"
});

export const UserIssuesListItemModel = types.model("UserIssuesListItem", {
  id: types.identifierNumber,
  title: types.string,
  created_at: types.string, // ISO string
  updated_at: types.string, // ISO string
  status: types.string, // Assuming status is a string, adjust as needed
});

export const LanguageEnumModel = types.enumeration<Language>("Language", [
  Language.EN,
  Language.RU,
  Language.FI,
  Language.SYSTEM,
]);
