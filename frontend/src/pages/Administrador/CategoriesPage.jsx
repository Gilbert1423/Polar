"use client";
import { useState, useEffect } from "react";
import "./CategoriesPage.css";
import Sidebar from "../../components/Administrador/Sidebar";
import Header from "../../components/Administrador/Header";
import CategoryForm from "../../components/Administrador/CategoryForm";
import DeleteConfirmation from "../../components/Administrador/DeleteConfirmation";

const CategoriesPage = () => {
  // Estado para la página activa a partir del hash de la URL
  const [activePage, setActivePage] = useState("categorias");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") || "productos";
    setActivePage(hash);
  }, []);

  // Estado de categorías (que se cargarán desde el backend)
  const [categories, setCategories] = useState([]);
  // Estado para la categoría seleccionada (para editar)
  const [selectedCategory, setSelectedCategory] = useState(null);
  // Estado para mostrar/ocultar el formulario de categoría
  const [isFormOpen, setIsFormOpen] = useState(false);
  // Estado para el modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  // Estado para el sidebar en móvil
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Estado para el filtro de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  const [currentCategory, setCurrentCategory] = useState("Todos"); // Agregado

  // Función para traer las categorías reales desde el backend
  const fetchCategories = async () => {
    try {
      const response = await fetch("https://polar-ux66.onrender.com/api/categories", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        // Agregamos una opción "Todos" para el filtro general
        setCategories(data); // Usa solo las categorías que vienen del backend
      } else {
        console.error("Error al obtener categorías:", data);
      }
    } catch (error) {
      console.error("Error de red al obtener categorías:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  
  // Dentro de fetchCategories:
  

// Filtrar categorías solo si estás en la página de productos
const filteredCategories =
activePage === "productos"
  ? categories.filter((category) =>
      currentCategory === "Todos"
        ? true
        : category.id === currentCategory
    )
  : categories;
  // Función para crear una categoría (POST)
  const addCategory = async (categoryData) => {
    try {
      const response = await fetch("https://polar-ux66.onrender.com/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });
      const newCategory = await response.json();
      if (response.ok) {
        setCategories((prev) => [...prev, newCategory]);
      } else {
        console.error("Error al crear categoría:", newCategory);
      }
    } catch (error) {
      console.error("Error de red al crear categoría:", error);
    }
    setIsFormOpen(false);
  };

  // Función para actualizar una categoría (PUT)
  const updateCategory = async (updatedCategory) => {
    try {
      const response = await fetch(
        `https://polar-ux66.onrender.com/api/categories/${updatedCategory.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedCategory),
        }
      );
      const result = await response.json();
      if (response.ok) {
        setCategories((prev) =>
          prev.map((cat) => (cat.id === result.id ? result : cat))
        );
      } else {
        console.error("Error al actualizar categoría:", result);
      }
    } catch (error) {
      console.error("Error de red al actualizar categoría:", error);
    }
    setIsFormOpen(false);
    setSelectedCategory(null);
  };

  // Función para eliminar una categoría (DELETE)
  const deleteCategory = async (id) => {
    try {
      const response = await fetch(`https://polar-ux66.onrender.com/api/categories/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
      } else {
        console.error("Error al eliminar categoría");
      }
    } catch (error) {
      console.error("Error de red al eliminar categoría:", error);
    }
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  // Abrir formulario para editar categoría
  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  // Abrir modal para confirmar eliminación
  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  // Abrir formulario para agregar nueva categoría
  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  // Cerrar formulario
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedCategory(null);
  };

  // Alternar el sidebar en móviles
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="admin-panel">
     <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        categories={categories}         // Aquí se pasan las categorías
        currentCategory={currentCategory} // y el filtro actual
        onCategoryChange={setCurrentCategory}
        activePage={activePage}
      />


      <div className="main-content">
        <Header
          onMenuClick={toggleSidebar}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <div className="content-wrapper">
          <div className="content-header">
            <h1>Gestión de Categorías</h1>
            <button className="add-button" onClick={handleAddCategory}>
              <span className="add-icon">+</span> Agregar Categoría
            </button>
          </div>

          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon categories-icon"></div>
              <div className="stat-info">
                <h3>{categories.length}</h3>
                <p>Total Categorías</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon products-icon"></div>
              <div className="stat-info">
                <h3>
                  {categories.reduce(
                    (total, category) =>
                      total + (category.products ? category.products.length : 0),
                    0
                  )}
                </h3>
                <p>Total Productos</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon recent-icon"></div>
              <div className="stat-info">
                <h3>
                  {categories.filter((cat) => {
                    const date = new Date(cat.createdAt);
                    const now = new Date();
                    const diffTime = Math.abs(now - date);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays <= 30;
                  }).length}
                </h3>
                <p>Categorías Recientes</p>
              </div>
            </div>
          </div>

          <div className="categories-grid">
            {filteredCategories.map((category) => (
              <div className="category-card" key={category.id}>
                <div className="category-header" style={{ backgroundColor: category.color || "#4299E1" }}>
                  <span className="category-icon">{category.icon || "🍎"}</span>
                  <div className="category-actions">
                    <button className="edit-button" onClick={() => handleEditCategory(category)} aria-label="Editar categoría">
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button className="delete-button" onClick={() => handleDeleteClick(category)} aria-label="Eliminar categoría">
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
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
                      {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : "Sin fecha"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="no-results">
              <svg viewBox="0 0 24 24" width="64" height="64" stroke="#CBD5E0" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="12" y1="8" x2="12" y2="16" />
              </svg>
              <p>No se encontraron categorías</p>
              <button className="add-button-small" onClick={handleAddCategory}>
                Agregar Categoría
              </button>
            </div>
          )}
        </div>
      </div>

      {isFormOpen && (
        <CategoryForm
          category={selectedCategory}
          onSave={selectedCategory ? updateCategory : addCategory}
          onCancel={handleCloseForm}
        />
      )}

      {showDeleteModal && categoryToDelete && (
        <DeleteConfirmation
          product={categoryToDelete}
          onConfirm={() => deleteCategory(categoryToDelete.id)}
          onCancel={() => setShowDeleteModal(false)}
          title="Eliminar Categoría"
          message={`Esta categoría contiene ${
            categoryToDelete.products ? categoryToDelete.products.length : 0
          } productos. Al eliminarla, los productos quedarán sin categoría.`}
        />
      )}
    </div>
  );
};

export default CategoriesPage;