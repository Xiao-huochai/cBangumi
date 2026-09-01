import { RouterProvider } from "react-router-dom";

import { useAuth } from "@/hooks";
import { router } from "@/router";

function App() {
  useAuth();

  return <RouterProvider router={router} />;
}

export default App;
