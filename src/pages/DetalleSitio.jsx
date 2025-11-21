import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../components/Card/card";
import "./DetalleSitio.css";
import Loading from "../components/loading/Loading";
import {API_URL} from "../config/api.js"

export default function DetalleSitio() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sitio, setSitio] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⚡ Carga todos los datos del sitio
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Obtener información del sitio
        const resSitio = await fetch(`${API_URL}/api/sitios/${id}`);
        const dataSitio = await resSitio.json();
        setSitio(dataSitio);
        setEventos(dataSitio.eventos);
        setComentarios(dataSitio.comentarios);
      } catch (error) {
        console.error("Error al obtener los datos del sitio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleEstado = async () => {
    try {
      const nuevoEstado = sitio.Estado.nombre === "Activo" ? "Inactivo" : "Activo";
      const res = await fetch(`${API_URL}/api/sitios/${id}/state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (res.ok) {
        setSitio((prev) => ({
          ...prev,
          Estado: { nombre: nuevoEstado },
        }));
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const handleFinalizar = async (id_evento) => {
    try {
      const res = await fetch(`${API_URL}/api/eventos/${id_evento}/state`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar el estado del evento");
      }

      console.log("Evento actualizado:", data);
      alert(data.message); // puedes reemplazarlo por un toast o un modal
      window.location.reload();
    } catch (error) {
      console.error("Error en handleFinalizar:", error);
      alert("Hubo un error al cambiar el estado del evento.");
    }
  };

  if (loading) return <Loading/>
  if (!sitio) return <div className="error">No se encontró la información del sitio.</div>;

  return (
    <div className="detalle-sitio-container">
      {/* ---------- ENCABEZADO ---------- */}
      <div className="detalle-header">
        <h1>{sitio.nombre}</h1>
        <div className="detalle-buttons">
          <button className="btn" onClick={() => navigate(`/usuario/sitios/editar_sitio/${sitio.id}`)}>✏️ Editar</button>
          <button
            className={`btn ${sitio.Estado?.nombre === "Activo" ? "btn--outline" : "btn--success"}`}
            onClick={toggleEstado}
          >
            {sitio.Estado?.nombre === "Activo" ? "Pausar" : "Activar"}
          </button>
          <button className="btn btn--primary" onClick={() => navigate(`./crear_evento`)}>
            ➕ Crear evento
          </button>
        </div>
      </div>
      <div className="detalle-main">
        {/* ---------- INFORMACIÓN DEL SITIO ---------- */}
        <div className="detalle-info">
          <p><strong>Descripción:</strong> {sitio.descripcion || "—"}</p>
          <p><strong>Teléfono:</strong> {sitio.telefono || "—"}</p>
          <p><strong>Dirección:</strong> {sitio.direccion || "—"}</p>
          <p><strong>Indicaciones:</strong> {sitio.indicaciones || "—"}</p>
          <p><strong>Pet Friendly:</strong> {sitio.pet_friendly ? "Sí 🐶" : "No 🚫"}</p>
          <p><strong>Edad de ingreso:</strong> {sitio.edad_ingreso || "Todas"}</p>
          <p><strong>⭐ Rating:</strong> {sitio.rating ?? 0}</p>
          <p><strong>❤️ Likes:</strong> {sitio.likes ?? 0}</p>
          <p><strong>Estado:</strong> {sitio.Estado?.nombre || "—"}</p>

          {sitio.horarios?.length > 0 && (
            <div className="detalle-lista">
              <h3>🕒 Horarios</h3>
              <ul>
                {sitio.horarios.map((h, i) => (
                  <li key={i}>
                    <strong>{h.dia.nombre}:</strong> {h.apertura} - {h.cierre}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {sitio.categorias?.length > 0 && (
            <div className="detalle-lista">
              <h3>🏷️ Categorías</h3>
              <ul>
                {sitio.categorias.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        

        {/* ---------- SECCIÓN DE COMENTARIOS ---------- */}
        <div className="detalle-comentarios">
          <h2>💬 Comentarios</h2>
          {comentarios?.length > 0 ? (
            <div className="comentarios-section">
              <ul className="comentarios-lista">
                {comentarios.map((c, i) => (
                  <li
                    key={i}
                    className={`comentario-item ${
                      comentarioSeleccionado === i ? "activo" : ""
                    }`}
                    onClick={() => setComentarioSeleccionado(i)}
                  >
                    {c.Usuario?.nombre || c.Usuario || "Usuario"}
                  </li>
                ))}
              </ul>

              <div className="comentario-detalle">
                {comentarioSeleccionado !== null ? (
                  <p>{comentarios[comentarioSeleccionado].comentario}</p>
                ) : (
                  <p className="no-seleccionado">Selecciona un comentario para leerlo</p>
                )}
              </div>
            </div>
          ) : (
            <p className="no-comentarios">Este sitio aún no tiene comentarios.</p>
          )}
        </div>
      </div>
      {/* ---------- SECCIÓN DE EVENTOS ---------- */}
      <div className="detalle-eventos">
        <h2>🎉 Eventos del sitio</h2>
        {eventos.length > 0 ? (
          <div className="eventos-grid">
            {eventos.map((evento) => (
              <Card
                key={evento.id}
                tipo="evento"
                modo="admin"
                data={evento}
                onVer={() => navigate(`/usuario/sitios/detalle_sitio/${id}/detalle_evento/${evento.id}`)}
                onEditar={() => navigate(`/usuario/sitios/detalle_sitio/${id}/editar_evento/${evento.id}`)}
                onFinalizar={()=>handleFinalizar(evento.id)}
              />
            ))}
          </div>
        ) : (
          <p className="no-eventos">Este sitio no tiene eventos registrados.</p>
        )}
      </div>
    </div>
  );
}
