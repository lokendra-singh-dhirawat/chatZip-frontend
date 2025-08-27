import { lazy, Suspense, type JSX } from "react";
import { Navigate } from "react-router";
import { useAuth } from "./context/authContext";

const RootLayout = lazy(() => import("./layout/rootLayout"));
const LoginForm = lazy(() => import("./authentication/login"));
const RegisterForm = lazy(() => import("./authentication/registeration"));
const ChangePasswordForm = lazy(
  () => import("./authentication/changePassword")
);

const NotFoundError = lazy(() => import("./misc/NotFoundError"));

const S = (el: JSX.Element) => (
  <Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
    {el}
  </Suspense>
);

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading authentication...</div>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const routes = [
  {
    path: "login",
    element: S(<LoginForm />),
  },
  {
    path: "register",
    element: S(<RegisterForm />),
  },
  {
    path: "/",
    element: S(<RootLayout />),
    children: [
      {
        path: "change-password",
        element: S(
          <PrivateRoute>
            <ChangePasswordForm />
          </PrivateRoute>
        ),
      },
    ],
  },
  { path: "*", element: S(<NotFoundError />) },
];

export default routes;
