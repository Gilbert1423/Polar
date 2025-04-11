"use client";

import { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import CartIcon from "./Carticon";
import { useNavigate, Link } from "react-router-dom"; // Importa Link

const Navbar = ({ setIsAuthenticated }) => { // ✅ Recibe setIsAuthenticated como prop

  const user = JSON.parse(sessionStorage.getItem("user")) || {};
  const isAdmin = user?.role === "admin"; // ✅ Verifica si el usuario es administrador
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Estado para el texto de búsqueda
  const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("token")); // ✅ Estado de autenticación
  const menuRef = useRef(null); // ✅ Ref para detectar clics fuera del menú

  // ✅ Detecta cambios en sessionStorage y actualiza el estado automáticamente
  useEffect(() => {
    const checkSession = () => {
      setIsLoggedIn(!!sessionStorage.getItem("token"));
    };

    window.addEventListener("storage", checkSession);
    return () => {
      window.removeEventListener("storage", checkSession);
    };
  }, []);

  // ✅ Detectar clics fuera del menú para cerrarlo automáticamente
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsProfileOpen(false); // ✅ Cierra el menú si el clic ocurre afuera
      }
    };

    

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // ✅ Limpia el evento al desmontar
    };
  }, []);

  // ✅ Función para manejar el envío del formulario de búsqueda
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`); // Redirige a la página de resultados
    }
  };

  // ✅ Función para cerrar sesión y actualizar isAuthenticated
  const handleLogout = () => {
    console.log("Ejecutando handleLogout");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setIsAuthenticated(false);  // ✅ Oculta Navbar sin recargar la página
    setIsLoggedIn(false); // ✅ También oculta Navbar con su propio estado

    console.log("Token después de logout:", sessionStorage.getItem("token"));
    console.log("Usuario después de logout:", sessionStorage.getItem("user"));

    window.alert("Sesión cerrada");
    navigate("/login");
  };

  return isLoggedIn ? (
    <div className="nav" id="nav">
      {/* Logo */}
      <Link to="/" className="logo">
        <img src="/src/assets/img/logo.jpg" alt="Logo" />
      </Link>

      {/* Navegación Desktop */}
      <nav className="container">
        <Link to="/comida">Alimentos</Link>
        <Link to="/bebidas-alcoholicas">Bebidas alcohólicas</Link>
        <Link to="/bebidas-no-alcoholicas">Bebidas no alcohólicas</Link>
        <Link to="/limpieza">Limpieza</Link>
      </nav>

      {/* Búsqueda y Perfil */}
      <div className="nav-right">
        {/* Buscador */}
        <form className="search-container" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Productos"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              className="search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>

        {/* Carrito */}
        <CartIcon />

        {/* Perfil */}
        <div className="profile-container">
          <button className="profile-button" onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              className="user-icon">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
          {isProfileOpen && (
            <div ref={menuRef} className="profile-dropdown">
              <Link to="/profile">Mi Perfil</Link>

              {isAdmin && ( // ✅ Solo muestra el menú si el usuario es administrador
                <Link to="/panel-admin">Panel admin</Link>
              )}

              <button onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>

        {/* Botón Menú Móvil */}
        <button className="mobile-menu-button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Menú Móvil */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <button className="close-button" onClick={() => setIsMobileMenuOpen(false)}>×</button>
            <nav className="mobile-nav">
              <Link to="/comida">Alimentos</Link>
              <Link to="/bebidas-alcoholicas">Bebidas alcohólicas</Link>
              <Link to="/bebidas-no-alcoholicas">Bebidas no alcohólicas</Link>
              <Link to="/limpieza">Limpieza</Link>
              <Link to="/cart">Mi Carrito</Link>
            </nav>
            <div className="mobile-profile">
              <Link to="/profile">Mi Perfil</Link>

              {isAdmin && ( // ✅ Solo muestra el menú si el usuario es administrador
                <div className="admin-menu">
                  <Link to="/panel-admin">Panel Admin</Link>
                </div>
              )}
              
              <button onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : null;
};

export default Navbar;