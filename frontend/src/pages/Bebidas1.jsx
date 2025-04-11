"use client"

import { useNavigate } from "react-router-dom" // Importa el hook useNavigate

const Bebidas1 = () => {
  const navigate = useNavigate() // Inicializa el hook useNavigate

  const marcas = [
    { id: 1, nombre: "Polar", imagen: "/src/assets/img/marca1.1.png" },
    { id: 2, nombre: "Regional", imagen: "/src/assets/img/marca1.2.png" },
    { id: 3, nombre: "Zulia", imagen: "/src/assets/img/marca1.3.png" },
    { id: 4, nombre: "Solera", imagen: "/src/assets/img/marca1.4.png" },
    { id: 5, nombre: "Santa Teresa", imagen: "/src/assets/img/marca1.5.png" },
    { id: 6, nombre: "Cacique", imagen: "/src/assets/img/marca1.6.png" },
  ]

  const irACatalogo = (nombre) => {
    navigate(`/catalogo/${nombre}`) // Redirige al catálogo de la marca
  }

  return (
    <div className="categoria-container">
      <h1 className="categoria-titulo">Bebidas alcohólicas</h1>
      <div className="marcas-grid">
        {marcas.map((marca) => (
          <div key={marca.id} className="marca-item">
            <button className="marca-button" onClick={() => irACatalogo(marca.nombre)}>
              <img
                src={marca.imagen || "/placeholder.svg"}
                alt={`Logo de ${marca.nombre}`}
                className="marca-imagen"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Bebidas1