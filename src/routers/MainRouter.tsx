import CircularProgress from "@mui/material/CircularProgress";
import { Suspense, lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import RootLayout from "../pages/root-layout";
import NotFound from "../components/not-found";

const Login = lazy(() => import("../pages/login"));
const Users = lazy(() => import("../pages/users"));
const Products = lazy(() => import("../pages/products"));
const Labs = lazy(() => import("../pages/labs"));
const Courses = lazy(() => import("../pages/courses"));

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <Suspense fallback={<CircularProgress />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Navigate to={"/users"} />,
      },
      {
        path: "users",
        element: (
          <Suspense fallback={<CircularProgress />}>
            <Users />
          </Suspense>
        ),
      },
      {
        path: "products",
        element: (
          <Suspense fallback={<CircularProgress />}>
            <Products />
          </Suspense>
        ),
      },
      {
        path: "labs",
        element: (
          <Suspense fallback={<CircularProgress />}>
            <Labs />
          </Suspense>
        ),
      },
      {
        path: "courses",
        element: (
          <Suspense fallback={<CircularProgress />}>
            <Courses />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
