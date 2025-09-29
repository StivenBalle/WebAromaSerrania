export async function login(email, password) {
  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include", // 👈 enviar/recibir cookies
  });
  return res.json();
}

export async function getProfile() {
  try {
    const res = await fetch("http://localhost:3000/api/auth/profile", {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    const data = await res.json();
    return data; // Devolver el objeto parseado
  } catch (err) {
    console.error("Error en getProfile:", err.message);
    throw err; // Propagar el error para que AuthContext lo maneje
  }
}

export async function register(name, phone_number, email, password) {
  try {
    const res = await fetch(`http://localhost:3000/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone_number, email, password }),
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) {
      const error = new Error(
        `Error ${res.status}: ${data.error || res.statusText}`
      );
      error.status = res.status;
      throw error;
    }
    return data;
  } catch (err) {
    console.error("Error en fetch:", err);
    throw err;
  }
}
