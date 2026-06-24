import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#525252]">
        Loading…
      </div>
    );
  }
  if (user === false) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }
  return children;
}
