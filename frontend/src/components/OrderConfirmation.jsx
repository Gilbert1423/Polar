"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ Usa useLocation
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
  const navigate = useNavigate(); // Inicializa useNavigate
  const location = useLocation(); // ✅ Obtén datos reales del pedido
  const { orderData } = location.state || {};

  if (!orderData) {
    console.error("No se encontraron datos del pedido en OrderConfirmation.");
    return <p>Error: No se encontraron los datos del pedido.</p>;
  }

  // ✅ Carga el número de orden aleatorio
  const [orderNumber, setOrderNumber] = useState("");

   useEffect(() => {
    const completePayment = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/payments/mobile/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: orderData.userId }),
        });
  
        if (response.ok) {
          console.log("Pago confirmado, eliminando carrito...");
  
          await fetch("http://localhost:5000/api/shop/cart", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: orderData.userId }),
          });
  
          // Eliminar el carrito del localStorage usando la clave correcta
          if (localStorage.getItem("cart")) {
            localStorage.removeItem("cart");
            console.log("Carrito eliminado correctamente del localStorage.");
          } else {
            console.log("No se encontró el carrito en localStorage.");
          }
        } else {
          console.error("Error al confirmar pago:", response.statusText);
        }
      } catch (error) {
        console.error("Error al procesar confirmación de pago:", error);
      }
    };
  
    if (orderData.userId) {
      completePayment();
    }
  }, [orderData]);
  // ✅ Datos del pedido obtenidos correctamente\
  const userName = orderData.userName || "Usuario desconocido"; // ✅ Usar el no
  const orderItems = orderData.orderDetails || []; // ✅ Corregido: ahora usa `orderDetails`
  const total = orderData.total || 0; // ✅ Usa el total del pedido
  const paymentMethod = orderData.payment_method || "Método desconocido"; // ✅ Usa el método de pago real

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        {/* Icono de éxito */}
        <div className="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>

        <h1>¡Pago Completado!</h1>
        <p className="confirmation-message">
          Tu pedido ha sido procesado exitosamente. Hemos enviado un correo electrónico con los detalles de tu compra.
        </p>

        {/* Detalles del pedido */}
        <div className="order-details">
          <h2>Detalles del Pedido</h2>

          <div className="order-info11">
            <div className="info-row">
              <span>Nombre del usuario:</span>
              <span className="order-number">{userName}</span>
            </div>
            <div className="info-row">
              <span>Fecha:</span>
              <span>{new Date().toLocaleDateString("es-ES")}</span>
            </div>
            <div className="info-row">
              <span>Método de pago:</span>
              <span>{paymentMethod}</span> {/* ✅ Se muestra el método correcto */}
            </div>
          </div>

          {/* Resumen de productos */}
          <div className="order-summary">
            <h3>Productos</h3>
            <div className="order-items">
            {orderItems.length > 0 ? (
                orderItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-name">{item.productName}</div> {/* ✅ Ahora muestra los nombres correctamente */}
                    <div className="item-details">
                      {item.quantity} x ${item.price_per_unit.toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <p>No hay productos en el pedido.</p>
            )}
            </div>
            <div className="order-total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="contact-info">
            <h3>¿Tienes preguntas?</h3>
            <p>Contáctanos a través de:</p>
            <p>
              <strong>Email:</strong> soporte@tutienda.com
            </p>
            <p>
              <strong>Teléfono:</strong> (123) 456-7890
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="action-buttons">
          <button className="primary-button" onClick={() => navigate("/")}>
            Volver a la Tienda
          </button>
          {/* <button className="secondary-button" onClick={() => navigate("/profile")}>
            Ver Mis Pedidos
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;