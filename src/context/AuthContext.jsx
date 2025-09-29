import React, { createContext, useContext, useState, useEffect } from "react";
import { login, getProfile } from "../api.js";
import Swal from "sweetalert2";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await getProfile();
        console.log("Perfil cargado:", data);
        setUser(data);
      } catch (err) {
        console.error("Error fetching profile:", err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginUser = async (email, password) => {
    try {
      const data = await login(email, password);
      if (data.message === "✅ Login exitoso") {
        setUser(data.user);
        setAuthModalOpen(false);
        Swal.fire({
          icon: "success",
          title: "✅ Inicio de sesión exitoso",
          text: `Bienvenido, ${data.user.name}!`,
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload(); // 🔹 Recargar la página tras el SweetAlert
        });
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error };
    } catch (err) {
      console.error("❌ Error en login:", err.message);
      return { success: false, error: "Error en el servidor" };
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: loginUser, // 🔹 Renamed to avoid conflict with import
        logout,
        authModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
