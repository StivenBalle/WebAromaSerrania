import express from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import Stripe from "stripe";
import { fileURLToPath } from "url";

// Resolver __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔍 DIAGNÓSTICO COMPLETO DEL PROYECTO");
console.log("=".repeat(50));

// 1. Verificar directorio actual
console.log("📁 Directorio actual:", __dirname);

// 2. Verificar archivo .env
console.log("\n🔧 VERIFICANDO ARCHIVO .ENV:");
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  console.log("✅ Archivo .env existe:", envPath);
  dotenv.config({ path: envPath });

  const requiredVars = [
    "DB_HOST",
    "DB_USER",
    "DB_PASSWORD",
    "DB_NAME",
    "STRIPE_SECRET_KEY",
  ];
  requiredVars.forEach((v) => {
    console.log(
      process.env[v] ? `✅ ${v}: configurada` : `❌ ${v}: no encontrada`
    );
  });
} else {
  console.log("❌ No se encontró archivo .env en:", envPath);
}

// 3. Verificar dependencias
console.log("\n📦 VERIFICANDO DEPENDENCIAS:");
const packagePath = path.join(__dirname, "../package.json");
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  const deps = packageJson.dependencies || {};
  ["express", "stripe", "dotenv", "cors", "pg"].forEach((dep) => {
    console.log(
      deps[dep]
        ? `  ✅ ${dep} instalado (${deps[dep]})`
        : `  ❌ Falta instalar ${dep}`
    );
  });
}

// 4. Test Stripe
console.log("\n🔌 VERIFICANDO CONEXIÓN STRIPE:");
if (process.env.STRIPE_SECRET_KEY) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const products = await stripe.products.list({ limit: 1 });
    console.log(
      `✅ Stripe responde. Productos encontrados: ${products.data.length}`
    );
  } catch (err) {
    console.log("❌ Error al conectar a Stripe:", err.message);
  }
} else {
  console.log("❌ STRIPE_SECRET_KEY no configurada");
}

// 5. Test puerto
console.log("\n🌐 VERIFICANDO PUERTO 3000:");
const testServer = express();
const server = testServer
  .listen(3000, () => {
    console.log("✅ Puerto 3000 disponible");
    server.close();
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log("⚠️ Puerto 3000 ya está en uso");
    } else {
      console.log("❌ Error puerto:", err.message);
    }
  });

console.log("=".repeat(50));
console.log("✅ Diagnóstico completado");
