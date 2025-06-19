import { Route, Switch } from "wouter";
import App from "../App";
import React, { JSX } from "react";
import { RouteParams, routerConfig, Breadcrumb } from "./routes";
import { useStore } from "@store/index";
import { Instance } from "mobx-state-tree";
import { BreadcrumbItemModel } from "@store/models";
import { RouteContent } from "./RouteContent";

/**
 * Defines the application's routing structure using Wouter.
 *
 * This component exports the routes directly, as Wouter does not use a router object
 * like React Router. The `Routes` component wraps the application's routes inside
 * the `App` component and uses a `Switch` to render the appropriate component
 * based on the current path.
 *
 * @returns {JSX.Element} The application's routing structure.
 */
export const Routes = (): JSX.Element => {
  const { commonStore } = useStore();
  const onBreadcrumbsUpdate = (breadcrumbs: Breadcrumb[]): void => {
    commonStore.setBreadcrumbs(
      breadcrumbs as Instance<typeof BreadcrumbItemModel>[]
    );
  };
  return (
    <App>
      <Switch>
        {routerConfig.map((route) => {
          const { path, render, breadcrumbs } = route;
          return (
            <Route key={path} path={path}>
              {(params: RouteParams) => (
                <RouteContent
                  render={render}
                  params={params}
                  breadcrumbs={breadcrumbs(params)}
                  onBreadcrumbsUpdate={onBreadcrumbsUpdate}
                />
              )}
            </Route>
          );
        })}
      </Switch>
    </App>
  );
};


