import React from "react";
import "./index.css";
import { createHashRouter, RouterProvider } from "react-router";
import ReactDom from "react-dom/client";
import routes from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/authContext";

const queryClient = new QueryClient();
const router = createHashRouter(routes);

ReactDom.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
