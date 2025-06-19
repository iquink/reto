import { useStore } from "@store/index";
import React from "react";
import { useLocation } from "wouter";
import { Breadcrumb, RouteParams } from "./routes";

interface RouteContentProps {
  render: (params?: RouteParams) => React.ReactElement;
  params?: RouteParams;
  breadcrumbs: Breadcrumb[];
  onBreadcrumbsUpdate: (items: Breadcrumb[]) => void;
}

export const RouteContent: React.FC<RouteContentProps> = ({
  render,
  params,
  breadcrumbs,
  onBreadcrumbsUpdate,
}) => {
  const [location, navigate] = useLocation();
  const { authStore } = useStore();

    // Update breadcrumbs in the store whenever they change
  React.useEffect(() => {
    onBreadcrumbsUpdate(breadcrumbs);
  }, [breadcrumbs, onBreadcrumbsUpdate]);

    // Redirect to login if not authenticated and not on login or register page
  React.useEffect(() => {
    if (!authStore.isAuthenticated) {
      if (location !== "/login" && location !== "/register") {
        navigate("/");
      }
    }
  }, [authStore.isAuthenticated, location, navigate]);

  return render(params);
};
