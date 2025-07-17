// components/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUser();

  if (loading) return <div className="text-white">Loading...</div>;

  // Agar user login ho chuka ho to usse redirect kar do
  if (isAuthenticated) return <Navigate to="/" replace />;

  return children;
};

export default PublicRoute;
