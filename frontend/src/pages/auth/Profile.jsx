"use client";

import React, { useState, useEffect } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import UserOrderDetails from "./UserOrderDetails"; // ✅ Modal para mostrar detalles del pedido

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    lastname: "",
    email: "",
    memberSince: "",
    phone: "",
    shippingAddress: "",
    avatar: "",
  });
  const [newAvatar, setNewAvatar] = useState(null);
  const [orders, setOrders] = useState([]); // ✅ Pedidos obtenidos del backend
  const [selectedOrder, setSelectedOrder] = useState(null); // ✅ Pedido seleccionado para mostrar en el modal

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    async function fetchProfile() {
      try {
        const res = await fetch("https://polar-ux66.onrender.com/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setProfile({
            name: data.name || "",
            lastname: data.lastname || "", // ✅ Agregar apellido
            email: data.email || "",
            memberSince: data.memberSince || "Desconocido",
            phone: data.phone || "",
            shippingAddress: data.shippingAddress || "",
            avatar: data.avatar ? `https://polar-ux66.onrender.com${data.avatar}` : "/images/default-avatar.png",
          });
        } else {
          setMessage("Error al obtener el perfil.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage("Error de red al obtener el perfil.");
      }
    }

    async function fetchOrders() {
      try {
        const res = await fetch("https://polar-ux66.onrender.com/api/orders/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (!res.ok) {
          throw new Error("Error al obtener los pedidos.");
        }
    
        const data = await res.json();
        console.log("🧐 Datos recibidos en el frontend:", JSON.stringify(data, null, 2)); // ✅ Verificar si `user` está llegando
    
        setOrders(data.orders || []);
      } catch (error) {
        console.error("❌ Error en fetchOrders:", error);
      }
    }

    fetchProfile();
    fetchOrders();
  }, [token, navigate]);

  useEffect(() => {
    const handleStorageUpdate = () => {
      const updatedUser = JSON.parse(sessionStorage.getItem("user"));
      if (updatedUser) {
        setProfile(updatedUser); // ✅ Actualiza el estado cuando `sessionStorage` cambia
      }
    };

    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageUpdate); // ✅ Limpia el evento al desmontar
    };
  }, []);

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(file);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("lastname", profile.lastname); // ✅ Incluye el apellido
      formData.append("email", profile.email);
      formData.append("phone", profile.phone);
      formData.append("shippingAddress", profile.shippingAddress);
      if (newAvatar) {
        formData.append("avatar", newAvatar); // ✅ Agrega la imagen al FormData
      }
  
      const res = await fetch("https://polar-ux66.onrender.com/api/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ No incluyas "Content-Type" con FormData
        },
        body: formData,
      });
  
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Perfil actualizado correctamente");
        sessionStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => {
          setIsEditing(false);
        }, 2000);
      } else {
        console.error("❌ Error al actualizar el perfil:", data.error);
        setMessage("❌ Ocurrió un error al actualizar el perfil");
      }
    } catch (error) {
      console.error("❌ Error en la solicitud:", error);
      setMessage("❌ Error en la conexión con el servidor");
    }
  };

  const handleOrderDetails = (order) => {
    setSelectedOrder(order); // ✅ Muestra el pedido seleccionado en el modal
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={newAvatar ? URL.createObjectURL(newAvatar) : profile.avatar || "/images/default-avatar.png"} alt="Avatar" />
          {isEditing && <input type="file" accept="image/*" onChange={handleAvatarChange} />}
        </div>
        <div className="profile-info">
          <h1>{`${profile.name} ${profile.lastname}`.trim() || "Tu Nombre"}</h1>
          <p>{profile.email || "tuemail@example.com"}</p>
          <span>Miembro desde {profile.memberSince}</span>
        </div>
      </div>

      <div className="profile-nav">
        <button className={`nav-item ${activeTab === "personal" ? "active" : ""}`} onClick={() => setActiveTab("personal")}>
          Información Personal
        </button>
        <button className={`nav-item ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>
          Mis Pedidos
        </button>
      </div>

      <div className="profile-content">
        {activeTab === "personal" && (
          <div className="personal-info">
            <h2>Información Personal</h2>
            {message && <p>{message}</p>}

            {!isEditing ? (
              <div className="info-display">
                <p><strong>Nombre:</strong> {profile.name}</p>
                <p><strong>Apellido:</strong> {profile.lastname}</p> {/* ✅ Mostrar apellido */}
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Teléfono:</strong> {profile.phone}</p>
                <p><strong>Dirección:</strong> {profile.shippingAddress}</p>
                <button onClick={() => setIsEditing(true)}>Editar Perfil</button>
              </div>
            ) : (
              <form className="info-form" onSubmit={handleSaveChanges}>
                <div className="form-group">
                  <label>Avatar:</label>
                  <input type="file" accept="image/*" onChange={handleAvatarChange} />
                </div>
                <div className="form-group">
                  <label>Nombre completo:</label>
                  <input type="text" name="name" value={profile.name} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Apellido:</label> {/* ✅ Nuevo campo para el apellido */}
                  <input type="text" name="lastname" value={profile.lastname} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Correo Electrónico:</label>
                  <input type="email" name="email" value={profile.email} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Teléfono:</label>
                  <input type="tel" name="phone" value={profile.phone} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Dirección de Envío:</label>
                  <textarea id="textarea" name="shippingAddress" value={profile.shippingAddress} onChange={handleInputChange}></textarea>
                </div>

                <div className="form-actions">
                  <button className="cancel-button" type="button" onClick={() => setIsEditing(false)}>Cancelar</button>
                  <button className="save-button" type="submit">Guardar Cambios</button>
                </div>
              </form>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="orders-section">
            <h2>Mis Pedidos</h2>
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <h3>Pedido #{order.id}</h3>
                    <span className={`order-status ${order.status.replace(/\s+/g, "-")}`}>{order.status}</span>
                  </div>
                  <div className="order-info">
                    <div className="info-item">
                      <span>Fecha:</span>
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="info-item">
                      <span>Productos:</span>
                      <span>{order.orderDetails.length} artículos</span>
                    </div>
                    <div className="info-item">
                      <span>Total:</span>
                      <span className="order-total">{order.total}</span>
                    </div>
                  </div>
                  <button className="details-button" onClick={() => handleOrderDetails(order)}>
                    Ver Detalles
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal para mostrar los detalles del pedido */}
      {selectedOrder && (
        <UserOrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)} // ✅ Cierra el modal al hacer clic en cerrar
        />
      )}
    </div>
  );
}