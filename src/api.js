const API_URL = import.meta.env.VITE_API_URL;

// 🔹 Cliente genérico
async function request(path, { method = "GET", body } = {}) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${path}`, options);

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const error = new Error(
      data?.error || `Error ${res.status}: ${res.statusText}`
    );
    error.status = res.status;
    throw error;
  }

  return data;
}

// 🔹 Helpers
const get = (path) => request(path);
const post = (path, body) => request(path, { method: "POST", body });
const put = (path, body) => request(path, { method: "PUT", body });
const del = (path) => request(path, { method: "DELETE" });

// 🔹 Funciones específicas
export const login = (email, password) =>
  post("/api/auth/login", { email, password });

export const register = (name, phone_number, email, password) =>
  post("/api/auth/register", { name, phone_number, email, password });

export const getProfile = () => get("/api/auth/profile");

export const getHistorial = () => get("/api/historial");

export const getAdminOrders = () => get("/api/admin/orders");

export const getConfig = () => get("/api/config");

export const getProducts = () => get("/api/products");

export const createCheckout = (priceId) =>
  post("/api/create-checkout-session", { priceId });
