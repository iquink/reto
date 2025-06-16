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
import { BreadcrumbItemModel } from "@store/models";
import { Instance } from "mobx-state-tree";
import React, { JSX } from "react";

export type RouteParams = Record<string, string>;

export type RouteConfig = {
  path: string;
  render: (
    params?: RouteParams,
    onRouteChanged?: (items: Instance<typeof BreadcrumbItemModel>[]) => void
  ) => JSX.Element;
};

const breadcrumbs = {
  home: {
    id: 1,
    label: "Home",
    path: "/",
  },
};

export const routerConfig: RouteConfig[] = [
  {
    path: "/",
    render: (
      _params?: RouteParams,
      onRouteChanged?: (items: Instance<typeof BreadcrumbItemModel>[]) => void
    ) => {
      onRouteChanged?.([breadcrumbs.home]);

      return <Home />;
    },
  },
  { path: "/login", render: () => <Login /> },
  { path: "/register", render: () => <Register /> },
  { path: "/profile", render: () => <Profile /> },
  { path: "/issues", render: () => <Issues /> },
  {
    path: "/issues/:id",
    render: (params?: RouteParams) =>
      params && params.id === "add" ? (
        <AddIssue />
      ) : (
        <Issue id={params ? params.id : ""} />
      ),
  },
  { path: "/admin", render: () => <Admin /> },
];
