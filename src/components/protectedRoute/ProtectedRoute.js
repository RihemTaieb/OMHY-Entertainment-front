import { Navigate, Outlet } from "react-router-dom";

const SESSION_TIMEOUT = 60 * 60 * 2000; // 1 heure en millisecondes

const ProtectedRoute = () => {
  const token = localStorage.getItem("authToken");
  const loginTime = localStorage.getItem("loginTime");

  if (!token || !loginTime) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  const currentTime = new Date().getTime();
  const elapsedTime = currentTime - parseInt(loginTime, 10);

  if (elapsedTime > SESSION_TIMEOUT) {
    localStorage.removeItem("authToken"); // Supprime le token
    localStorage.removeItem("loginTime"); // Supprime le temps de connexion
    return <Navigate to="/auth/sign-in" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
