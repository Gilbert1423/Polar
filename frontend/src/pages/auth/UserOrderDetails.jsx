"use client";
import "../../components/Administrador/OrderDetails.css";

const UserOrderDetails = ({ order, onClose }) => {
  return (
    <div className="details-overlay">
      <div className="order-details-container">
        <div className="details-header">
          <h2>Detalles del Pedido</h2>
          <button className="close-details" onClick={onClose}>×</button>
        </div>

        <div className="details-content">
          <div className="order-info-section">
            <div className="order-header">
              <h3>Pedido #{order.id}</h3>
              <span className={`order-status ${order.status.replace(/\s+/g, "-")}`}>{order.status}</span>
            </div>
            <div className="order-date">
              Fecha: {new Date(order.createdAt).toLocaleDateString()} {/* ✅ Formatear correctamente la fecha */}
            </div>

            

            <div className="order-grid">
                 <div className="order-section">
                    <h4>Cliente</h4>
                    <div className="customer-details">
                        <div className="detail-item">
                        <span className="detail-label">Nombre:</span>
                        <span className="detail-value">{order.user?.name || "Sin nombre"}</span>
                        </div>
                        <div className="detail-item">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{order.user?.email || "Sin email"}</span>
                        </div>
                        <div className="detail-item">
                        <span className="detail-label">Teléfono:</span>
                        <span className="detail-value">{order.user?.phone || "Sin teléfono"}</span>
                        </div>
                    </div>
                </div>

                <div className="order-section">
                    <h4>Envío</h4>
                    <div className="shipping-details">
                        <div className="detail-item">
                        <span className="detail-label">Dirección:</span>
                        <span className="detail-value">{order.user?.shippingAddress || "Sin dirección"}</span>
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
                    order.orderDetails.map((item) => (
                      <tr key={item.id}>
                        <td>{item.product.name}</td>
                        <td>${Number(item.product.price || 0).toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>${Number(item.quantity * item.product.price || 0).toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center" }}>No hay productos en este pedido.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="order-summary">
              <div className="summary-item"><span>Subtotal:</span> <span>${order.subtotal || 0}</span></div>
              <div className="summary-item"><span>Envío:</span> <span>${order.shipping || 0}</span></div>
              <div className="summary-item"><span>Impuestos:</span> <span>${order.tax || 0}</span></div>
              <div className="summary-item total"><span>Total:</span> <span>${order.total || 0}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrderDetails;