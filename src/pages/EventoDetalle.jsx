// EventoDetalle.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EventoDetalle.css";
import Loading from "../components/loading/Loading";

export const EventoDetalle = () => {
  const { id_evento } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/eventos/${id_evento}`);
        const data = await res.json();
        setEvento(data);
      } catch (error) {
        console.error("Error al obtener evento:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvento();
  }, [id_evento]);

  if (loading) return <Loading/>;
  if (!evento) return <div className="evento-error">No se encontró el evento.</div>;

  return (
    <div className="evento-detalle">
      {/* ----------- Banner ----------- */}
      <div className="evento-banner">
        <img src={evento.imagen} alt={evento.nombre} className="evento-banner__img" />
        <div className="evento-banner__overlay">
          <h1 className="evento-banner__title">{evento.nombre}</h1>
          <span className="evento-banner__rango">{new Date(evento.fecha_inicio).toLocaleDateString()} - {new Date(evento.fecha_fin).toLocaleDateString()}</span>
        </div>
      </div>

      {/* ----------- Info general ----------- */}
      <div className="evento-info">
        <h2>Descripción</h2>
        <p>{evento.descripcion}</p>

        <div className="evento-info__grid">
          <div><strong>📅 Fecha Inicio:</strong> {new Date(evento.fecha_inicio).toLocaleString()}</div>
          <div><strong>📅 Fecha Fin:</strong> {new Date(evento.fecha_fin).toLocaleString()}</div>
          <div><strong>🔞 Edad mínima:</strong> {evento.edad_ingreso || "Todas"}</div>
        </div>
      </div>

      {/* ----------- Lugar ----------- */}
      {evento.Sitio && (
        <div className="evento-lugar">
          <h2>📍 Lugar</h2>
          <div className="evento-lugar__grid">
            <div><strong>🏠 Nombre:</strong> {evento.Sitio.nombre}</div>
            <div><strong>📞 Teléfono:</strong> {evento.Sitio.telefono}</div>
            <div><strong>📍 Dirección:</strong> {evento.Sitio.direccion}</div>
            <div><strong>ℹ️ Indicaciones:</strong> {evento.Sitio.indicaciones}</div>
          </div>
        </div>
      )}

      {/* ----------- Botón volver ----------- */}
      <button className="btn-volver" onClick={() => navigate(-1)}>⬅ Volver</button>
    </div>
  );
};
