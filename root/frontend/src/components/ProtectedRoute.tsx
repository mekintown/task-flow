import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const ProtectedRoute = () => {
  const { user } = useUserContext();
  const location = useLocation();

  if (!user) {
    // Redirect to the /login page and pass the current location in state
    // This state can be accessed in the login page to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
