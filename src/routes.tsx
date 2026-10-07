import type { RouteObject } from "react-router";
import Portfolio from "./components/Portfolio";
import NotFound from "./components/NotFound";
import Profile from "./components/Profile";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Portfolio />,
    children: [
      { index: true },
      { path: "projects/:slug" },
    ],
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
