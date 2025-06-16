import { Route, Switch } from "wouter";
import App from "../App";
import React, { JSX } from "react";
import { RouteParams, routerConfig, Breadcrumb } from "./routes";
import { useStore } from "@store/index";

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
  const onRouteChanged = (breadcrumbs: Breadcrumb[]): void => {
    commonStore.setBreadcrumbs(breadcrumbs);
  };
  return (
    <App>
      <Switch>
        {routerConfig.map((route) => {
          const { path, render, breadcrumbs } = route;
          return (
            <Route key={path} path={path}>
              {(params: RouteParams) => (
                <RouteWithBreadcrumbs
                  render={render}
                  params={params}
                  breadcrumbs={breadcrumbs(params)}
                  onRouteChanged={onRouteChanged}
                />
              )}
            </Route>
          );
        })}
      </Switch>
    </App>
  );
};

interface RouteWithBreadcrumbsProps {
  render: (params?: RouteParams) => React.ReactElement;
  params?: RouteParams;
  breadcrumbs: Breadcrumb[];
  onRouteChanged: (items: Breadcrumb[]) => void;
}

const RouteWithBreadcrumbs: React.FC<RouteWithBreadcrumbsProps> = ({ render, params, breadcrumbs, onRouteChanged }) => {
  React.useEffect(() => {
    onRouteChanged(breadcrumbs);
  }, [breadcrumbs, onRouteChanged]);
  return render(params);
};
