import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom"; // ✅ Solo importa Routes y Route
import DynamicTitle from "./components/DynamicTitle"; // ✅ Importa el título dinámico
import Login from "./pages/auth/Login";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Comida from "./pages/Comida";
import Bebidas1 from "./pages/Bebidas1";
import Bebidas2 from "./pages/Bebidas2";
import Limpieza from "./pages/Limpieza";
import Footer from "./components/Footer";
import Profile from "./pages/auth/Profile";
import PrivateRoute from "./components/PrivateRoute";
import ProductGrid from "./pages/catalogo";
import SearchResults from "./components/SearchResults";
import AdminPanel from "./pages/Administrador/AdminPanel";
import CategoriesPage from "./pages/Administrador/CategoriesPage";
import OrdersPage from "./pages/Administrador/OrdersPage";
import CustomersPage from "./pages/Administrador/CustomersPage";
import ReportsPage from "./pages/Administrador/ReportsPage";
import CheckoutPage from "./pages/auth/CheckoutPage";
import { useState, useEffect } from "react";
import PaymentMethodsPage from "./pages/Administrador/PaymentMethodsPage";
import OrderConfirmationPage from "./pages/auth/OrderConfirmationPage";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import ScrollToTop from "./components/Scrolltotop";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem("token"));
  const [activePage, setActivePage] = useState(window.location.hash.replace("#", "") || "productos");

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!sessionStorage.getItem("token"));
    };
    const interval = setInterval(checkAuth, 500); // ✅ Detecta cambios en sessionStorage cada medio segundo
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") || "productos";
      console.log("Hash cambiado a:", hash); // Depuración
      setActivePage(hash);
    };
  
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);
  
  const renderPage = () => {
    switch (activePage) {
      case "categorias":
        return <CategoriesPage />;
      case "pedidos":
        return <OrdersPage />;
      case "clientes":
        return <CustomersPage />;
      case "reportes":
        return <ReportsPage />;
      default:
        return <AdminPanel activePage={activePage} setActivePage={setActivePage} />;
    }
  };

  return (
    <>
      {/* <SVGBackground /> */}
      <DynamicTitle /> {/* ✅ Agrega el título dinámico aquí */}
      {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
        <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/comida" element={<PrivateRoute><Comida /></PrivateRoute>} />
        <Route path="/bebidas-alcoholicas" element={<PrivateRoute><Bebidas1 /></PrivateRoute>} />
        <Route path="/bebidas-no-alcoholicas" element={<PrivateRoute><Bebidas2 /></PrivateRoute>} />
        <Route path="/limpieza" element={<PrivateRoute><Limpieza /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/catalogo/:nombre" element={<PrivateRoute><ProductGrid /></PrivateRoute>} />
        <Route path="/search" element={<PrivateRoute><SearchResults /></PrivateRoute>} />
        <Route path="/panel-admin" element={<PrivateRoute adminOnly={true}>{renderPage()}</PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
        <Route path="/Pagos" element={<PrivateRoute adminOnly={true}><PaymentMethodsPage /></PrivateRoute>} />
        <Route path="/order-confirmation" element={<PrivateRoute><OrderConfirmationPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
      {isAuthenticated && <Footer />}
    </>
  );
}

export default App;