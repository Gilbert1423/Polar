"use client";

import { useNavigate } from "react-router-dom"; // Para manejar la redirección
import { useState } from "react";

const Comida = () => {
  const navigate = useNavigate(); // Hook para redirigir
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);

  const marcas = [
    { id: 1, nombre: "Pan", imagen: "/src/assets/img/marca1.png" },
    { id: 2, nombre: "Primor", imagen: "/src/assets/img/marca2.png" },
    { id: 3, nombre: "Mavesa", imagen: "/src/assets/img/marca3.png" },
    { id: 4, nombre: "Rikesa", imagen: "/src/assets/img/marca4.png" },
    { id: 5, nombre: "Toddy", imagen: "/src/assets/img/marca5.png" },
    { id: 6, nombre: "Quaker", imagen: "/src/assets/img/marca6.png" },
    { id: 7, nombre: "Pampero", imagen: "/src/assets/img/marca7.png" },
    { id: 8, nombre: "Margarita", imagen: "/src/assets/img/marca8.png" },
    { id: 9, nombre: "Mi gurt", imagen: "/src/assets/img/marca9.png" },
    { id: 10, nombre: "Mazeite", imagen: "/src/assets/img/marca10.png" },
    { id: 11, nombre: "Konga", imagen: "/src/assets/img/marca11.png" },
    { id: 12, nombre: "Nelly", imagen: "/src/assets/img/nelly.png" },
    { id: 13, nombre: "Efe", imagen: "/src/assets/img/marca13.png" },
    { id: 14, nombre: "Chef", imagen: "/src/assets/img/marca14.png" },
  ];

  const redirigirACatalogo = (nombre) => {
    navigate(`/catalogo/${nombre}`); // Redirige a la ruta del catálogo
  };

  const mostrarMarca = (nombre) => {
    setMarcaSeleccionada(nombre);
    redirigirACatalogo(nombre); // Redirige automáticamente
  };

  return (
    <div className="categoria-container">
      <h1 className="categoria-titulo">Alimentos</h1>

      {marcaSeleccionada && (
        <div className="marca-seleccionada">
          <h2>Productos de {marcaSeleccionada}</h2>
          <button className="volver-button" onClick={() => setMarcaSeleccionada(null)}>
            Volver a todas las marcas
          </button>
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

export default Comida;