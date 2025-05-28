import React, { useContext } from "react";
import { AuthContext } from "../context/context";
import { Navigate } from "react-router-dom";
const useAuth = () => useContext(AuthContext);
const RoleRoute = ({ children, requiredRole }) => {
  const { user, isAdmin, loading } = useAuth();
  console.log("user in role route", user);
  console.log("loading in role route", loading);
  console.log("requiredRole in role route", requiredRole);
  console.log("isAdmin in role route", isAdmin);
  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;
  if (user.role !== requiredRole) return <Navigate to="/login" />;
  return children;
};

export default RoleRoute;
