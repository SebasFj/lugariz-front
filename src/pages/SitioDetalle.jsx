import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SitioDetalle.css";
import Card from "../components/Card/card";
import Loading from "../components/loading/Loading";
import { useSelector } from "react-redux";
import axios from "axios";
import {API_URL} from "../config/api.js"

export const SitioDetalle = () => {
  const { id_sitio } = useParams();
  const navigate = useNavigate();
  const [sitio, setSitio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [texto, setTexto] = useState("");
  const [error, setError] = useState("");
  const {user} = useSelector((state)=>state.auth)
  const fetchSitio = async () => {
    try {
      const res = await fetch(`${API_URL}/api/sitios/${id_sitio}`);
      const data = await res.json();
      setSitio(data);
    } catch (error) {
      console.error("Error al obtener el sitio:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSitio();
  }, [id_sitio]);

  if (loading) return <Loading />;
  if (!sitio)
    return <div className="sitio-error">No se encontró el sitio.</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!texto.trim()) {
      setError("El comentario no puede estar vacío");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/comentarios/post/${user.id}/${id_sitio}`,
        { comentario: texto }
      );

      // limpiar campo
      setTexto("");
      setError("");

      if (res.data.created){
        fetchSitio()
      }

    } catch (err) {
      console.error("Error al enviar comentario:", err);
      setError("Hubo un error enviando tu comentario");
    }
  };

  return (
    <div className="sitio-detalle">
      {/* ----------- Imagen principal ----------- */}
      <div className="sitio-banner">
        <img
          src={sitio.imagen}
          alt={sitio.nombre}
          className="sitio-banner__img"
        />
        <div className="sitio-banner__overlay">
          <h1 className="sitio-banner__title">{sitio.nombre}</h1>
          <span className="sitio-banner__categoria">
            {sitio.Categoria?.map((c) => c.nombre).join(", ")}
          </span>
        </div>
      </div>

      {/* ----------- Información principal ----------- */}
      <div className="sitio-info">
        <h2>Información general</h2>
        <p>{sitio.descripcion}</p>

        <div className="sitio-info__grid">
          <div>
            <strong>📍 Dirección:</strong> {sitio.direccion}
          </div>
          <div>
            <strong>📞 Teléfono:</strong> {sitio.telefono}
          </div>
          <div>
            <strong>ℹ️ Indicaciones:</strong> {sitio.indicaciones}
          </div>
          <div>
            <strong>🐾 Pet Friendly:</strong> {sitio.pet_friendly ? "Sí" : "No"}
          </div>
          <div>
            <strong>🔞 Edad mínima:</strong> {sitio.edad_ingreso || "Todas"}
          </div>
          <div>
            <strong>⭐ Rating:</strong> {sitio.rating ?? 0}
          </div>
          <div>
            <strong>❤️ Likes:</strong> {sitio.likes ?? 0}
          </div>
        </div>
      </div>

      <div className="ordenar">
        {/* ----------- Comentarios ----------- */}
        {sitio.comentarios?.length >= 0 && (
          <div className="ordenar2">
            <h2>💬 Comentarios</h2>

            <div className="sitio-comentarios">
              <div className="sitio-comentarios__list">
                {sitio.comentarios?.length > 0 ? sitio.comentarios.map((c) => (
                  <div className="comentario-card" key={c.id}>
                    <img
                      src={
                        c.Usuario?.imagen ||
                        "https://media.istockphoto.com/id/2171382633/es/vector/icono-de-perfil-de-usuario-s%C3%ADmbolo-de-persona-an%C3%B3nima-gr%C3%A1fico-de-avatar-en-blanco.jpg?s=612x612&w=0&k=20&c=4R1fa1xdOWF2fXr6LSwe0L7O1ojy60Mcy0n624Z4qns="
                      }
                      alt={c.Usuario?.nombre}
                      className="comentario-card__img"
                    />
                    <div>
                      <strong>{c.Usuario?.nombre}</strong>
                      <p>{c.comentario}</p>
                    </div>
                  </div>
                ))
                : <div className="no-comentarios">
                    <h3>No hay comentarios</h3>
                  </div>
              }
              </div>
            </div>
            <div className="enviar-comentario">
              <form onSubmit={handleSubmit} className="comentario-form">
                <textarea
                  placeholder="Escribe tu comentario..."
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  rows={3}
                />

                {error && <p className="error">{error}</p>}

                <button type="submit">Enviar comentario</button>
              </form>
            </div>
          </div>
        )}
        {/* ----------- Horarios ----------- */}
        {sitio.horarios?.length > 0 && (
          <div className="sitio-horarios">
            <h2>🕒 Horarios</h2>
            <table>
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Apertura</th>
                  <th>Cierre</th>
                </tr>
              </thead>
              <tbody>
                {sitio.horarios.map((h) => (
                  <tr key={h.id}>
                    <td>{h.dia.nombre}</td>
                    <td>{h.apertura}</td>
                    <td>{h.cierre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ----------- Eventos relacionados ----------- */}
      {sitio.eventos?.length > 0 && (
        <div className="sitio-eventos">
          <div className="ordenar3">
            <h2>🎉 Eventos en este sitio</h2>
            <div className="sitio-eventos__grid">
              {sitio.eventos.map((evento) => (
                <Card
                  key={evento.id}
                  tipo="evento"
                  modo="usuario"
                  data={evento}
                  onVer={() => navigate(`/eventos/${evento.id}`)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------- Botón volver ----------- */}
      <button className="btn-volver" onClick={() => navigate(-1)}>
        ⬅ Volver
      </button>
    </div>
  );
};
