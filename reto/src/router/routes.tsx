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
};

export type RouteParams = Record<string, string>;

export type RouteConfig = {
  path: string;
  render: (
    params?: RouteParams,
    onRouteChanged?: (items: Breadcrumb[]) => void
  ) => React.ReactElement;
};

export const routerConfig: RouteConfig[] = [
  {
    path: "/",
    render: (
      _params?: RouteParams,
      onRouteChanged?: (items: Breadcrumb[]) => void
    ) => {
      onRouteChanged?.([home]);

      return <Home />;
    },
  },
  {
    path: "/login",
    render: (
      _params?: RouteParams,
      onRouteChanged?: (items: Breadcrumb[]) => void
    ) => {
      onRouteChanged?.([home, login]);

      return <Login />;
    },
  },
  {
    path: "/register",
    render: (
      _params?: RouteParams,
      onRouteChanged?: (items: Breadcrumb[]) => void
    ) => {
      onRouteChanged?.([home, register]);

      return <Register />;
    },
  },
  {
    path: "/profile",
    render: (
      _params?: RouteParams,
      onRouteChanged?: (items: Breadcrumb[]) => void
    ) => {
      onRouteChanged?.([home, profile]);

      return <Profile />;
    },
  },
  {
    path: "/issues",
    render: (
      _params?: RouteParams,
      onRouteChanged?: (items: Breadcrumb[]) => void
    ) => {
      onRouteChanged?.([home, issues]);

      return <Issues />;
    },
  },
  {
    path: "/issues/add",
    render: (
      _params?: RouteParams,
      onRouteChanged?: (items: Breadcrumb[]) => void
    ) => {
      onRouteChanged?.([home, issues, addIssue]);

      return <AddIssue />;
    },
  },
  {
    path: "/issues/:id",
    render: (
      params?: RouteParams,
      onRouteChanged?: (items: Breadcrumb[]) => void
    ) => {
      if (params?.id === "add") {
        onRouteChanged?.([home, issues, addIssue]);

        return <AddIssue />;
      }
      onRouteChanged?.([home, issues, issue(params?.id ?? "")]);

      return <Issue id={params?.id ?? ""} />;
    },
  },
  {
    path: "/admin",
    render: (
      _params?: RouteParams,
      onRouteChanged?: (items: Breadcrumb[]) => void
    ) => {
      onRouteChanged?.([home, admin]);

      return <Admin />;
    },
  },
];
