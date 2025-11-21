import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import "./Perfil.css"; // estilos opcionales
import Loading from "../components/loading/Loading.jsx"
import { updateUser } from "../features/auth/authSlice.js";
import {API_URL} from "../config/api.js"


const Perfil = () => {
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth); // asumimos que el usuario está aquí
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [generos, setGeneros] = useState([]);
  const [estadosCiviles, setEstadosCiviles] = useState([]);

  // ✅ Limitar fecha de nacimiento (mínimo 10 años)
  const maxFechaNacimiento = new Date();
  maxFechaNacimiento.setFullYear(maxFechaNacimiento.getFullYear() - 10);
  const maxFechaStr = maxFechaNacimiento.toISOString().split("T")[0];

  // ✅ cargar dropdowns desde backend
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [resGeneros, resEstados] = await Promise.all([
          axios.get(`${API_URL}/api/generos/get`),
          axios.get(`${API_URL}/api/estado_civil/get`),
        ]);
        setGeneros(resGeneros.data);
        setEstadosCiviles(resEstados.data);
      } catch (error) {
        console.error("Error cargando dropdowns:", error);
      }
    };

    fetchDropdowns();
  }, []);

  // ✅ Cargar datos del usuario en local al entrar en modo edición
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        telefono: user.telefono || "",
        direccion: user.direccion || "",
        fecha_nacimiento: user.fecha_nacimiento
          ? user.fecha_nacimiento.split("T")[0]
          : "",
        ninos: user.ninos ?? false,
        mascotas: user.mascotas ?? false,
        id_estado_civil: user.id_estado_civil || "",
        id_genero: user.id_genero || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = async () => {
    if (formData.fecha_nacimiento === ""){
        delete formData.fecha_nacimiento
    }
    try {
      const res = await axios.put(
        `${API_URL}/api/usuarios/${user.id}`,
        formData
      );

      // Aquí actualizas Redux si es necesario
      dispatch(updateUser(res.data.user));

      setEditMode(false);
    } catch (error) {
      console.error("Error actualizando usuario:", error);
    }
  };

  if (!user || !generos || !estadosCiviles) return <div><Loading/></div>;

  return (
    <div className="perfil-container">
      <h2>Perfil del Usuario</h2>

      {editMode ? (
        <div className="perfil-form">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />

          <label>Teléfono:</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />

          <label>Dirección:</label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
          />

          <label>Fecha de Nacimiento:</label>
          <input
            type="date"
            name="fecha_nacimiento"
            max={maxFechaStr}
            value={formData.fecha_nacimiento}
            onChange={handleChange}
          />

          <label>Niños:</label>
          <input
            type="checkbox"
            name="ninos"
            checked={formData.ninos}
            onChange={handleChange}
          />

          <label>Mascotas:</label>
          <input
            type="checkbox"
            name="mascotas"
            checked={formData.mascotas}
            onChange={handleChange}
          />

          <label>Estado Civil:</label>
          <select
            name="id_estado_civil"
            value={formData.id_estado_civil}
            onChange={handleChange}
          >
            {estadosCiviles.map((ec) => (
              <option key={ec.id} value={ec.id}>
                {ec.nombre}
              </option>
            ))}
          </select>

          <label>Género:</label>
          <select
            name="id_genero"
            value={formData.id_genero}
            onChange={handleChange}
          >
            {generos.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre}
              </option>
            ))}
          </select>

          <div className="perfil-buttons">
            <button onClick={handleSave}>Guardar</button>
            <button onClick={() => setEditMode(false)}>Cancelar</button>
          </div>
        </div>
      ) : (
        <div className="perfil-datos">
          <p><strong>Nombre:</strong> {user.nombre || "Sin definir"}</p>
          <p><strong>Teléfono:</strong> {user.telefono || "Sin definir"}</p>
          <p><strong>Dirección:</strong> {user.direccion || "Sin definir"}</p>
          <p><strong>Fecha de nacimiento:</strong> {user.fecha_nacimiento?.split("T")[0] || "Sin definir"}</p>
          <p><strong>Niños:</strong> {user.ninos ? "Sí" : "No"}</p>
          <p><strong>Mascotas:</strong> {user.mascotas ? "Sí" : "No"}</p>
          <p><strong>Estado civil:</strong> {estadosCiviles[user.id_estado_civil-1]?.nombre|| "Sin definir"}</p>
          <p><strong>Género:</strong> {generos[user.id_genero - 1]?.nombre || "Sin definir"}</p>

          <button onClick={() => setEditMode(true)}>Editar</button>
        </div>
      )}
    </div>
  );
}

export default Perfil;
