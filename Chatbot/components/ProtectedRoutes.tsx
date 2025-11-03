
import { Navigate, Outlet } from "react-router";
// import { AuthContext } from "../auth/AuthContext"; // adjust path
// import { AuthContext } from "../src/Context/AuthContext"; // adjust path
// import React from "react";
import { useUserContext } from '../src/Context/UserContext';

const ProtectedRoute = () => {
  // const auth = useContext(AuthContext);
  const { user } = useUserContext();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
