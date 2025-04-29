import { Route, Switch } from "wouter";
import App from "../App";
import Home from "@pages/Home";
import React from "react";

// Wouter doesn't have a router object like react-router
// Instead we export the routes directly
export const Routes = () => (
  <App>
    <Switch>
      <Route path="/" component={Home} />
      {/* Add more routes here as needed */}
    </Switch>
  </App>
);
