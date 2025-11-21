import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import { AuthProvider } from "./auth/AuthProvider";
import PrivateRoutes from "./auth/PrivateRoutes";
import Error404 from "./components/error404/Error404";
import Perfil from "./pages/Perfil";
import SitiosUsuario from "./pages/MisSitios";
import CrearSitio from "./pages/CrearSitio";
import DetalleSitio from "./pages/DetalleSitio";
import { CrearEvento } from "./pages/CrearEvento";
import { DetalleEvento } from "./pages/DetalleEvento";
import { SitioDetalle } from "./pages/SitioDetalle";
import { EventoDetalle } from "./pages/EventoDetalle";
import SitiosView from "./components/sitios/SitiosView";
// import Loading from "./components/loading/Loading";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="test" element={<Perfil/>}/> */}
          <Route element={<PrivateRoutes/>}>
            {/* <Navbar/> */}
            <Route path="/" element={<Home />} />
            <Route path="/usuario/perfil" element={<Perfil/>} />
            <Route path="/usuario/sitios" element={<SitiosUsuario/>} />
            <Route path="/usuario/sitios/crearsitio" element={<CrearSitio/>} />
            <Route path="/usuario/sitios/detalle_sitio/:id" element={<DetalleSitio/>} />
            <Route path="/usuario/sitios/editar_sitio/:id" element={<CrearSitio/>} />
            <Route path="/usuario/sitios/detalle_sitio/:id/crear_evento" element={<CrearEvento/>} />
            <Route path="/usuario/sitios/detalle_sitio/:id/editar_evento/:id_evento" element={<CrearEvento/>} />
            <Route path="/usuario/sitios/detalle_sitio/:id/detalle_evento/:id_evento" element={<DetalleEvento/>} />
            <Route path="/sitios/detalle/:id_sitio" element={<SitioDetalle/>} />
            <Route path="/eventos/:id_evento" element={<EventoDetalle/>} />
            <Route path="/usuario/favoritos" element={<SitiosView fav={true}/>} />
            {/* Podés agregar otras rutas después */}
          </Route>
          <Route path="*" element={<Error404/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
