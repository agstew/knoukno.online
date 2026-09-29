import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) return <p style={{ textAlign: "center", padding: 40 }}>Loading...</p>;
  if (!token) return <Navigate to="/login" replace />;

  return children;
}
