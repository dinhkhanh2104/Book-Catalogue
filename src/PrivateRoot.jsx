import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./contexts/authContext";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? children : <Navigate to="/signin" />;
}

export default PrivateRoute;
