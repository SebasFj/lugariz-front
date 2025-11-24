import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./CrearEvento.css";
import {API_URL} from "../config/api.js"

export const CrearEvento = () => {
  const { id, id_evento } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();

  const modoEdicion = location.pathname.includes("editar");

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    imagen: "",
    fecha_inicio: "",
    fecha_fin: "",
    edad_ingreso: "",
  });

  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const hoy = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (modoEdicion && id_evento) {
      const fetchEvento = async () => {
        try {
          const res = await fetch(`${API_URL}/api/eventos/${id_evento}`);
          const data = await res.json();
          if (res.ok) {
            setFormData({
              nombre: data.nombre || "",
              descripcion: data.descripcion || "",
              imagen: data.imagen || "",
              fecha_inicio: data.fecha_inicio?.split("T")[0] || "",
              fecha_fin: data.fecha_fin?.split("T")[0] || "",
              edad_ingreso: data.edad_ingreso || "",
            });
          } else {
            console.error("Error al obtener evento:", data.error);
          }
        } catch (error) {
          console.error("Error al cargar evento:", error);
        }
      };
      fetchEvento();
    }
  }, [modoEdicion, id_evento]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ⛔ Si toca fecha_fin sin haber definido fecha_inicio → no permitir
    if (name === "fecha_fin" && !formData.fecha_inicio) return;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);

    // Validaciones extra de seguridad antes de enviar:
    if (formData.fecha_inicio < hoy) {
      setMensaje("❌ La fecha de inicio no puede ser anterior a hoy");
      setLoading(false);
      return;
    }

    if (formData.fecha_fin < formData.fecha_inicio) {
      setMensaje("❌ La fecha final debe ser posterior a la fecha de inicio");
      setLoading(false);
      return;
    }

    try {
      const url = modoEdicion
        ? `${API_URL}/api/eventos/${id_evento}/update`
        : `${API_URL}/api/eventos/create`;

      const method = modoEdicion ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id_sitio: id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar evento");

      setMensaje(modoEdicion ? "✅ Evento actualizado correctamente" : "✅ Evento creado correctamente");

      setTimeout(() => navigate(`/usuario/sitios/detalle_sitio/${id}`), 1500);
    } catch (error) {
      console.error(error);
      setMensaje(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crear-editar-evento-container">
      <h1>{modoEdicion ? "✏️ Editar Evento" : "🎉 Crear Nuevo Evento"}</h1>

      <form className="evento-form" onSubmit={handleSubmit}>
        <label>
          Nombre del evento:
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Descripción:
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="4"
          />
        </label>

        <label>
          Imagen (URL):
          <input
            type="text"
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </label>

        <div className="fechas-group">
          <label>
            Fecha inicio:
            <input
              type="date"
              name="fecha_inicio"
              value={formData.fecha_inicio}
              min={hoy}        // 🚀 NO puede ser menor a hoy
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Fecha fin:
            <input
              type="date"
              name="fecha_fin"
              value={formData.fecha_fin}
              min={formData.fecha_inicio || hoy} // 🚀 Debe ser > inicio
              disabled={!formData.fecha_inicio} // ⛔ No editable sin inicio
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <label>
          Edad mínima de ingreso:
          <input
            type="number"
            name="edad_ingreso"
            value={formData.edad_ingreso}
            onChange={handleChange}
            min="0"
            placeholder="Ej: 18"
          />
        </label>

        <button className="btn-submit" type="submit" disabled={loading}>
          {loading ? "Guardando..." : modoEdicion ? "Actualizar evento" : "Crear evento"}
        </button>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </form>

      <button
        className="btn-volver"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </button>
    </div>
  );
};
