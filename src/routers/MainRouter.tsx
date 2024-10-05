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
const Articles = lazy(() => import("../pages/articles"));
const Certificates = lazy(() => import("../pages/certificates"));
const Activities = lazy(() => import("../pages/activities"));
const Consultations = lazy(() => import("../pages/consultations"));

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
      {
        path: "articles",
        element: (
          <Suspense fallback={<CircularProgress />}>
            <Articles />
          </Suspense>
        ),
      },
      {
        path: "certificates",
        element: (
          <Suspense fallback={<CircularProgress />}>
            <Certificates />
          </Suspense>
        ),
      },
      {
        path: "consultations",
        element: (
          <Suspense fallback={<CircularProgress />}>
            <Consultations />
          </Suspense>
        ),
      },
      {
        path: "activities",
        element: (
          <Suspense fallback={<CircularProgress />}>
            <Activities />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
