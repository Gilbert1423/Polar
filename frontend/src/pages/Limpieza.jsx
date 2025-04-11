"use client";

import { useNavigate } from "react-router-dom"; // Importar useNavigate para redirección
import { useState } from "react";

const Limpieza = () => {
  const navigate = useNavigate(); // Hook para redirigir
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);

  const marcas = [
    { id: 1, nombre: "Las Llaves", imagen: "/src/assets/img/marca3.1.png" },
    { id: 2, nombre: "Multi Clean", imagen: "/src/assets/img/marca3.2.png" },
  ];

  // Función para redirigir al catálogo de la marca seleccionada
  const redirigirACatalogo = (nombre) => {
    navigate(`/catalogo/${nombre}`); // Redirige a la ruta dinámica del catálogo
  };

  const mostrarMarca = (nombre) => {
    setMarcaSeleccionada(nombre);
    redirigirACatalogo(nombre); // Redirige automáticamente
  };

  return (
    <div className="categoria-container">
      <h1 className="categoria-titulo">Limpieza</h1>

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

export default Limpieza;