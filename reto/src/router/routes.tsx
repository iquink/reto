import React from "react";
import {
  Home,
  Login,
  Register,
  Profile,
  AddIssue,
  Issues,
  Issue,
  Admin,
} from "@pages/index";
import { breadcrumbs } from "./breadcrumbs";

const { home, login, register, profile, issues, addIssue, issue, admin } =
  breadcrumbs;

export type Breadcrumb = {
  label: string;
  path: string;
  params?: Record<string, string>;
};

export type RouteParams = Record<string, string>;

export type RouteConfig = {
  path: string;
  render: (params?: RouteParams) => React.ReactElement;
  breadcrumbs: (params?: RouteParams) => Breadcrumb[];
};

export const routerConfig: RouteConfig[] = [
  {
    path: "/",
    render: () => <Home />,
    breadcrumbs: () => [],
  },
  {
    path: "/login",
    render: () => <Login />,
    breadcrumbs: () => [home, login],
  },
  {
    path: "/register",
    render: () => <Register />,
    breadcrumbs: () => [home, register],
  },
  {
    path: "/profile",
    render: () => <Profile />,
    breadcrumbs: () => [home, profile],
  },
  {
    path: "/issues",
    render: () => <Issues />,
    breadcrumbs: () => [home, issues],
  },
  {
    path: "/issues/add",
    render: () => <AddIssue />,
    breadcrumbs: () => [home, issues, addIssue],
  },
  {
    path: "/issues/:id",
    render: (params) =>
      params?.id === "add" ? <AddIssue /> : <Issue id={params?.id ?? ""} />,
    breadcrumbs: (params) =>
      params?.id === "add"
        ? [home, issues, addIssue]
        : [home, issues, issue(params?.id ?? "")],
  },
  {
    path: "/admin",
    render: () => <Admin />,
    breadcrumbs: () => [home, admin],
  },
];
