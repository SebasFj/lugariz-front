  import React, { useEffect, useState } from "react";
  import Card from "../components/Card/Card.jsx";
  import "./MisSitios.css";
  import { useSelector } from "react-redux";
  import { useNavigate } from "react-router-dom";
  import {API_URL} from "../config/api.js"

  const SitiosUsuario = () => {

    const {user} = useSelector((state) => state.auth);
    const [sitios, setSitios] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [visible, setVisible] = useState(6);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const navigate = useNavigate()

    // 🔹 Cargar los sitios del usuario desde el backend
      const fetchSitios = async () => {
        try {
          const res = await fetch(`${API_URL}/api/usuarios/${user.id}/sitios`);
          const data = await res.json();
          setSitios(data);
        } catch (err) {
          console.error("Error cargando sitios:", err);
        }
      };
    useEffect(() => {
      fetchSitios();
    }, [user.id]);

    // 🔹 Filtrar por nombre
    const sitiosFiltrados = sitios.filter((sitio) =>
      sitio.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    // 🔹 Manejar scroll para mostrar el botón de volver arriba
    useEffect(() => {
      const handleScroll = () => setShowScrollTop(window.scrollY > 300);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 🔹 Volver arriba
    const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    // 🔹 Mostrar más sitios
    const mostrarMas = () => setVisible((prev) => prev + 6);

    const handleCrear = () => {
      navigate("./crearsitio");
    }

    const handleEditar = (id) => {
      navigate(`./editar_sitio/${id}`);
    }

    const handleVer = (id) => {
      navigate(`./detalle_sitio/${id}`);
    }

    const handlePausar = async (id) => {
      try {
        const res = await fetch(`${API_URL}/api/sitios/${id}/state`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          // Actualizamos el estado local
          setSitios((prev) =>
            prev.map((sitio) =>
              sitio.id === id
                ? { ...sitio, estado: sitio.estado === "Activo" ? "Inactivo" : "Activo" }
                : sitio
            )
          );
        } else {
          throw new Error("Error al actualizar estado");
        }
        fetchSitios()
      } catch (err) {
        console.error("Error al pausar sitio:", err);
      }
    }



    return (
      <div className="mis-sitios-container">
        <div className="mis-sitios-header">
          <h2>Mis Sitios</h2>
          <div className="mis-sitios-actions">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <button className="btn-crear" onClick={handleCrear}>+ Crear sitio</button>
          </div>
        </div>

        {sitiosFiltrados.length === 0 ? (
          <p className="sin-sitios">Aún no tienes sitios registrados 🏝️</p>
        ) : (
          <>
            <div className="grid-sitios">
              {sitiosFiltrados.slice(0, visible).map((sitio) => (
                <Card
                  key={sitio.id}
                  tipo="sitio"
                  modo="admin"
                  data={sitio}
                  onEditar={()=>handleEditar(sitio.id)}
                  onVer={()=>handleVer(sitio.id)}
                  onPausar={()=>handlePausar(sitio.id)}
                />
              ))}
            </div>

            {visible < sitiosFiltrados.length && (
              <div className="ver-mas-container">
                <button onClick={mostrarMas} className="btn-ver-mas">⬇️</button>
              </div>
            )}
          </>
        )}

        {showScrollTop && (
          <button className="btn-scroll-top" onClick={scrollTop}>⬆️</button>
        )}
      </div>
    );
  };

  export default SitiosUsuario;
