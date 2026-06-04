import { createBrowserRouter } from "react-router-dom";

import HomeView from "../views/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeView />,
  },
]);
