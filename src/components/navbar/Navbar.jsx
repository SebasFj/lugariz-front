// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { clearAll } from "../../features/app/appSlice";
import { persistor } from "../../app/store";
import "./Navbar.css"; // hoja de estilos

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);           // logout de Firebase
      dispatch(clearAll());           // limpiar Redux
      await persistor.purge();       // limpiar redux-persist
      navigate("/login");            // redirigir al login
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">HOME</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/usuario/sitios">Mis Sitios</Link></li>
        <li><Link to="/usuario/favoritos">Favoritos</Link></li>
        <li><Link to="/usuario/perfil">Perfil</Link></li>
        <li>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
