import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SearchResults = ({ addToCart }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query")?.toLowerCase();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Obtener los productos desde el backend
  useEffect(() => {
    if (!query) return;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://polar-ux66.onrender.com/api/products?search=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Error al obtener los productos.");
        
        const data = await res.json();
        console.log("🔍 Datos recibidos:", data); // ✅ Verifica qué devuelve el backend
        setProductos(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  // ✅ Función para agregar al carrito
  const handleAddToCart = async (productId) => {
    const userId = 6; // 🛠️ Ajusta según el usuario logueado
    try {
      const response = await fetch("https://polar-ux66.onrender.com/api/shop/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId, quantity: 1 }),
      });

      if (!response.ok) throw new Error("Error al agregar producto al carrito");

      alert(`✅ Producto agregado al carrito.`);
    } catch (error) {
      console.error("Error al agregar producto:", error.message);
    }
  };

  return (
    <div className="catalogo-page">
      <h1>Resultados de búsqueda para: "{query}"</h1>

      {loading && <p>Cargando resultados...</p>}
      {error && <p>Error: {error}</p>}

      <div className="product-grid-container">
        <div className="product-grid">
          {productos.length > 0 ? (
            productos.map((product) => (
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
                    <span className="product-price">${product.price ? product.price.toFixed(2) : "N/A"}</span>
                    <button className="add-button" onClick={() => handleAddToCart(product.id)}>
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            !loading && <p>No se encontraron resultados para "{query}".</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;