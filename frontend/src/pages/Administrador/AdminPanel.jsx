"use client";
import { useState, useEffect } from "react";
import "./AdminPanel.css";
import ProductList from "../../components/Administrador/ProductList";
import ProductForm from "../../components/Administrador/ProductForm";
import Sidebar from "../../components/Administrador/Sidebar";
import Header from "../../components/Administrador/Header";
import DeleteConfirmation from "../../components/Administrador/DeleteConfirmation";

import { Navigate } from "react-router-dom";


const AdminPanel = ({ activePage, setActivePage })  => {
  const userData = JSON.parse(sessionStorage.getItem("user")); // ✅ Obtener usuario de sesión
  const isAdmin = userData?.role === "admin"; // ✅ Verificar si es administrador

  if (!isAdmin) {
    return <Navigate to="/" />; // 🚫 Redirigir usuarios normales al inicio
  }



  // Estados principales
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos"); // Filtro de categoría
  const [categories, setCategories] = useState([]); // Categorías iniciales (se llenarán desde el backend)

  // Función para obtener productos desde el backend
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
        /* En este ejemplo se extraen las categorías de los productos, 
           pero lo ideal es que las categorías se obtengan de su propio endpoint.
           const uniqueCategories = ["Todos", ...new Set(data.map((p) => p.category))];
           setCategories(uniqueCategories.map((cat) => ({ id: cat, name: cat })));
        */
      } else {
        console.error("Error al obtener productos:", data);
      }
    } catch (error) {
      console.error("Error de red al obtener productos:", error);
    }
  };

  // Función para obtener categorías reales desde el backend
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        // Agregamos manualmente la opción "Todos" para el filtrado
        setCategories([{ id: "Todos", name: "Todos" }, ...data]);
      } else {
        console.error("Error al obtener categorías:", data);
      }
    } catch (error) {
      console.error("Error de red al obtener categorías:", error);
    }
  };

  // Cargar productos y categorías al montar el componente
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Filtrar productos basado en búsqueda y categoría
  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term);
    const matchesCategory = activePage === "productos" &&
      (categoryFilter === "Todos" || product.category === categoryFilter);
    // Cuando estemos en la sección de productos, se aplica el filtro, de lo contrario se muestran todos
    return matchesSearch && (activePage !== "productos" || matchesCategory);
  });

  // Función para guardar (crear o actualizar) un producto
  const handleSaveProduct = async (productData) => {
    if (productData.id) {
      // Actualizar producto (PUT)
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        const updatedProduct = await response.json();
        if (response.ok) {
          setProducts((prev) =>
            prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
          );
        } else {
          console.error("Error al actualizar producto:", updatedProduct);
        }
      } catch (error) {
        console.error("Error de red al actualizar producto:", error);
      }
    } else {
      // Crear producto (POST)
      try {
        const response = await fetch("http://localhost:5000/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        const newProduct = await response.json();
        if (response.ok) {
          setProducts((prev) => [...prev, newProduct]);
        } else {
          console.error("Error al crear producto:", newProduct);
        }
      } catch (error) {
        console.error("Error de red al crear producto:", error);
      }
    }
    setIsFormOpen(false);
    setSelectedProduct(null);
  };

  // Función para eliminar un producto
  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        console.error("Error al eliminar producto");
      }
    } catch (error) {
      console.error("Error de red al eliminar producto:", error);
    }
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handlePageChange = (page) => {
    console.log("Página activa cambiada a:", page); // Depuración
    setActivePage(page);
    window.location.hash = page; // Actualiza el hash en la URL
  };

  // Funciones para abrir formularios y modales
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedProduct(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="body2">
      <div className="admin-panel">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          categories={categories} // Se pasan todas las categorías, incl. "Todos"
          currentCategory={categoryFilter}
          onCategoryChange={setCategoryFilter}
          activePage={activePage}
          onPageChange={(page) => {
            console.log("Página activa cambiada a:", page); // Depuración
            setActivePage(page);
          }}
        />

        <div className="main-content">
          <Header
            onMenuClick={toggleSidebar}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <div className="content-wrapper">
            {activePage === "productos" && (
              <>
                <div className="content-header">
                  <h1>Gestión de Productos</h1>
                  <button className="add-button" onClick={handleAddProduct}>
                    <span className="add-icon">+</span> Agregar Producto
                  </button>
                </div>

                <div className="stats-cards">
                  <div className="stat-card">
                    <div className="stat-icon products-icon"></div>
                    <div className="stat-info">
                      <h3>{products.length}</h3>
                      <p>Total Productos</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon stock-icon"></div>
                    <div className="stat-info">
                      <h3>{products.reduce((total, product) => total + product.stock, 0)}</h3>
                      <p>Total Inventario</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon featured-icon"></div>
                    <div className="stat-info">
                      <h3>{products.filter((product) => product.featured).length}</h3>
                      <p>Productos Destacados</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon categories-icon"></div>
                    <div className="stat-info">
                      {/* Restamos 1 para excluir la opción "Todos" */}
                      <h3>{categories.length > 0 ? categories.length - 1 : 0}</h3>
                      <p>Categorías</p>
                    </div>
                  </div>
                </div>

                <ProductList
                  products={filteredProducts}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteClick}
                />
              </>
            )}

                   {activePage === "categorias" && (
              <div className="categories-grid">
                {categories.map((category) => (
                  <div className="category-card" key={category.id}>
                    <div
                      className="category-header"
                      style={{ backgroundColor: category.color || "#4299E1" }}
                    >
                      <span className="category-icon">{category.icon || "🍎"}</span>
                      <div className="category-actions">
                        <button
                          className="edit-button"
                          onClick={() => handleEditCategory(category)}
                          aria-label="Editar categoría"
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
                          onClick={() => handleDeleteClick(category)}
                          aria-label="Eliminar categoría"
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
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="category-content">
                      <h3>{category.name}</h3>
                      <p className="category-description">{category.description}</p>
                      <div className="category-meta">
                        <span className="products-count">
                          {category.products ? category.products.length : 0} productos
                        </span>
                        <span className="created-date">
                          {category.createdAt
                            ? new Date(category.createdAt).toLocaleDateString()
                            : "Sin fecha"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {isFormOpen && (
          <ProductForm
            product={selectedProduct}
            onSave={handleSaveProduct}
            onCancel={handleCloseForm}
            // Se filtran las categorías para excluir la opción "Todos" en el ProductForm
            categories={categories.filter((cat) => cat.id !== "Todos")}
          />
        )}

        {showDeleteModal && (
          <DeleteConfirmation
            product={productToDelete}
            onConfirm={() => handleDeleteProduct(productToDelete.id)}
            onCancel={() => {
              setShowDeleteModal(false);
              setProductToDelete(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;