import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./CrearEvento.css";

export const CrearEvento = () => {
  const { id, id_evento } = useParams(); // id del sitio y del evento
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

  // 🧭 Cargar datos si estamos en modo edición
  useEffect(() => {
    if (modoEdicion && id_evento) {
      const fetchEvento = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/eventos/${id_evento}`);
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

  // 📝 Manejador de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🚀 Guardar o actualizar evento
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);

    try {
      const url = modoEdicion
        ? `http://localhost:5000/api/eventos/${id_evento}/update`
        : `http://localhost:5000/api/eventos/create`;

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
}
