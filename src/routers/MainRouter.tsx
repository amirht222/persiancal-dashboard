import CircularProgress from "@mui/material/CircularProgress";
import { Suspense, lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import RootLayout from "../pages/root-layout";
import NotFound from "../components/not-found";
import RequireAuth from "../components/wrappers/RequireAuth";

const Login = lazy(() => import("../pages/login"));
const Users = lazy(() => import("../pages/users"));
const Products = lazy(() => import("../pages/products"));
const Labs = lazy(() => import("../pages/labs"));
const Courses = lazy(() => import("../pages/courses"));
const Feedbacks = lazy(() => import("../pages/feedbacks"));

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
    element: (
      <RequireAuth>
        <RootLayout />
      </RequireAuth>
    ),
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
      {
        path: "feedbacks",
        element: (
          <Suspense fallback={<CircularProgress />}>
            <Feedbacks />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
