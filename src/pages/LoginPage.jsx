import "./LoginPage.css";
import { useDispatch, useSelector } from "react-redux";
import { loginWithGoogle, loginWithFacebook } from "../features/auth/authSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleLoginButton,
  FacebookLoginButton,
} from "react-social-login-buttons";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { succes, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (succes) {
      navigate("/"); // o dashboard
    }
  }, [succes, navigate]);

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Iniciar Sesión</h2>

        <GoogleLoginButton
          className="login-btn"
          onClick={() => dispatch(loginWithGoogle())}
          disabled={loading.google}
          text={loading.google ? "Conectando..." : "Ingresar con Google"}
        />

        <FacebookLoginButton
          className="login-btn"
          onClick={() => dispatch(loginWithFacebook())}
          disabled={loading.facebook}
          text={loading.facebook ? "Conectando..." : "Ingresar con Facebook"}
        />

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
