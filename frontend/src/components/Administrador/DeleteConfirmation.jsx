"use client";
import "./DeleteConfirmation.css";

const DeleteConfirmation = ({ product, onConfirm, onCancel, title, message }) => {
  return (
    <div className="delete-overlay">
      <div className="delete-modal">
        <div className="delete-icon">
          <svg
            viewBox="0 0 24 24"
            width="48"
            height="48"
            stroke="#e53e3e"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <h2>
          {title || "Eliminar"} {product && product.name}
        </h2>
        <p>
          {message ||
            `¿Estás seguro de que deseas eliminar ${product && product.name}? Esta acción no se puede deshacer.`}
        </p>
        <div className="delete-actions">
          <button className="cancel-delete" onClick={onCancel}>
            Cancelar
          </button>
          <button className="confirm-delete" onClick={onConfirm}>
            Sí, Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;