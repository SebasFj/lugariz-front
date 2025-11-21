import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import Loading from "../components/loading/Loading";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // para esperar a Firebase

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // si hay usuario logueado, se mantiene
      setLoading(false);    // ya terminó de verificar
    });

    return () => unsubscribe(); // limpieza al desmontar
  }, []);

  // Mientras Firebase verifica el usuario, podemos mostrar un loader
  if (loading) {
    return <Loading/> 
  }

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
