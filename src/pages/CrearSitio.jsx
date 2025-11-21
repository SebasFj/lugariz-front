import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./CrearSitio.css";

const CrearSitio = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Si existe, estamos en modo edición
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    telefono: "",
    direccion: "",
    indicaciones: "",
    pet_friendly: false,
    edad_ingreso: "",
    imagen: "",
  });

  const [mapeo, setMapeo] = useState({
    1: "lunes",
    2: "martes",
    3: "miercoles",
    4: "jueves",
    5: "viernes",
    6: "sabado",
    7: "domingo",
    8: "festivo",
  });

  const [categorias, setCategorias] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);

  const [horarios, setHorarios] = useState({
    1: { apertura: "", cierre: "" },
    2: { apertura: "", cierre: "" },
    3: { apertura: "", cierre: "" },
    4: { apertura: "", cierre: "" },
    5: { apertura: "", cierre: "" },
    6: { apertura: "", cierre: "" },
    7: { apertura: "", cierre: "" },
    8: { apertura: "", cierre: "" },
  });

  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Obtener categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categorias");
        const data = await res.json();
        if (!data.length) throw new Error(data.message);
        setCategorias(data);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
      }
    };
    fetchCategorias();
  }, []);

  // Si hay un id => estamos en edición => traer datos del sitio
  useEffect(() => {
    if (!id) return;
    const fetchSitio = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/sitios/${id}`);
        if (!res.ok) throw new Error(`Error al obtener el sitio (${res.status})`);
        const data = await res.json();

        // Rellenar formData
        setFormData({
          nombre: data.nombre || "",
          descripcion: data.descripcion || "",
          telefono: data.telefono || "",
          direccion: data.direccion || "",
          indicaciones: data.indicaciones || "",
          pet_friendly: data.pet_friendly || false,
          edad_ingreso: data.edad_ingreso || "",
          imagen: data.imagen || "",
        });

        // Rellenar categorías seleccionadas
        setCategoriasSeleccionadas(data.Categoria?.map((c) => c.id) || []);

        // Rellenar horarios
        const nuevosHorarios = { ...horarios };
        data.horarios?.forEach((h) => {
          const diaId = h.dia?.id;
          if (diaId && nuevosHorarios[diaId]) {
            nuevosHorarios[diaId] = {
              apertura: h.apertura || "",
              cierre: h.cierre || "",
            };
          }
        });
        setHorarios(nuevosHorarios);
      } catch (err) {
        console.error("Error al traer el sitio:", err);
        setError("❌ No se pudo cargar la información del sitio");
      }
    };
    fetchSitio();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleHorarioChange = (dia, campo, valor) => {
    if (campo === "apertura" || campo === "cierre") {
      const [h, m] = valor.split(":");
      if (
        !/^\d{0,2}$/.test(h) ||
        !/^\d{0,2}$/.test(m) ||
        (h && (parseInt(h) < 0 || parseInt(h) > 23)) ||
        (m && (parseInt(m) < 0 || parseInt(m) > 59))
      )
        return;
    }
    setHorarios({
      ...horarios,
      [dia]: { ...horarios[dia], [campo]: valor },
    });
  };

  const toggleCategoria = (id) => {
    setCategoriasSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);
    setLoading(true);

    const endpoint = id
      ? `http://localhost:5000/api/sitios/update/${id}`
      : "http://localhost:5000/api/sitios/crear";

    const method = id ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: user.id,
          ...formData,
          categorias: categoriasSeleccionadas,
          horarios: horarios,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setMensaje(id ? "✅ Sitio actualizado exitosamente" : "✅ Sitio creado exitosamente");
      setTimeout(() => navigate("/usuario/sitios"), 1500);
    } catch (err) {
      setError("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const dias = Object.keys(horarios);

  return (
    <div className="crear-sitio-container">
      <h2>{id ? "Editar sitio" : "Registrar nuevo sitio"}</h2>

      <form className="crear-sitio-form" onSubmit={handleSubmit}>
        {/* Columna izquierda */}
        <div className="form-left">
          <div className="form-group">
            <label>Nombre del sitio</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Indicaciones</label>
            <textarea
              name="indicaciones"
              value={formData.indicaciones}
              onChange={handleChange}
            />
          </div>

          <div className="form-group-inline">
            <div>
              <label>Edad mínima de ingreso</label>
              <input
                type="number"
                name="edad_ingreso"
                value={formData.edad_ingreso}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="checkbox-group">
              <label>Pet Friendly</label>
              <input
                type="checkbox"
                name="pet_friendly"
                checked={formData.pet_friendly}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>URL de la imagen</label>
            <input
              type="url"
              name="imagen"
              value={formData.imagen}
              onChange={handleChange}
              required
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
        </div>

        {/* Columna derecha */}
        <div className="form-right">
          <h3>Horarios del sitio</h3>
          <div className="horarios-grid">
            {dias.map((dia) => (
              <div key={dia} className="horario-item">
                <label className="dia-label">{mapeo[dia]}</label>
                <div className="horario-inputs">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    placeholder="HH"
                    value={horarios[dia].apertura.split(":")[0] || ""}
                    onChange={(e) =>
                      handleHorarioChange(
                        dia,
                        "apertura",
                        `${e.target.value}:${horarios[dia].apertura.split(":")[1] || ""}`
                      )
                    }
                  />
                  :
                  <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="MM"
                    value={horarios[dia].apertura.split(":")[1] || ""}
                    onChange={(e) =>
                      handleHorarioChange(
                        dia,
                        "apertura",
                        `${horarios[dia].apertura.split(":")[0] || ""}:${e.target.value}`
                      )
                    }
                  />
                  {"  -  "}
                  <input
                    type="number"
                    min="0"
                    max="23"
                    placeholder="HH"
                    value={horarios[dia].cierre.split(":")[0] || ""}
                    onChange={(e) =>
                      handleHorarioChange(
                        dia,
                        "cierre",
                        `${e.target.value}:${horarios[dia].cierre.split(":")[1] || ""}`
                      )
                    }
                  />
                  :
                  <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="MM"
                    value={horarios[dia].cierre.split(":")[1] || ""}
                    onChange={(e) =>
                      handleHorarioChange(
                        dia,
                        "cierre",
                        `${horarios[dia].cierre.split(":")[0] || ""}:${e.target.value}`
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <h3>Categorías</h3>
          <div className="categorias-container">
            {categorias.map((cat) => (
              <button
                type="button"
                key={cat.id}
                className={`categoria-btn ${
                  categoriasSeleccionadas.includes(cat.id) ? "selected" : ""
                }`}
                onClick={() => toggleCategoria(cat.id)}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>
      </form>

      <div className="form-actions">
        <button
          type="submit"
          className="btn-submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Guardando..." : id ? "Actualizar Sitio" : "Crear Sitio"}
        </button>
      </div>

      {mensaje && <p className="mensaje-exito">{mensaje}</p>}
      {error && <p className="mensaje-error">{error}</p>}
    </div>
  );
};

export default CrearSitio;
