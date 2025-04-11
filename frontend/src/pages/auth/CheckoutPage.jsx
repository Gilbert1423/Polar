"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [adminPaymentInfo, setAdminPaymentInfo] = useState({
    bankName: "",
    phoneNumber: "",
    identificationNumber: "",
  });

  const [user, setUser] = useState(null);
  const [userPhone, setUserPhone] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [hasFetched, setHasFetched] = useState(false);

  // Cargar usuario desde sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log("Usuario cargado desde sessionStorage:", JSON.parse(storedUser));
    } else {
      console.error("⚠️ No se encontró un usuario en sessionStorage.");
    }
  }, []);

  // Cargar carrito desde localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("checkoutCart")) || [];
    console.log("Carrito recuperado en Checkout:", storedCart);
    setCartItems(storedCart);
  }, []);

  // Obtener datos del carrito y datos de pago móvil
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/shop/cart?userId=${user.id}`);
        const data = await response.json();
        console.log("Carrito recibido desde el backend:", data);
        setCartItems(data.length === 0 ? [] : data);
      } catch (error) {
        console.error("Error al obtener el carrito:", error);
      }
    };

    const fetchAdminPaymentInfo = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/payments/mobile");
        if (!response.ok) {
          console.error("Error al obtener la información de pago móvil:", response.statusText);
          return;
        }
        const data = await response.json();
        if (!data || Object.keys(data).length === 0) {
          console.error("⚠️ Error: No hay datos de pago móvil disponibles.");
          return;
        }
        setAdminPaymentInfo({
          bankName: data.bank_name || "No disponible",
          phoneNumber: data.phone_number || "No disponible",
          identificationNumber: data.id_card || "No disponible",
        });
      } catch (error) {
        console.error("Error al obtener la información de pago del administrador:", error);
      }
    };

    if (user && !hasFetched) {
      console.log("Ejecutando fetchCartItems y fetchAdminPaymentInfo...");
      fetchCartItems();
      fetchAdminPaymentInfo();
      setHasFetched(true);
    }
  }, [user, hasFetched]);

  // Procesar el pago
  const handleCheckout = async () => {
    if (!user) {
      alert("No se encontró información del usuario. Por favor, inicia sesión nuevamente.");
      return;
    }

    if (!paymentMethod) {
      alert("Por favor, selecciona un método de pago.");
      return;
    }

    if (paymentMethod === "pagoMovil" && (!userPhone || !referenceNumber)) {
      alert("Por favor, completa los campos de teléfono y número de referencia.");
      return;
    }

    const orderDetails = cartItems.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      price_per_unit: item.product.price,
      quantity: item.quantity,
    }));

    const orderData = {
      userId: user.id,
      userName: user.name,
      total: cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0),
      payment_method: paymentMethod,
      reference_number: referenceNumber,
      orderDetails,
    };

    console.log("Datos enviados al backend:", orderData);

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        console.log("Pedido registrado. Vaciar carrito...");

        // Vaciar el carrito en frontend
        setCartItems([]);

        // Eliminar carrito de localStorage
        localStorage.removeItem("checkoutCart");

        // Eliminar productos en la base de datos
        await fetch("http://localhost:5000/api/shop/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });

        // Redirigir a la página de confirmación
        navigate("/order-confirmation", { state: { orderData } });
      } else {
        const result = await response.json();
        alert("Hubo un problema al procesar el pedido: " + result.message);
      }
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      alert("Hubo un error al procesar el pedido. Inténtalo de nuevo.");
    }
  };

  const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const total = subtotal;

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <h1>Proceder al Pago</h1>

        {paymentMethod ? (
          <div className="payment-section">
            <div className="cart-summary">
              <h3>Resumen del Carrito</h3>
              <div className="cart-items">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="item-name">{item.product?.name || "Producto sin nombre"}</div>
                      <div className="item-details">
                        {item.quantity} x ${item.product?.price?.toFixed(2) || "0.00"}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Tu carrito está vacío. Agrega productos antes de pagar.</p>
                )}
              </div>
              <div className="cart-total">
                <span>Total:</span>
                <span>${cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2)}</span>
              </div>
            </div>

            <h2>Método de pago: {getPaymentMethodName(paymentMethod)}</h2>

            {/* 📌 Pago Móvil con la info del administrador */}
            {paymentMethod === "pagoMovil" && (
              <div className="payment-details">
                <div className="payment-info">
                  <p><strong>Banco:</strong> {adminPaymentInfo.bankName}</p>
                  <p><strong>Teléfono:</strong> {adminPaymentInfo.phoneNumber}</p>
                  <p><strong>Cédula:</strong> {adminPaymentInfo.identificationNumber}</p>
                </div>

                {/* Inputs para el usuario */}
                <div className="form-group">
                  <label htmlFor="userPhone">Tu número de teléfono:</label>
                  <input
                    type="tel"
                    id="userPhone"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="referenceNumber">Número de referencia:</label>
                  <input
                    type="text"
                    id="referenceNumber"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* 📌 Pago en Efectivo */}
            {paymentMethod === "efectivo" && (
              <div className="payment-details">
                <div className="payment-info">
                  <p>Pagarás en efectivo al momento de la entrega.</p>
                  <p><strong>Monto a pagar:</strong> ${total.toFixed(2)}</p>
                  <p>Por favor, asegúrate de tener el monto exacto.</p>
                </div>
              </div>
            )}

            {/* 📌 Pago con PayPal */}
            {paymentMethod === "paypal" && (
              <div className="payment-details">
                <div className="payment-info paypal-info">
                  <p>Serás redirigido a PayPal para completar tu pago de ${total.toFixed(2)}</p>
                </div>
              </div>
            )}

            <button className="checkout-button" onClick={handleCheckout}>
              Procesar al Pago
            </button>
            <button className="back-button" onClick={() => setPaymentMethod("")}>
              Cambiar método de pago
            </button>
          </div>
        ) : (
          <div className="payment-section">
            <h2>Seleccione método de pago</h2>
            <div className="payment-options">
              <div className="payment-option" onClick={() => setPaymentMethod("pagoMovil")}>
                <div className="payment-icon">📱</div>
                <span>Pago Móvil</span>
              </div>
              <div className="payment-option" onClick={() => setPaymentMethod("efectivo")}>
                <div className="payment-icon">💵</div>
                <span>Efectivo</span>
              </div>
              <div className="payment-option" onClick={() => setPaymentMethod("paypal")}>
                <div className="payment-icon">💳</div>
                <span>PayPal</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function getPaymentMethodName(method) {
  switch (method) {
    case "pagoMovil":
      return "Pago Móvil";
    case "efectivo":
      return "Efectivo";
    case "paypal":
      return "PayPal";
    default:
      return "";
  }
}

export default CheckoutPage;