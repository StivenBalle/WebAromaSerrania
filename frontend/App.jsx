import { Routes, Route, Form } from "react-router-dom";
import Header from "../frontend/components/Header";
import Footer from "../frontend/components/Footer";
import Home from "../frontend/pages/Home";
import Historia from "../frontend/pages/Historia";
import Preparacion from "../frontend/pages/Preparacion";
import Success from "../frontend/components/Success";
import Cancel from "../frontend/components/Cancel";
import Terminos from "../frontend/pages/Terminos";
import NotFound from "../frontend/components/NotFound";
import AdminOrders from "../frontend/components/AdminOrders";
import { AuthProvider } from "../frontend/context/AuthContext";
import AuthModal from "../frontend/components/AuthModal";

function App() {
  return (
    <AuthProvider>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aromaHistoria" element={<Historia />} />
        <Route path="/preparacion" element={<Preparacion />} />
        <Route path="/terminos&condiciones" element={<Terminos />} />
        <Route path="/successfullPayment" element={<Success />} />
        <Route path="/paymentCanceled" element={<Cancel />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
      <AuthModal />
    </AuthProvider>
  );
}

export default App;
