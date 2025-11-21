import React, { useState } from "react";
import "./Home.css";
import SitiosView from "../components/sitios/SitiosView";
import { EventosView } from "../components/eventos/EventosView";
import { RecomendadosView } from "../components/recomendados/RecomendadosView";

export default function Home() {
  const [tab, setTab] = useState("sitios"); // pestaña activa

  return (
    <div className="home-container">
      {/* ---------- BARRA LATERAL ---------- */}
      <aside className="sidebar">
        <button
          className={`sidebar-btn ${tab === "sitios" ? "active" : ""}`}
          onClick={() => setTab("sitios")}
        >
          🏙️ Sitios
        </button>
        <button
          className={`sidebar-btn ${tab === "eventos" ? "active" : ""}`}
          onClick={() => setTab("eventos")}
        >
          🎉 Eventos
        </button>
        <button
          className={`sidebar-btn ${tab === "recomendados" ? "active" : ""}`}
          onClick={() => setTab("recomendados")}
        >
          💡 Sitios para ti
        </button>
      </aside>

      {/* ---------- CONTENIDO PRINCIPAL ---------- */}
      <main className="content">
        {tab === "sitios" && <SitiosView fav={false}/>}
        {tab === "eventos" && <EventosView/>}
        {tab === "recomendados" && <RecomendadosView/>}
      </main>
    </div>
  );
}
