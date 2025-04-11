"use client";

import { useState } from "react";
import "./ProductList.css";

const ProductList = ({ products, onEdit, onDelete }) => {
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "ascending" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Función para ordenar productos
  const sortedProducts = [...products].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  // Función para cambiar el orden
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Obtener el icono de ordenamiento
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "⇅";
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="product-list-container">
      <div className="table-responsive">
        <table className="product-table">
          <thead>
            <tr>
              <th onClick={() => requestSort("id")}>ID {getSortIcon("id")}</th>
              <th onClick={() => requestSort("name")}>Producto {getSortIcon("name")}</th>
              <th onClick={() => requestSort("category")}>Categoría {getSortIcon("category")}</th>
              <th onClick={() => requestSort("price")}>Precio {getSortIcon("price")}</th>
              <th onClick={() => requestSort("stock")}>Stock {getSortIcon("stock")}</th>
              <th onClick={() => requestSort("featured")}>Destacado {getSortIcon("featured")}</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <div className="product-cell">
                      <img
                        src={
                          product.image
                            ? `https://polar-ux66.onrender.com${product.image}`
                            : "/placeholder.svg"
                        }
                        alt={product.name}
                        className="product-image"
                      />
                      <div className="product-info">
                        <span className="product-name">{product.name}</span>
                        <span className="product-description">
                          {product.description.substring(0, 50)}...
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{product.category ? product.category.name : "Sin categoría"}</td>
                  <td>${product.price}</td>
                  <td>
                    <span
                      className={`stock-badge ${
                        product.stock > 50
                          ? "in-stock"
                          : product.stock > 10
                          ? "low-stock"
                          : "out-stock"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`featured-badge ${
                        product.featured ? "is-featured" : "not-featured"
                      }`}
                    >
                      {product.featured ? "Sí" : "No"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-button"
                        onClick={() => onEdit(product)}
                        aria-label="Editar producto"
                      >
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
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => onDelete(product)}
                        aria-label="Eliminar producto"
                      >
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
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-products">
                  No se encontraron productos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Anterior
          </button>

          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`pagination-number ${currentPage === number ? "active" : ""}`}
              >
                {number}
              </button>
            ))}
          </div>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;