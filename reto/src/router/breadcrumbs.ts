export const breadcrumbs = {
  home: {
    label: "Home",
    path: "/",
  },
  login: {
    label: "Login",
    path: "/login",
  },
  register: {
    label: "Register",
    path: "/register",
  },
  profile: {
    label: "Profile",
    path: "/profile",
  },
  issues: {
    label: "Issues",
    path: "/issues",
  },
  addIssue: {
    label: "Add Issue",
    path: "/issues/add",
  },
  issue: (id: string) => ({
    label: `Issue #${id}`,
    path: `/issues/${id}`,
  }),
  admin: {
    label: "Admin",
    path: "/admin",
  },
};