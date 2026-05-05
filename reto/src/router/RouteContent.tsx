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

  // Keep a stable ref to the latest callback to avoid infinite-loop risks
  // when the parent doesn't memoize onBreadcrumbsUpdate with useCallback.
  const onBreadcrumbsUpdateRef = React.useRef(onBreadcrumbsUpdate);
  onBreadcrumbsUpdateRef.current = onBreadcrumbsUpdate;

  // Update breadcrumbs in the store whenever they change
  React.useEffect(() => {
    onBreadcrumbsUpdateRef.current(breadcrumbs);
  }, [breadcrumbs]);

  // Redirect to login if not authenticated and not on login or register page
  React.useEffect(() => {
    if (!authStore.isAuthenticated) {
      if (location !== "/login" && location !== "/register") {
        navigate("/login");
      }
    }
  }, [authStore.isAuthenticated, location, navigate]);

  return render(params);
};
