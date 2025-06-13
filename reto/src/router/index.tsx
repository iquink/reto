import { Route, Switch } from "wouter";
import App from "../App";
import { Home, Login, Register, Profile, AddIssue, Issues, Issue, Admin } from "@pages/index";
import React from "react";

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
      <Route path={"/register"} component={Register} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/issues"} component={Issues} />
      <Route path={"/issues/:id"} >
      {params => params.id === "add" ? <AddIssue /> : <Issue id={params.id} />}
      </Route>
      <Route path="/admin" component={Admin} />
    </Switch>
  </App>
);
