import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import { router } from "@/router";
import { useAuthStore } from "@/store";

function App() {
  useEffect(() => {
    void useAuthStore.getState().refreshUser().catch(() => {
      useAuthStore.setState({
        status: "anonymous",
        user: null,
        initialized: true,
        isAuthenticated: false,
        isLoading: false,
      });
    });
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
