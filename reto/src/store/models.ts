import { types } from "mobx-state-tree";

export enum Language {
  EN = "en-US",
  RU = "ru-RU",
  FI = "fi-FI",
  SYSTEM = "system",
}

export enum Status {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  CLOSED = "closed",
}

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  MODERATOR = "moderator",
}

export const UserModel = types.model("User", {
  username: types.string,
  email: types.string,
  fullName: types.maybeNull(types.string),
  createdAt: types.string,
  updatedAt: types.string,
  isActive: types.number,
  role: types.enumeration<UserRole>("UserRole", [
    UserRole.USER,
    UserRole.ADMIN,
    UserRole.MODERATOR,
  ]),
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
  updated_at: types.string, // ISO string, e.g. "2025-05-28T07:55:49.000Z",
  status: types.enumeration<Status>("Status", [
    Status.OPEN, 
    Status.IN_PROGRESS,
    Status.CLOSED,
  ]),
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

export const BreadcrumbItemModel = types.model("BreadcrumbItem", {
  id: types.identifierNumber,
  label: types.string,
  path: types.string,
});
