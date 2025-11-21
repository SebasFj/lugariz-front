// src/components/Error404.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Error404.css";

function Error404() {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <h1>404</h1>
      <p>Página no encontrada</p>
      <button onClick={() => navigate("/")}>Volver al inicio</button>
    </div>
  );
}

export default Error404;
