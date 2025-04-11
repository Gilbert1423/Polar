"use client";
import "./CustomerDetails.css";

const CustomerDetails = ({ customer, onClose, onStatusChange }) => {
  // Función para manejar el cambio de estado
  const handleStatusChange = (newStatus) => {
    onStatusChange(customer.id, newStatus);
  };

  return (
    <div className="details-overlay">
      <div className="customer-details-container">
        <div className="details-header">
          <h2>Detalles del Cliente</h2>
          <button className="close-details" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="details-content">
          <div className="customer-info-section">
            <div className="customer-header">
              <div className="customer-avatar large">
                {customer.name.charAt(0)}
              </div>
              <div className="customer-header-info">
                <h3>{customer.name} {customer.lastname}</h3>
                <span className={`customer-status ${customer.status}`}>
                  {customer.status === "active" ? "Activo" : "Inactivo"}
                </span>
                <div className="customer-since">
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
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Cliente desde {new Date(customer.registeredDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="customer-grid">
              <div className="customer-section">
                <h4>Información de Contacto</h4>
                <div className="contact-details">
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{customer.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Teléfono:</span>
                    <span className="detail-value">{customer.phone}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Dirección:</span>
                    <span className="detail-value">{customer.address || customer.shippingAddress}</span>
                  </div>
                </div>
              </div>

              <div className="customer-section">
                <h4>Estadísticas</h4>
                <div className="stats-details">
                  <div className="stat-item">
                    <div className="stat-icon orders-icon"></div>
                    <div className="stat-info">
                      <span className="stat-value">{customer.totalOrders}</span>
                      <span className="stat-label">Pedidos Totales</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon revenue-icon"></div>
                    <div className="stat-info">
                      <span className="stat-value">
                        ${Number(customer.totalSpent || 0).toFixed(2)}
                      </span>
                      <span className="stat-label">Total Gastado</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon recent-icon"></div>
                    <div className="stat-info">
                      <span className="stat-value">
                        {customer.lastOrderDate ? customer.lastOrderDate : "N/A"}
                      </span>
                      <span className="stat-label">Último Pedido</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="customer-section">
              <h4>Historial de Pedidos</h4>
              {customer.totalOrders > 0 ? (
                <div className="order-history-placeholder">
                  <p>Aquí se mostraría el historial de pedidos del cliente.</p>
                </div>
              ) : (
                <div className="no-orders">
                  <svg
                    viewBox="0 0 24 24"
                    width="48"
                    height="48"
                    stroke="#CBD5E0"
                    strokeWidth="1"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <p>Este cliente aún no ha realizado ningún pedido.</p>
                </div>
              )}
            </div>
          </div>

          <div className="customer-actions-section">
            <h4>Acciones</h4>
            <div className="status-buttons">
              <button
                className={`status-button active ${customer.status === "active" ? "current" : ""}`}
                onClick={() => handleStatusChange("active")}
                disabled={customer.status === "active"}
              >
                Marcar como Activo
              </button>
              <button
                className={`status-button inactive ${customer.status === "inactive" ? "current" : ""}`}
                onClick={() => handleStatusChange("inactive")}
                disabled={customer.status === "inactive"}
              >
                Marcar como Inactivo
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
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Enviar Email
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
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Editar Información
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;