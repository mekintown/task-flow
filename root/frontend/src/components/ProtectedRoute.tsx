import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const ProtectedRoute = () => {
  const location = useLocation();
  const { user, isLoading } = useUserContext();

  if (isLoading) {
    // Return null or some loading indicator while the user state is being loaded
    return <div>Loading...</div>; // You can replace this with a spinner or any loading indicator
  }

  if (!user) {
    // Redirect to the /login page if not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
