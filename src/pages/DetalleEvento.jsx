import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../components/loading/Loading";
import "./DetalleEvento.css";
import {API_URL} from "../config/api.js"

export const DetalleEvento = () => {
  const { id, id_evento } = useParams();
  const navigate = useNavigate();

  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const res = await fetch(`${API_URL}/api/eventos/${id_evento}`);
        const data = await res.json();
        setEvento(data);
      } catch (error) {
        console.error("Error al obtener el evento:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvento();
  }, [id]);

  const finalizarEvento = async () => {
    if (evento.id_estado === 1 && !window.confirm("¿Deseas finalizar este evento?")) return;
    try {
      const res = await fetch(`${API_URL}/api/eventos/${id_evento}/state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        alert("Evento finalizado correctamente ✅");
        setEvento((prev) => ({ ...prev, estado: "Finalizado" }));
      } else {
        alert("No se pudo finalizar el evento ❌");
      }
      window.location.reload();
    } catch (error) {
      console.error("Error al finalizar el evento:", error);
    }
  };

  if (loading) return <Loading />;
  if (!evento) return <div className="error">No se encontró la información del evento.</div>;

  return (
    <div className="detalle-evento-container">
      {/* ---------- ENCABEZADO ---------- */}
      <div className="detalle-evento-header">
        <h1>{evento.nombre}</h1>
        <div className="detalle-evento-buttons">
          <button
            className="btn btn--primary"
            onClick={() => navigate(`/usuario/sitios/detalle_sitio/${id}/editar_evento/${id_evento}`)}
          >
            ✏️ Editar
          </button>
          {evento.id_estado === 1 && (
          <button className="btn btn--danger" onClick={finalizarEvento} hidden={evento.id_estado === 1 ? false : true}>
            🔒 Finalizar
          </button>
          )}
          <button
            className="btn btn--outline"
            onClick={() => navigate(-1)}
          >
            ← Volver
          </button>
        </div>
      </div>

      {/* ---------- INFORMACIÓN DEL EVENTO ---------- */}
      <div className="detalle-evento-info">
        {evento.imagen && (
          <div className="detalle-evento-imagen">
            <img src={evento.imagen} alt={evento.nombre} />
          </div>
        )}

        <div className="detalle-evento-datos">
          <p><strong>Descripción:</strong> {evento.descripcion || "—"}</p>
          <p><strong>Fecha inicio:</strong> {new Date(evento.fecha_inicio).toLocaleDateString()}</p>
          <p><strong>Fecha fin:</strong> {new Date(evento.fecha_fin).toLocaleDateString()}</p>
          <p><strong>Edad mínima:</strong> {evento.edad_ingreso || "Todas"}</p>
          <p><strong>Estado:</strong> {evento.id_estado === 1 ? "Activo" : "Inactivo"}</p>
        </div>
      </div>
    </div>
  );
}
