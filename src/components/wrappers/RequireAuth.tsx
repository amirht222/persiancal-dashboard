import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

const RequireAuth = (props: PropsWithChildren) => {
  if (
    !localStorage.getItem("accessToken") ||
    localStorage.getItem("role") !== "admin"
  ) {
    return <Navigate to="/login" replace />;
  }
  return <>{props.children}</>;
};

export default RequireAuth;
