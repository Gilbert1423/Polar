"use client";
import { useState, useEffect } from "react";
import "./OrdersPage.css";
import Sidebar from "../../components/Administrador/Sidebar";
import Header from "../../components/Administrador/Header";
import OrderDetails from "../../components/Administrador/OrderDetails";

const OrdersPage = () => {
  const [activePage, setActivePage] = useState("pedidos");
  const [orders, setOrders] = useState([]); // Estado inicial vacío para usar datos reales
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Función para obtener los pedidos desde el backend
  const fetchOrders = async () => {
    try {
      const response = await fetch("https://polar-ux66.onrender.com/api/orders", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log("Pedidos recibidos:", data);
      if (response.ok) {
        setOrders(data);
      } else {
        console.error("Error al obtener pedidos:", data);
      }
    } catch (error) {
      console.error("Error de red al obtener pedidos:", error);
    }
  };

  // Ejecutar fetch al montar el componente
  useEffect(() => {
    fetchOrders();
  }, []);

  // Filtrado de pedidos según búsqueda y filtro de estado
  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      String(order.id).toLowerCase().includes(term) ||
      (order.user &&
        (order.user.name.toLowerCase().includes(term) ||
         order.user.lastname.toLowerCase().includes(term) ||
         order.user.email.toLowerCase().includes(term)));
    // ...
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Métricas
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + Number(order.total), 0);
  const pendingOrders = orders.filter((order) => order.status === "pending").length;

  // Función para actualizar el estado de un pedido (conecta a la ruta PUT)
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`https://polar-ux66.onrender.com/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const updatedOrder = await response.json();
      if (response.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: updatedOrder.status } : order
          )
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: updatedOrder.status });
        }
      } else {
        console.error("Error al actualizar el estado del pedido:", updatedOrder);
      }
    } catch (error) {
      console.error("Error de red al actualizar el estado del pedido:", error);
    }
  };

  // Funciones para ver y cerrar detalles (actualmente usando modal)
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  // Alternar el sidebar en móviles
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Función para obtener el texto descriptivo del estado del pedido
  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "processing":
        return "Procesando";
      case "shipped":
        return "Enviado";
      case "completed":
        return "Completado";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  // Función para obtener la clase CSS para el estado del pedido
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
    <div className="admin-panel">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activePage={activePage}
      />

      <div className="main-content">
        <Header
          onMenuClick={toggleSidebar}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <div className="content-wrapper">
          <div className="content-header">
            <h1>Gestión de Pedidos</h1>
          </div>

          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon orders-icon"></div>
              <div className="stat-info">
                <h3>{totalOrders}</h3>
                <p>Total Pedidos</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon revenue-icon"></div>
              <div className="stat-info">
                <h3>${Number(totalRevenue).toFixed(2)}</h3>
                <p>Ingresos Totales</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon pending-icon"></div>
              <div className="stat-info">
                <h3>{pendingOrders}</h3>
                <p>Pendientes</p>
              </div>
            </div>
          </div>

          <div className="orders-filter">
            <div className="filter-buttons">
              <button
                className={`filter-button ${statusFilter === "all" ? "active" : ""}`}
                onClick={() => setStatusFilter("all")}
              >
                Todos
              </button>
              <button
                className={`filter-button ${statusFilter === "pending" ? "active" : ""}`}
                onClick={() => setStatusFilter("pending")}
              >
                Pendientes
              </button>
              <button
                className={`filter-button ${statusFilter === "processing" ? "active" : ""}`}
                onClick={() => setStatusFilter("processing")}
              >
                Procesando
              </button>
              <button
                className={`filter-button ${statusFilter === "shipped" ? "active" : ""}`}
                onClick={() => setStatusFilter("shipped")}
              >
                Enviados
              </button>
              <button
                className={`filter-button ${statusFilter === "completed" ? "active" : ""}`}
                onClick={() => setStatusFilter("completed")}
              >
                Completados
              </button>
              <button
                className={`filter-button ${statusFilter === "cancelled" ? "active" : ""}`}
                onClick={() => setStatusFilter("cancelled")}
              >
                Cancelados
              </button>
            </div>
          </div>

          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ID Pedido</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>
                        {order.user ? (
                          <div className="customer-info">
                            <span className="customer-name">
                              {order.user.name} {order.user.lastname}
                            </span>
                            <br />
                            <span className="customer-email">{order.user.email}</span>
                          </div>
                        ) : (
                          "Sin datos"
                        )}
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>${Number(order.total).toFixed(2)}</td>
                      <td>
                        <span className={`order-status ${getStatusClass(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td>
                        <button
                          className="view-button"
                          onClick={() => handleViewOrder(order)}
                          aria-label="Ver detalles del pedido"
                        >
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
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-orders">
                      No se encontraron pedidos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={handleCloseDetails}
          onStatusChange={updateOrderStatus}
          getStatusText={getStatusText}
        />
      )}
    </div>
  );
};

export default OrdersPage;