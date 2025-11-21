import React from "react";
import "./Card.css";
import { FaHeart } from "react-icons/fa";
import { useState } from "react";
import Rating from "../rating/Rating";

export default function Card({
  tipo, // "sitio" | "evento"
  modo, // "usuario" | "admin"
  data = {},
  onVer,
  onEditar,
  onEliminar,
  onPausar,
  onFavorito,
  onLike,
  onCalificar,
  onFinalizar,
  like,
  fav,
  calificacion,
  fav_btn
}) {
  const {
    nombre,
    imagen,
    edad_ingreso,
    pet_friendly,
    rating,
    likes,
    categorias,
    fecha_inicio,
    fecha_fin,
    id_estado,
    Estado,
  } = data;
  const imgSrc =
    imagen || "https://via.placeholder.com/600x360?text=Sin+imagen";
  const formatFecha = (f) =>
    f ? new Date(f).toLocaleDateString("es-CO") : "—";

  return (
    <div className="card-item">
      <div className="card-item__img-wrap" onClick={onVer}>
        <img src={imgSrc} alt={nombre} className="card-item__img" />
      </div>

      <div className="card-item__body">
        {/* ----------- Nombre ----------- */}
        <h3 className="card-item__title">{nombre}</h3>

        {/* ----------- INFO según tipo y modo ----------- */}
        <div className="card-item__info">
          {/* Sitio - Usuario */}
          {modo === "usuario" && tipo === "sitio" && (
            <>
              <span>
                <strong>Categorías:</strong> {categorias?.join(", ") || "—"}
              </span>
              <span>
                <strong>Edad ingreso:</strong> {edad_ingreso || "Todas"}
              </span>
              <span>
                <strong>Pet Friendly:</strong>{" "}
                {pet_friendly ? "Sí 🐶" : "No 🚫"}
              </span>
              <span>
                <strong>Rating:</strong> ⭐ {rating ?? 0}
              </span>
              <span>
                <strong>Likes:</strong> ❤️ {likes ?? 0}
              </span>
            </>
          )}

          {/* Evento - Usuario */}
          {modo === "usuario" && tipo === "evento" && (
            <>
              <span>
                <strong>Edad ingreso:</strong> {edad_ingreso || "Todas"}
              </span>
              <span>
                <strong>Inicio:</strong> {formatFecha(fecha_inicio)}
              </span>
              <span>
                <strong>Fin:</strong> {formatFecha(fecha_fin)}
              </span>
            </>
          )}

          {/* Sitio - Admin */}
          {modo === "admin" && tipo === "sitio" && (
            <>
              <div>
                <strong>⭐ Rating: </strong> {rating ?? 0}
              </div>
              <div>
                <strong>❤️ Likes: </strong>
                {likes ?? 0}
              </div>
              <div>
                <strong>Estado: </strong> {Estado.nombre || "—"}
              </div>
            </>
          )}

          {/* Evento - Admin */}
          {modo === "admin" && tipo === "evento" && (
            <>
              <span>
                <strong>Inicio:</strong> {formatFecha(fecha_inicio)}
              </span>
              <span>
                <strong>Fin:</strong> {formatFecha(fecha_fin)}
              </span>
              <span>
                <strong>Estado:</strong> {Estado.nombre || "—"}
              </span>
            </>
          )}
        </div>

        {/* ----------- ACCIONES ----------- */}
        <div className="card-item__actions">
          {/* usuario - sitio */}
          {modo === "usuario" && tipo === "sitio" && (
            <>
              <div className="todos">
                <div className="rating">
                  <Rating value={calificacion} onRate={(newValue) => onCalificar(newValue)}/>
                </div>
                <div className="btns">
                  <button className="btn--icon" onClick={onLike}>
                    <FaHeart
                      size={100}
                      color={like ? "hotpink" : "#94a3b8"} // ❤️ cambia el color aquí
                    />
                  </button>
                  <button
                    className={!fav ? "btn--icon" : "btn--fav"}
                    onClick={onFavorito}
                    // disabled={!fav_btn}
                  >
                    📌
                  </button>
                  <button className="btn" onClick={onVer}>
                    Ver detalle
                  </button>
                </div>
              </div>
            </>
          )}

          {/* usuario - evento */}
          {modo === "usuario" && tipo === "evento" && (
            <button className="btn" onClick={onVer}>
              Ver detalle
            </button>
          )}

          {/* admin - sitio */}
          {modo === "admin" && tipo === "sitio" && (
            <>
              <button className="btn" onClick={onVer}>
                Ver detalle
              </button>
              <button className="btn btn--small" onClick={onEditar}>
                Editar
              </button>
              <button
                className="btn btn--outline btn--small"
                onClick={onPausar}
              >
                {Estado.nombre === "Activo" ? "Pausar" : "Activar"}
              </button>
            </>
          )}

          {/* admin - evento */}
          {modo === "admin" && tipo === "evento" && (
            <>
              <button className="btn" onClick={onVer}>
                Ver detalle
              </button>
              <button className="btn btn--small" onClick={onEditar}>
                Editar
              </button>
              <button
                className="btn btn--outline btn--small"
                hidden={Estado.id === 1 ? false : true}
                onClick={onFinalizar}
              >
                Finalizar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// CardItem.propTypes = {
//   tipo: PropTypes.oneOf(["sitio", "evento"]).isRequired,
//   modo: PropTypes.oneOf(["usuario", "admin"]).isRequired,
//   data: PropTypes.object.isRequired,
//   onVer: PropTypes.func,
//   onEditar: PropTypes.func,
//   onEliminar: PropTypes.func,
//   onPausar: PropTypes.func,
//   onFavorito: PropTypes.func,
//   onLike: PropTypes.func,
//   onCalificar: PropTypes.func,
//   onFinalizar: PropTypes.func,
// };
