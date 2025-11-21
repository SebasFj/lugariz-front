import React, { useEffect, useState } from "react";
import Card from "../Card/Card.jsx";
import "./EventosView.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import {API_URL} from "../../config/api.js"

export const EventosView = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [edad, setEdad] = useState("");
  const [fechaFiltro, setFechaFiltro] = useState("");

  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    async function fetchEventos() {
      try {
        const res = await fetch(
          `${API_URL}/api/eventos/get/activos`
        );
        const json = await res.json();
        setData(json);
        setFiltered(json);
      } catch (err) {
        console.error("❌ Error cargando eventos:", err);
      }
    }
    fetchEventos();
  }, []);

  useEffect(() => {
    let list = [...data];

    if (search.trim()) {
      list = list.filter((e) =>
        e.nombre.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (edad) {
      const rangos = {
        "0-3": [0, 3],
        "4-7": [4, 7],
        "8-10": [8, 10],
        "11-13": [11, 13],
        "14-17": [14, 17],
        "18+": [18, 100],
      };
      const [min, max] = rangos[edad];
      list = list.filter(
        (ev) => ev.edad_ingreso >= min && ev.edad_ingreso <= max
      );
    }

    if (fechaFiltro) {
      const f = new Date(fechaFiltro).getTime();
      list = list.filter((ev) => {
        const inicio = new Date(ev.fecha_inicio).getTime();
        const fin = new Date(ev.fecha_fin).getTime();
        return f >= inicio && f <= fin;
      });
    }

    setFiltered(list);
  }, [search, edad, fechaFiltro, data]);

  const resetFiltros = () => {
    setSearch("");
    setEdad("");
    setFechaFiltro("");
    setFiltered(data);
  };

  const handleVer = (id) => navigate(`/eventos/${id}`);

  return (
    <div className="evu-container">
      {/* FILTROS */}
      <div className="evu-filtros">
        <input
          className="evu-buscador"
          type="text"
          placeholder="🔍 Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="fecha">
          <label className="evu-label-fecha">Buscar por fecha:</label>
          <input
            type="date"
            className="evu-input-fecha"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
          />
        </div>
        <div className="edad-btn">
          <select
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            className="evu-select-edad"
          >
            <option value="">Todas las edades</option>
            <option value="0-3">0 a 3</option>
            <option value="4-7">4 a 7</option>
            <option value="8-10">8 a 10</option>
            <option value="11-13">11 a 13</option>
            <option value="14-17">14 a 17</option>
            <option value="18+">18+</option>
          </select>

          <button className="evu-btn-reset" onClick={resetFiltros}>
            ↺ Reiniciar
          </button>
        </div>
      </div>

      {/* CARDS */}
      <div className="evu-cards-grid">
        {filtered.length === 0 ? (
          <p className="evu-no-result">
            No hay eventos que coincidan con los filtros
          </p>
        ) : (
          filtered.map((ev) => (
            <Card
              key={ev.id}
              tipo="evento"
              modo="usuario"
              data={ev}
              onVer={() => handleVer(ev.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
