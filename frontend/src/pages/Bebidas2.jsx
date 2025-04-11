"use client";

import { useNavigate } from "react-router-dom"; // Para manejar la redirección
import { useState } from "react";

const Bebidas2 = () => {
  const navigate = useNavigate(); // Hook para redirigir
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);

  const marcas = [
    { id: 1, nombre: "Pepsi", imagen: "/src/assets/img/marca2.1.png" },
    { id: 2, nombre: "Maltin Polar", imagen: "/src/assets/img/marca2.2.png" },
    { id: 3, nombre: "Golden", imagen: "/src/assets/img/marca2.3.png" },
    { id: 4, nombre: "Chinotto", imagen: "/src/assets/img/marca2.4.png" },
    { id: 5, nombre: "Yukery", imagen: "/src/assets/img/marca2.5.png" },
    { id: 6, nombre: "Yuky-Pak", imagen: "/src/assets/img/marca2.6.png" },
    { id: 7, nombre: "Minalba", imagen: "/src/assets/img/marca2.7.png" },
    { id: 8, nombre: "Minalba Sparklig", imagen: "/src/assets/img/marca2.8.png" },
    { id: 9, nombre: "Gatorade", imagen: "/src/assets/img/marca2.9.png" },
    { id: 10, nombre: "Lipton", imagen: "/src/assets/img/marca2.10.png" },
  ];

  // Redirigir al catálogo
  const redirigirACatalogo = (nombre) => {
    navigate(`/catalogo/${nombre}`); // Redirige a la ruta del catálogo
  };

  const mostrarMarca = (nombre) => {
    setMarcaSeleccionada(nombre);
    redirigirACatalogo(nombre); // Redirige automáticamente
  };

  return (
    <div className="categoria-container">
      <h1 className="categoria-titulo">Bebidas no alcohólicas</h1>

      {marcaSeleccionada && (
        <div className="marca-seleccionada">
          <h2>Productos de {marcaSeleccionada}</h2>
          <button className="volver-button" onClick={() => setMarcaSeleccionada(null)}>
            Volver a todas las marcas
          </button>
          <div className="productos-placeholder">
            <p>Mostrando productos de {marcaSeleccionada}...</p>
          </div>
        </div>
      )}

      {!marcaSeleccionada && (
        <div className="marcas-grid">
          {marcas.map((marca) => (
            <div key={marca.id} className="marca-item">
              <button className="marca-button" onClick={() => mostrarMarca(marca.nombre)}>
                <img
                  src={marca.imagen || "/placeholder.svg"}
                  alt={`Logo de ${marca.nombre}`}
                  className="marca-imagen"
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bebidas2;