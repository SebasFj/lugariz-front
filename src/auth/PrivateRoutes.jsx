import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Navbar from "../components/navbar/Navbar";

const PrivateRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />; // redirige si no está logueado
  }

  return (
  <div>
    <Navbar/>
    <Outlet />
  </div>
); // renderiza rutas hijas
};

export default PrivateRoutes;
