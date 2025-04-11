"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import "./carrito.css";

export default function ShoppingCart({ onClose }) {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const cartRef = useRef(null);
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  // Cargar productos del carrito desde el backend
  const [hasFetched, setHasFetched] = useState(false); // ✅ Estado para controlar la carga
  
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (hasFetched) return; // ✅ Evita múltiples ejecuciones
  
        const response = await fetch("https://polar-ux66.onrender.com/api/shop/cart");
        const data = await response.json();
        console.log("Carrito recibido:", data);
  
        if (!data || data.length === 0) {
          setCartItems([]);
        } else {
          setCartItems(data);
        }
  
        updateSubtotal(data);
        setHasFetched(true); // ✅ Marca que la llamada ya fue realizada
      } catch (error) {
        console.error("Error al obtener productos del carrito:", error);
      }
    };
  
    fetchCartItems();
  }, [hasFetched]); // ✅ Dependencia solo en `hasFetched`

  // Función para reducir una unidad o eliminar el producto
  const removeItem = async (itemId, currentQuantity) => {
    try {
      if (currentQuantity > 1) {
        const response = await fetch(`https://polar-ux66.onrender.com/api/shop/cart/${itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: currentQuantity - 1 }),
        });
  
        if (response.ok) {
          setCartItems((prevItems) =>
            prevItems.map((item) =>
              item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
            )
          );
          updateSubtotal(cartItems);
        } else {
          console.error("Error al reducir la cantidad:", response.statusText);
        }
      } else {
        const response = await fetch(`https://polar-ux66.onrender.com/api/shop/cart/${itemId}`, {
          method: "DELETE",
        });
  
        if (response.ok) {
          setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId)); // ✅ Mantiene eliminación uno por uno
          updateSubtotal(cartItems);
        } else {
          console.error("Error al eliminar producto:", response.statusText);
        }
      }
    } catch (error) {
      console.error("Error al modificar el carrito:", error);
    }
  };
  // Actualizar el subtotal automáticamente
  const updateSubtotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    setSubtotal(total);
  };

  // Cerrar el carrito al hacer clic fuera de él
  const handleOutsideClick = (event) => {
    if (cartRef.current && !cartRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Verificar si el carrito está vacío
  const isEmpty = cartItems.length === 0;

  // Función para manejar el clic en "Proceder al Pago"
  const handleCheckout = () => {
    console.log("Estado actual del carrito antes de guardar:", cartItems); // 🔍 Verifica si cartItems tiene productos
    if (cartItems.length === 0) {
      alert("Tu carrito está vacío. Agrega productos antes de pagar.");
      return;
    }
  
    localStorage.setItem("checkoutCart", JSON.stringify(cartItems)); // ✅ Guarda el carrito
    console.log("Carrito guardado en localStorage:", localStorage.getItem("checkoutCart"));
  
    navigate("/checkout"); // ✅ Redirige a la pantalla de pago
  };

  return (
    <div className="shop-cart-container" ref={cartRef}>
      <div className="shop-cart-header">
        <div className="shop-cart-title">
          🛒 
          <h2>
            Mi Carrito{" "}
          </h2>
            {!isEmpty && <span className="cart-count-header">{cartItems.length}</span>}
        </div>
        <button className="shop-close-button" onClick={onClose}>×</button>
      </div>

      <div className="shop-cart-content">
        {isEmpty ? (
          <div className="empty-cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "16px", color: "#999" }}>
              <circle cx="8" cy="21" r="1"></circle>
              <circle cx="19" cy="21" r="1"></circle>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
            </svg>
            <h3 style={{ margin: "0 0 8px 0", color: "#333" }}>Tu carrito está vacío</h3>
            <p style={{ margin: "0 0 16px 0", color: "#666" }}>Agrega productos para comenzar tu compra</p>
            <button style={{ padding: "10px 16px", backgroundColor: "#111", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "500" }} onClick={onClose}>
              Continuar comprando
            </button>
          </div>
        ) : (
          <div className="shop-cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="shop-cart-item">
                <div className="shop-item-details">
                  <h3>{item.product.name}</h3>
                  <p>{item.quantity} × ${item.product.price.toFixed(2)}</p>
                </div>
                <div className="shop-item-price">${(item.quantity * item.product.price).toFixed(2)}</div>
                <button className="shop-remove-item" onClick={() => removeItem(item.id, item.quantity)}>−</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {!isEmpty && (
        <div className="shop-cart-summary">
          <div className="shop-subtotal">
            <span>Subtotal</span>
            <span className="shop-subtotal-amount">${subtotal.toFixed(2)}</span>
          </div>
          <p className="shop-tax-note">Impuestos y envío calculados en el checkout</p>
        </div>
      )}

      <div className="shop-cart-actions">
        {!isEmpty && (
          <button className="shop-checkout-button" onClick={handleCheckout}>
            Proceder al Pago
          </button>
        )}
      </div>
    </div>
  );
}