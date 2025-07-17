// src/components/ProtectedAdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/authContext";

const ProtectedAdminRoute = ({ children }) => {
  const { admin, loading } = useAdmin();

  if (loading) return <p>Loading...</p>;

  if (!admin) return <Navigate to="/admin/login" />;

  return children;
};

export default ProtectedAdminRoute;
