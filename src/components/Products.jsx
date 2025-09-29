import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import logoCafe from "../assets/logoCafe.png";
import bolsaCafe from "../assets/Bolsa_café.png";
import { useAuth } from "../context/AuthContext";
import "../styles/header.css";

const Products = () => {
  const { openAuthModal } = useAuth();
  const [products, setProducts] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastProductCount, setLastProductCount] = useState(0); // 🔹 Para el polling

  // 🔹 Cargar productos y precios desde el backend (inicialización como en tu JS puro)
  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log("📡 Obteniendo configuración...");
        const configRes = await fetch("/api/config");
        if (!configRes.ok) throw new Error("Error en /api/config");
        const config = await configRes.json();

        console.log("📦 Obteniendo productos...");
        const res = await fetch("/api/products", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Error cargando productos");
        const data = await res.json();
        console.log(
          "✅ Productos obtenidos:",
          data.products.length,
          "productos"
        );

        setProducts(data.products);
        setPrices(data.prices);

        // 🔹 Contar productos activos iniciales (como en tu JS puro)
        const activeCount = data.prices.filter((el) => {
          const product = data.products.find((p) => p.id === el.product);
          return el.active && product?.active;
        }).length;
        setLastProductCount(activeCount);
      } catch (err) {
        console.error("❌ Error cargando productos:", err.message);
        Swal.fire("Error", "No se pudieron cargar los productos", "error");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();

    // 🔹 Iniciar polling para nuevos productos (como en tu JS puro)
    const intervalId = setInterval(async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const currentActiveCount = data.prices.filter((el) => {
          const product = data.products.find((p) => p.id === el.product);
          return el.active && product?.active;
        }).length;

        if (currentActiveCount > lastProductCount) {
          Swal.fire({
            icon: "info",
            title: "¡Nuevos productos disponibles!",
            text: "¿Deseas recargar la página para verlos?",
            showCancelButton: true,
            confirmButtonText: "Sí, recargar",
            cancelButtonText: "Cancelar",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
          setLastProductCount(currentActiveCount);
        }
      } catch (err) {
        console.warn("Error al verificar productos nuevos:", err.message);
      }
    }, 60000); // 🔹 Cada 60 segundos, como en tu JS puro

    return () => clearInterval(intervalId); // Limpiar el interval al desmontar
  }, [lastProductCount]);

  // 🔹 Verificar si el usuario está autenticado (adaptado de tu JS puro)
  const isUserLoggedIn = async () => {
    try {
      const res = await fetch("/api/auth/profile", {
        method: "GET",
        credentials: "include",
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  // 🔹 Manejar click en producto y checkout (adaptado de tu JS puro)
  const handleCheckout = async (priceId) => {
    const loggedIn = await isUserLoggedIn();
    if (!loggedIn) {
      Swal.fire({
        icon: "warning",
        title: "Inicia sesión",
        text: "Debes iniciar sesión para comprar.",
        confirmButtonText: "Iniciar sesión",
      }).then(() => {
        openAuthModal(); // Abre el modal de login
      });
      return;
    }

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) throw new Error("Error creando sesión de pago");

      const session = await response.json();
      window.location.href = session.url;
    } catch (err) {
      console.error("❌ Error Stripe:", err.message);
      Swal.fire("Error", "No se pudo iniciar el pago", "error");
    }
  };

  if (loading) return <p>Cargando productos...</p>;

  // 🔹 Filtrar precios activos y verificar si hay productos (como en tu JS puro)
  const activePrices = prices.filter((price) => {
    const product = products.find((p) => p.id === price.product);
    return price.active && product?.active;
  });

  if (!activePrices.length) {
    return (
      <div className="no-products">
        <div className="no-products-content">
          <img src={logoCafe} alt="Sin productos" />
          <h3>¡Ups! No hay productos disponibles</h3>
          <p>Vuelve pronto, estamos preparando nuevos aromas para ti ☕</p>
        </div>
      </div>
    );
  }

  return (
    <section className="products">
      <h2>Nuestros Productos</h2>
      <div className="product-grid" id="bolsas">
        {" "}
        {/* 🔹 Mantengo id="bolsas" para compatibilidad */}
        {activePrices.map((price) => {
          const product = products.find((p) => p.id === price.product);
          if (!product) return null;

          const amount = price.unit_amount / 100;
          const formattedPrice = new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: price.currency.toUpperCase(),
          }).format(amount);

          return (
            <div
              key={price.id}
              className="product-card bolsa" // 🔹 Clase "bolsa" para estilizar como en tu template
              data-price={price.id}
              onClick={() => handleCheckout(price.id)}
            >
              <figure>
                <img
                  src={product.images?.[0] || bolsaCafe}
                  alt={product.name}
                />
                <figcaption>
                  {product.name} <br /> {formattedPrice}
                </figcaption>
              </figure>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Products;
