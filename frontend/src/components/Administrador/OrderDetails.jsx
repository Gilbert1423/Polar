"use client";
import "./OrderDetails.css";

const OrderDetails = ({ order, onClose, onStatusChange, getStatusText }) => {
  // Función para manejar el cambio de estado
  const handleStatusChange = (newStatus) => {
    onStatusChange(order.id, newStatus);
  };

  // Función para obtener la clase CSS según el estado del pedido
  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "processing":
        return "status-processing";
      case "shipped":
        return "status-shipped";
      case "completed":
        return "status-completed";
      case "cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  return (
    <div className="details-overlay">
      <div className="order-details-container">
        <div className="details-header">
          <h2>Detalles del Pedido</h2>
          <button className="close-details" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="details-content">
          <div className="order-info-section">
            <div className="order-header">
              <div>
                <h3>{order.id}</h3>
                <span className={`order-status ${getStatusClass(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              <div className="order-date">
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
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
              </div>
            </div>

            <div className="order-grid">
              <div className="order-section">
                <h4>Cliente</h4>
                <div className="customer-details">
                  <div className="detail-item">
                    <span className="detail-label">Nombre:</span>
                    {/* Usamos order.user en lugar de order.customer */}
                    <span className="detail-value">
                      {order.user?.name || "Sin nombre"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">
                      {order.user?.email || "Sin email"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Teléfono:</span>
                    <span className="detail-value">
                      {order.user?.phone || "Sin teléfono"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="order-section">
                <h4>Envío</h4>
                <div className="shipping-details">
                  <div className="detail-item">
                    <span className="detail-label">Dirección:</span>
                    <span className="detail-value">
                      {order.user?.shippingAddress || "Sin dirección"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Método de Pago:</span>
                    <span className="detail-value">{order.payment_method || "Sin método de pago"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-section">
              <h4>Productos</h4>
              <div className="order-items">
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderDetails && order.orderDetails.length > 0 ? (
                      order.orderDetails.map((detail) => (
                        <tr key={detail.id}>
                          <td>{detail.product?.name || "Producto desconocido"}</td>
                          <td>${Number(detail.price_per_unit || 0).toFixed(2)}</td>
                          <td>{detail.quantity}</td>
                          <td>${(Number(detail.price_per_unit) * Number(detail.quantity)).toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">No hay productos en este pedido.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="order-summary">
              <div className="summary-item">
                <span>Subtotal:</span>
                <span>${Number(order.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span>Envío:</span>
                <span>${Number(order.shipping || 0).toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span>Impuestos:</span>
                <span>${Number(order.tax || 0).toFixed(2)}</span>
              </div>
              <div className="summary-item total">
                <span>Total:</span>
                <span>${Number(order.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="order-actions-section">
            <h4>Actualizar Estado</h4>
            <div className="status-buttons">
              <button
                className={`status-button pending ${order.status === "pending" ? "active" : ""}`}
                onClick={() => handleStatusChange("pending")}
                disabled={order.status === "pending"}
              >
                Pendiente
              </button>
              <button
                className={`status-button processing ${order.status === "processing" ? "active" : ""}`}
                onClick={() => handleStatusChange("processing")}
                disabled={order.status === "processing"}
              >
                Procesando
              </button>
              <button
                className={`status-button shipped ${order.status === "shipped" ? "active" : ""}`}
                onClick={() => handleStatusChange("shipped")}
                disabled={order.status === "shipped"}
              >
                Enviado
              </button>
              <button
                className={`status-button completed ${order.status === "completed" ? "active" : ""}`}
                onClick={() => handleStatusChange("completed")}
                disabled={order.status === "completed"}
              >
                Completado
              </button>
              <button
                className={`status-button cancelled ${order.status === "cancelled" ? "active" : ""}`}
                onClick={() => handleStatusChange("cancelled")}
                disabled={order.status === "cancelled"}
              >
                Cancelado
              </button>
            </div>

            <div className="additional-actions">
              <button className="action-button">
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
                  <path d="M21 15v4a2 2 0 0 1-2 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Descargar Factura
              </button>
              <button className="action-button">
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
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Enviar Email al Cliente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;