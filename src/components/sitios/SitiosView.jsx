import React, { useEffect, useState } from "react";
import Card from "../Card/card";
import "./SitiosView.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateUser } from "../../features/auth/authSlice.js";

export default function SitiosView({ fav }) {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [petFriendly, setPetFriendly] = useState(false);
  const [edad, setEdad] = useState("");
  const [ordenCampo, setOrdenCampo] = useState("");
  const [ordenAsc, setOrdenAsc] = useState(true);
  const [timeoutId, setTimeoutId] = useState(null);

  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // <- usuario del store
  const [likedList, setLikedList] = useState(
    new Set(user?.sitiosLikeados?.map((sitio) => sitio.id_sitio || []))
  );
  const [favList, setFavList] = useState(
    new Set(user?.favoritos?.map((sitio) => sitio.id_sitio || []))
  );
  const [rateList, setRateList] = useState(
    new Set(user?.sitiosCalificados?.map((sitio) => sitio.id_sitio || []))
  );
  const dispatch = useDispatch();

  async function fetchData() {
    try {
      const [sitiosRes, categoriasRes] = await Promise.all([
        fetch("http://localhost:5000/api/sitios/get/activos"),
        fetch("http://localhost:5000/api/categorias"),
      ]);
      let sitiosJson = await sitiosRes.json();
      const categoriasJson = await categoriasRes.json();
      if (fav) {
        sitiosJson = sitiosJson.filter((s) => favList.has(s.id));
      }
      setData(sitiosJson);
      setFiltered(sitiosJson);
      setCategorias(categoriasJson);
    } catch (err) {
      console.error("❌ Error cargando sitios o categorías:", err);
    }
  }
  useEffect(() => {
     fetchData();
  }, fav ? [favList] : []);

  useEffect(() => {
    setLikedList(new Set(user?.sitiosLikeados?.map((s) => s.id_sitio) || []));
    setFavList(new Set(user?.favoritos?.map((s) => s.id_sitio) || []));
    setRateList(new Set(user?.sitiosCalificados?.map((s) => s.id_sitio) || []));
  }, [user]);

  useEffect(() => {
    if (!data.length) return;
    if (timeoutId) clearTimeout(timeoutId);

    const id = setTimeout(() => {
      let filtrado = [...data];
      if (search.trim()) {
        filtrado = filtrado.filter((s) =>
          s.nombre.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (categoria.length > 0) {
        filtrado = filtrado.filter((s) =>
          s.Categoria.some((cat) => categoria.includes(cat.nombre))
        );
      }

      if (petFriendly) {
        filtrado = filtrado.filter((s) => s.pet_friendly === true);
      }

      if (edad) {
        const rangos = {
          "0-3": [0, 3],
          "4-7": [4, 7],
          "8-10": [8, 10],
          "11-13": [11, 13],
          "14-17": [14, 17],
          "18+": [18, 100],
        };
        const [min, max] = rangos[edad];
        filtrado = filtrado.filter(
          (s) => s.edad_ingreso >= min && s.edad_ingreso <= max
        );
      }

      if (ordenCampo) {
        filtrado.sort((a, b) => {
          const valA = a[ordenCampo] ?? 0;
          const valB = b[ordenCampo] ?? 0;
          return ordenAsc ? valA - valB : valB - valA;
        });
      }

      setFiltered(filtrado);
    }, 800);

    setTimeoutId(id);
  }, [search, categoria, petFriendly, edad, ordenCampo, ordenAsc, data]);

  const resetFiltros = () => {
    setSearch("");
    setCategoria([]);
    setPetFriendly(false);
    setEdad("");
    setOrdenCampo("");
    setOrdenAsc(true);
    setFiltered(data);
  };

  const handleOrden = (campo) => {
    if (campo === ordenCampo) setOrdenAsc(!ordenAsc);
    else {
      setOrdenCampo(campo);
      setOrdenAsc(true);
    }
  };

  const handleVer = (id_sitio) => {
    navigate(`/sitios/detalle/${id_sitio}`);
  };

  const handleLike = async (id_sitio) => {
    if (!user) return alert("Debes iniciar sesión para dar like");
    try {
      const like = await axios.post(
        `http://localhost:5000/api/likes/${user.id}/${id_sitio}`
      );
      const new_data = [...data];
      for (let sitio of new_data) {
        if (sitio.id === id_sitio) {
          if (like.data.created) {
            sitio.likes += 1;
          } else {
            sitio.likes -= 1;
          }
        }
      }
      setData(new_data);
      const newUser = {
        ...user,
        sitiosLikeados: like.data.created
          ? [...user.sitiosLikeados, { id_sitio }]
          : user.sitiosLikeados.filter((s) => s.id_sitio !== id_sitio),
      };
      dispatch(updateUser(newUser));
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  const handleFavorito = async (id_sitio) => {
    if (!user) return alert("Debes iniciar sesión para agregar a favoritos");
    try {
      const res = await axios.post(
        `http://localhost:5000/api/favoritos/${user.id}/${id_sitio}`
      );
      const newUser = {
        ...user,
        favoritos: res.data.created
          ? [...user.favoritos, { id_sitio }]
          : user.favoritos.filter((s) => s.id_sitio !== id_sitio),
      };
      dispatch(updateUser(newUser));
      if (fav){
        const newFavList = new Set([...favList])
        newFavList.delete(id_sitio)
        setFavList(newFavList)
      }
    } catch (error) {
      console.error("Error al agregar a favoritos:", error);
    }
  };

  const handleCalificar = async (id_sitio, rating) => {
    try {
      const nuevo_rating = await axios.post(
        "http://localhost:5000/api/sitios/calificar",
        {
          id_sitio,
          id_usuario: user.id,
          rating,
        }
      );
      const new_data = [...data];
      for (let sitio of new_data) {
        if (sitio.id === id_sitio) {
          sitio.rating = nuevo_rating.data.rating;
        }
      }
      setData(new_data);
      let updateCalificados = user.sitiosCalificados.filter(
        (s) => s.id_sitio !== id_sitio
      );
      updateCalificados = [
        ...updateCalificados,
        { id_sitio, calificacion: rating },
      ];
      const new_user = {
        ...user,
        sitiosCalificados: updateCalificados,
      };
      dispatch(updateUser(new_user));
    } catch (error) {
      console.error("Error al calificar: ", error);
    }
  };

  const getCalificacion = (id_sitio) => {
    const sitio = user?.sitiosCalificados.filter(
      (s) => s.id_sitio === id_sitio
    )[0];
    return sitio?.calificacion;
  };

  return (
    <div className="sitios-usuario">
      <div className="filtros-container">
        <input
          type="text"
          className="buscador"
          placeholder="🔍 Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filtros-categorias">
          <label>Categorías</label>
          <div className="categorias-box">
            {categorias.map((c) => (
              <button
                key={c.id}
                className={`categoria-btn ${
                  categoria.includes(c.nombre) ? "active" : ""
                }`}
                onClick={() =>
                  setCategoria((prev) =>
                    prev.includes(c.nombre)
                      ? prev.filter((x) => x !== c.nombre)
                      : [...prev, c.nombre]
                  )
                }
              >
                {c.nombre}
              </button>
            ))}
          </div>
        </div>

        <label className="pet-checkbox">
          <input
            type="checkbox"
            checked={petFriendly}
            onChange={(e) => setPetFriendly(e.target.checked)}
          />
          <span className="checkmark"></span> Pet Friendly
        </label>

        <select
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
          className="select-edad"
        >
          <option value="">Todas las edades</option>
          <option value="0-3">0 a 3 años</option>
          <option value="4-7">4 a 7 años</option>
          <option value="8-10">8 a 10 años</option>
          <option value="11-13">11 a 13 años</option>
          <option value="14-17">14 a 17 años</option>
          <option value="18+">18+</option>
        </select>

        <div className="orden-container">
          <button
            className={`orden-btn ${ordenCampo === "rating" ? "active" : ""}`}
            onClick={() => handleOrden("rating")}
          >
            Rating{" "}
            {ordenCampo === "rating" && <span>{ordenAsc ? "⬆️" : "⬇️"}</span>}
          </button>
          <button
            className={`orden-btn ${ordenCampo === "likes" ? "active" : ""}`}
            onClick={() => handleOrden("likes")}
          >
            Likes{" "}
            {ordenCampo === "likes" && <span>{ordenAsc ? "⬆️" : "⬇️"}</span>}
          </button>
        </div>

        <button className="btn-reset" onClick={resetFiltros}>
          ↺ Reiniciar
        </button>
      </div>

      <div className="cards-grid">
        {filtered.length === 0 ? (
          <p className="no-result">
            No hay sitios que coincidan con los filtros
          </p>
        ) : (
          filtered.map((s) => (
            <Card
              key={s.id}
              tipo="sitio"
              modo="usuario"
              data={{
                ...s,
                categorias: s.Categoria?.map((c) => c.nombre) || [],
              }}
              onCalificar={(newValue) => handleCalificar(s.id, newValue)}
              onVer={() => handleVer(s.id)}
              onLike={() => handleLike(s.id)}
              onFavorito={() => handleFavorito(s.id)}
              like={likedList.has(s.id)}
              fav={favList.has(s.id)}
              calificacion={rateList.has(s.id) ? getCalificacion(s.id) : 0}
              fav_btn = {!fav}
            />
          ))
        )}
      </div>
    </div>
  );
}
