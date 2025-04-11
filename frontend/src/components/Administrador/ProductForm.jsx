"use client";
import { useState, useEffect, useRef } from "react";
import "./ProductForm.css";

const ProductForm = ({ product, onSave, onCancel, categories = [] }) => {
  // Estado inicial: usa los valores del producto si se está editando, o valores por defecto.
  const [formData, setFormData] = useState({
    id: product ? product.id : null,
    name: product ? product.name : "",
    categoryId: product ? product.categoryId : "",
    price: product ? product.price : "",
    stock: product ? product.stock : "",
    image: product ? product.image : "",
    description: product ? product.description : "",
    featured: product ? product.featured : false,
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(product ? product.image : "");
  const fileInput = useRef(null);

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        categoryId: product.categoryId,
        price: product.price,
        stock: product.stock,
        image: product.image,
        description: product.description,
        featured: product.featured,
      });
      setImagePreview(product.image);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!(formData.name || "").trim()) {
      newErrors.name = "El nombre del producto es obligatorio";
    }
    if (!formData.categoryId ) {
      newErrors.category = "La categoría es obligatoria";
    }
    if (!formData.price || isNaN(formData.price) || Number.parseFloat(formData.price) <= 0) {
      newErrors.price = "El precio debe ser un número mayor que cero";
    }
    if (!formData.stock || isNaN(formData.stock) || Number.parseInt(formData.stock) < 0) {
      newErrors.stock = "El stock debe ser un número no negativo";
    }
    if (!(formData.description || "").trim()) {
      newErrors.description = "La descripción es obligatoria";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const data = new FormData();
      data.append("name", formData.name);
      // Aquí se envía la categoría seleccionada.
      data.append("categoryId", formData.categoryId);
      data.append("price", Number.parseFloat(formData.price));
      data.append("stock", Number.parseInt(formData.stock));
      data.append("description", formData.description);
      data.append("featured", formData.featured);

      if (fileInput.current && fileInput.current.files[0]) {
        data.append("image", fileInput.current.files[0]);
      } else if (e.target.image && e.target.image.files && e.target.image.files[0]) {
        data.append("image", e.target.image.files[0]);
      }

      try {
        const url = product
          ? `http://localhost:5000/api/products/${product.id}`
          : "http://localhost:5000/api/products";
        const method = product ? "PUT" : "POST";
        const response = await fetch(url, { method, body: data });
        const result = await response.json();
        if (response.ok) {
          onSave(result);
        } else {
          console.error("Error al crear/actualizar producto", result);
        }
      } catch (error) {
        console.error("Error de red:", error);
      }
    }
  };

  return (
    <div className="form-overlay">
      <div className="product-form-container">
        <div className="form-header">
          <h2>{product ? "Editar Producto" : "Crear Producto"}</h2>
          <button className="close-form-button" onClick={onCancel}>×</button>
        </div>
        <form className="product-form" onSubmit={handleSubmit}>
          {/* Campos del producto */}
          <div className="form-group">
            <label htmlFor="name">Nombre del Producto*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Categoría*</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={errors.categoryId ? "error" : ""}
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && <div className="error-message">{errors.category}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Precio ($)*</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={errors.price ? "error" : ""}
            />
            {errors.price && <div className="error-message">{errors.price}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="stock">Stock*</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className={errors.stock ? "error" : ""}
            />
            {errors.stock && <div className="error-message">{errors.stock}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Descripción*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={errors.description ? "error" : ""}
            ></textarea>
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
            />
            <label htmlFor="featured">Producto destacado</label>
          </div>
          
          <div className="form-group">
            <label>Imagen del Producto</label>
            <div className="image-upload-container">
              <div className="image-preview">
                {imagePreview ? (
                  <img src={imagePreview || "/placeholder.svg"} alt="Vista previa" />
                ) : (
                  <div className="no-image">
                    <svg
                      viewBox="0 0 24 24"
                      width="48"
                      height="48"
                      stroke="#cbd5e0"
                      strokeWidth="1"
                      fill="none"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <span>Sin imagen</span>
                  </div>
                )}
              </div>
              <div className="image-upload-actions">
                <label htmlFor="image-upload" className="upload-button">
                  Subir Imagen
                </label>
                <input
                  type="file"
                  id="image-upload"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  ref={fileInput}
                />
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="save-button">
              {product ? "Guardar Cambios" : "Crear Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;