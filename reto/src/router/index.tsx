import { Route, Switch } from "wouter";
import App from "../App";
import {Home} from "@pages";
import React from "react";
import {Login} from "@pages";

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
export const Routes = () => (
  <App>
    <Switch>
      <Route path="/" component={Home} />
      <Route path={"/login"} component={Login} />
      {/* Add more routes here as needed */}
    </Switch>
  </App>
);
