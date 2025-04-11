"use client"
import { useState, useEffect } from "react"
import "./CategoryForm.css"

const CategoryForm = ({ category, onSave, onCancel }) => {
 // Estado inicial del formulario: si se trata de edición, se usa la información de "category"
 const [formData, setFormData] = useState({
  id: category?.id || null,
  name: category?.name || "",
  description: category?.description || "",
  // Integración de nuevos campos
  icon: category?.icon || "🛒",
  color: category?.color || "#4299E1",
});

// Estado para errores de validación
const [errors, setErrors] = useState({});

// Efecto para actualizar el formulario si cambia la categoría (modo edición)
useEffect(() => {
  if (category) {
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description || "",
      icon: category.icon || "🛒",
      color: category.color || "#4299E1",
    });
  }
}, [category]);

// Manejo de cambios en los campos del formulario
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: value,
  });
  // Limpiar error cuando el usuario comienza a escribir
  if (errors[name]) {
    setErrors({ ...errors, [name]: null });
  }
};

// Validar el formulario
const validateForm = () => {
  const newErrors = {};
  if (!formData.name.trim()) {
    newErrors.name = "El nombre de la categoría es obligatorio";
  }
  if (!formData.description.trim()) {
    newErrors.description = "La descripción es obligatoria";
  }
  if (!formData.icon.trim()) {
    newErrors.icon = "El ícono es obligatorio";
  }
  if (!formData.color.trim()) {
    newErrors.color = "El color es obligatorio";
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

// Manejar envío del formulario
const handleSubmit = (e) => {
  e.preventDefault();
  if (validateForm()) {
    // Envía el objeto formData (que ya incluye los nuevos campos)
    onSave(formData);
  }
};

// Lista de emojis comunes para categorías (puedes ajustar o ampliar)
const commonEmojis = ["🛒", "🍎", "🍺", "🥤", "🧹", "🧴", "📱", "👕", "👖", "👟"];


  return (
    <div className="form-overlay">
      <div className="category-form-container">
        <div className="form-header">
          <h2>{category ? "Editar Categoría" : "Agregar Nueva Categoría"}</h2>
          <button className="close-form" onClick={onCancel}>
            ×
          </button>
        </div>

        <form className="category-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre de la Categoría*</label>
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
            <label htmlFor="description">Descripción*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className={errors.description ? "error" : ""}
            ></textarea>
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="icon">Ícono*</label>
              <div className="icon-selector">
                <input
                  type="text"
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className={errors.icon ? "error" : ""}
                  maxLength="2"
                />
                <div className="emoji-picker">
                  {commonEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className={`emoji-option ${formData.icon === emoji ? "selected" : ""}`}
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              {errors.icon && <div className="error-message">{errors.icon}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="color">Color*</label>
              <div className="color-selector">
                <input
                  type="color"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className={errors.color ? "error" : ""}
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={handleChange}
                  name="color"
                  className={`color-text ${errors.color ? "error" : ""}`}
                />
              </div>
              {errors.color && <div className="error-message">{errors.color}</div>}
            </div>
          </div>

          <div className="category-preview">
            <h3>Vista Previa</h3>
            <div className="preview-card">
              <div className="preview-header" style={{ backgroundColor: formData.color }}>
                <span className="preview-icon">{formData.icon}</span>
              </div>
              <div className="preview-content">
                <h4>{formData.name || "Nombre de la Categoría"}</h4>
                <p>{formData.description || "Descripción de la categoría"}</p>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="save-button">
              {category ? "Guardar Cambios" : "Crear Categoría"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CategoryForm

