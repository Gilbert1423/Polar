"use client";
import { useState, useEffect } from "react";
import "./CustomersPage.css";
import Sidebar from "../../components/Administrador/Sidebar";
import Header from "../../components/Administrador/Header";
import CustomerDetails from "../../components/Administrador/CustomerDetails";

const CustomersPage = () => {
  const [activePage, setActivePage] = useState("clientes");
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Función para obtener usuarios desde el backend
  const fetchUsers = async () => {
    console.log("Iniciando fetch de usuarios");
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      console.log("Usuarios recibidos:", data); // Aquí verifica la estructura en consola
      if (response.ok) {
        setUsers(data);
      } else {
        console.error("Error al obtener clientes:", data);
      }
    } catch (error) {
      console.error("Error de red al obtener clientes:", error);
    }
  };

  // Se ejecuta una sola vez al montar el componente.
  useEffect(() => {
    fetchUsers();
  }, []);

  const updateCustomerStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const updatedUser = await response.json();
      if (response.ok) {
        // Actualiza el estado de los usuarios
        setUsers((prev) =>
          prev.map((user) => (user.id === id ? { ...user, status: updatedUser.status } : user))
        );
        // Actualiza los detalles si el usuario actualmente es seleccionado
        if (selectedCustomer && selectedCustomer.id === id) {
          setSelectedCustomer({ ...selectedCustomer, status: updatedUser.status });
        }
      } else {
        console.error("Error al actualizar estado del cliente:", updatedUser);
      }
    } catch (error) {
      console.error("Error de red al actualizar estado del cliente:", error);
    }
  };

  // Filtrado de usuarios según el término de búsqueda y el estado (all, active, inactive)
  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(term) ||
      user.lastname.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term);
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Métricas
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.status === "active").length;
  const totalRevenue = users.reduce((acc, user) => acc + (user.totalSpent || 0), 0);
  const averageOrders =
    totalUsers > 0
      ? (users.reduce((acc, user) => acc + (user.totalOrders || 0), 0) / totalUsers).toFixed(1)
      : 0;

  // Función para ver detalles de un cliente (esto activa el modal)
  const handleViewCustomer = (user) => {
    console.log("Ver detalles para:", user);
    setSelectedCustomer(user);
  };

  const handleCloseDetails = () => {
    setSelectedCustomer(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
            <h1>Gestión de Clientes</h1>
          </div>

          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon customers-icon"></div>
              <div className="stat-info">
                <h3>{totalUsers}</h3>
                <p>Total Clientes</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon active-icon"></div>
              <div className="stat-info">
                <h3>{activeUsers}</h3>
                <p>Clientes Activos</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orders-avg-icon"></div>
              <div className="stat-info">
                <h3>{averageOrders}</h3>
                <p>Pedidos Promedio</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon revenue-icon"></div>
              <div className="stat-info">
                <h3>${totalRevenue.toFixed(2)}</h3>
                <p>Ingresos Totales</p>
              </div>
            </div>
          </div>

          <div className="customers-filter">
            <div className="filter-buttons">
              <button
                className={`filter-button ${statusFilter === "all" ? "active" : ""}`}
                onClick={() => setStatusFilter("all")}
              >
                Todos
              </button>
              <button
                className={`filter-button ${statusFilter === "active" ? "active" : ""}`}
                onClick={() => setStatusFilter("active")}
              >
                Activos
              </button>
              <button
                className={`filter-button ${statusFilter === "inactive" ? "active" : ""}`}
                onClick={() => setStatusFilter("inactive")}
              >
                Inactivos
              </button>
            </div>
          </div>

          <div className="customers-table-container">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Contacto</th>
                  <th>Registro</th>
                  <th>Pedidos</th>
                  <th>Total Gastado</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>
                        <div className="customer-name-cell">
                          <div className="customer-avatar">{user.name.charAt(0)}</div>
                          <span>{user.name} {user.lastname}</span>
                        </div>
                      </td>
                      <td>
                        <div className="customer-contact-cell">
                          <div className="contact-item">
                            <svg
                              viewBox="0 0 24 24"
                              width="14"
                              height="14"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                              <polyline points="22,6 12,13 2,6" />
                            </svg>
                            {user.email}
                          </div>
                          <div className="contact-item">
                            <svg
                              viewBox="0 0 24 24"
                              width="14"
                              height="14"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            {user.phone}
                          </div>
                        </div>
                      </td>
                      <td>{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : "N/A"}</td>
                      <td>{user.totalOrders}</td>
                      <td>${Number(user.totalSpent || 0).toFixed(2)}</td>
                      <td>
                        <span className={`customer-status ${user.status}`}>
                          {user.status === "active" ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="view-button"
                          onClick={() => handleViewCustomer(user)}
                          aria-label="Ver detalles del cliente"
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
                    <td colSpan="8" className="no-customers">No se encontraron clientes.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedCustomer && (
  <CustomerDetails
    customer={selectedCustomer}
    onClose={handleCloseDetails}
    onStatusChange={updateCustomerStatus}
  />
)}
    </div>
  );
};

export default CustomersPage;