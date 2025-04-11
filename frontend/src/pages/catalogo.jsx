import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const Catalogo = () => {
  const { nombre } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`https://polar-ux66.onrender.com/api/categories/${nombre}/products`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Datos inesperados del backend:", data);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [nombre]);

  const addToCart = async (productId) => {
    // Obtener el userId dinámicamente desde sessionStorage
    const storedUser = JSON.parse(sessionStorage.getItem("user")); // O localStorage
    const userId = storedUser ? storedUser.id : null;

    if (!userId) {
      console.error("No se encontró el userId. Por favor, inicia sesión.");
      alert("Por favor, inicia sesión para agregar productos al carrito.");
      return;
    }

    try {
      console.log("Agregando producto al carrito:", { userId, productId, quantity: 1 });

      // Enviar solicitud al backend
      const response = await fetch("https://polar-ux66.onrender.com/api/shop/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId, quantity: 1 }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar producto al carrito");
      }

      console.log("Producto agregado correctamente.");
      // alert("Producto agregado al carrito.");
    } catch (error) {
      console.error("Error al agregar producto:", error.message);
      alert("Hubo un problema al agregar el producto al carrito.");
    }
  };

  if (loading) return <p>Cargando productos...</p>;
  if (products.length === 0) return <p>No hay productos disponibles para {nombre}.</p>;

  return (
    <div className="catalogo-page">
      <h1>Catálogo de {nombre}</h1>
      <div className="product-grid-container">
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                {product.featured && <div className="product-badge badge-featured">Destacado</div>}
                <img
                  src={`https://polar-ux66.onrender.com${product.image}`}
                  alt={product.name}
                  className="product-image"
                />
              </div>
              <div className="product-content">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">${product.price.toFixed(2)}</span>
                  <button className="add-button" onClick={() => addToCart(product.id)}>
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalogo;