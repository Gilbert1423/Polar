"use client";
import { useEffect } from "react";
import { Link } from "react-router-dom"; // Importa Link si es necesario
import "./Sidebar.css";

const Sidebar = ({ 
  isOpen, 
  onClose, 
  categories, 
  currentCategory, 
  onCategoryChange, 
  activePage, 
  onPageChange // Asegúrate de que esta prop esté definida
}) => {
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") || "productos";
      console.log("Hash cambiado a:", hash);
      if (typeof onPageChange === "function") {
        onPageChange(hash); // Notifica al componente padre sobre el cambio de página
      } else {
        console.error("onPageChange no es una función válida");
      }
    };
  
    // Escucha los cambios en el hash
    window.addEventListener("hashchange", handleHashChange);
  
    // Inicializa el estado con el hash actual
    handleHashChange();
  
    // Limpia el evento al desmontar el componente
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [onPageChange]);

console.log("onPageChange en Sidebar:", onPageChange);
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2>Panel de Administración</h2>
        <button className="close-sidebar" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="sidebar-content">
        <div className="sidebar-section">
          <h3>Menú Principal</h3>
          <ul className="sidebar-menu">
            <li className={activePage === "productos" ? "active" : ""}>
              <a href="#productos" onClick={() => onPageChange("productos")}>
                Productos
              </a>
            </li>
            <li className={activePage === "categorias" ? "active" : ""}>
              <a href="#categorias" onClick={() => onPageChange("categorias")}>
                Categorías
              </a>
            </li>
            <li className={activePage === "pedidos" ? "active" : ""}>
              <a href="#pedidos" onClick={() => onPageChange("pedidos")}>
                Pedidos
              </a>
            </li>
            <li className={activePage === "clientes" ? "active" : ""}>
              <a href="#clientes" onClick={() => onPageChange("clientes")}>
                Clientes
              </a>
            </li>
            {/* <li className={activePage === "reportes" ? "active" : ""}>
              <a href="#reportes" onClick={() => onPageChange("reportes")}>
                Reportes
              </a>
            </li> */}
          </ul>
        </div>

        {/* Renderizamos el filtro de categorías solo si la sección activa es "productos" */}
        {activePage === "productos" && categories && currentCategory !== undefined && onCategoryChange && (
          <div className="sidebar-section">
            <h3>Filtrar por Categoría</h3>
            <ul className="category-filter">
              {categories.map((cat) => (
                <li
                  key={cat.id.toString()}
                  className={currentCategory === cat.id ? "active" : ""}
                  onClick={() => onCategoryChange(cat.id)}
                >
                  {cat.name}
                  {currentCategory === cat.id && (
                    <span className="check-icon">
                      <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="sidebar-section">
          <h3>Configuración</h3>
          <ul className="sidebar-menu">
            <li>
              <Link to="/Pagos">Gestión de pagos</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;