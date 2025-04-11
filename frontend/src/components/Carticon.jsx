import { useState, useEffect } from "react";
import ShoppingCart from "../pages/carrito";
import "./CartIcon.css"; // Importamos el CSS separado

const CartIcon = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch("https://polar-ux66.onrender.com/api/shop/cart");
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error("Error al obtener productos del carrito:", error);
      }
    };

    fetchCartItems();
  }, []);

  // const getTotalItems = () => {
  //   // return cartItems.reduce((total, item) => total + item.quantity, 0);
  // };

  return (
    <div className="shop-cart-icon-container">
      {/* Botón del carrito */}
      <button
        className="shop-cart-icon-button"
        onClick={() => setIsCartOpen(!isCartOpen)}
        aria-label="Carrito de compras"
      >
        🛒 
      {/* <span className="shop-cart-count">{getTotalItems()}</span> */}
      </button>

      {/* Carrito flotante (slide-in desde la derecha) */}
      {isCartOpen && (
        <div className={`shop-cart-slide ${isCartOpen ? "open" : ""}`}>
          <ShoppingCart onClose={() => setIsCartOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default CartIcon;