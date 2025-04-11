"use client";

import { useState, useEffect } from "react";
import "./PaymentMethodsManager.css";

const PaymentMethodsManager = () => {
  const [activeTab, setActiveTab] = useState("methods");
  const [activePaymentMethod, setActivePaymentMethod] = useState(null);
  const [isConfiguring, setIsConfiguring] = useState(false);

  // Estados para la configuración de métodos de pago
  const [pagoMovilConfig, setPagoMovilConfig] = useState({
    enabled: true,
    bankName: "",
    phoneNumber: "",
    identificationNumber:  "",
  });

  const [paypalConfig, setPaypalConfig] = useState({
    enabled: true,
    clientId: "AaBbCcDd...",
    sandbox: true,
    autoReturn: true,
  });

  // 📌 Obtener la configuración de Pago Móvil desde el backend
  useEffect(() => {
    const fetchPagoMovilConfig = async () => {
      try {
        const response = await fetch("https://polar-ux66.onrender.com/api/payments/mobile");
        const data = await response.json();
        setPagoMovilConfig({
          enabled: data.enabled || true,
          bankName: data.bank_name || "",
          phoneNumber: data.phone_number || "",
          identificationNumber:  data.id_card || "",
        });
      } catch (error) {
        console.error("Error al obtener la configuración de Pago Móvil:", error);
      }
    };
    fetchPagoMovilConfig();
  }, []);

  // 📌 Guardar la configuración de Pago Móvil en el backend
  const savePagoMovilConfig = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://polar-ux66.onrender.com/api/payments/mobile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled: pagoMovilConfig.enabled,
          bank_name: pagoMovilConfig.bankName,
          phone_number: pagoMovilConfig.phoneNumber,
          id_card: pagoMovilConfig.identificationNumber,
        }),
      });

      if (response.ok) {
        alert("Configuración de Pago Móvil guardada correctamente");
        setIsConfiguring(false);
      } else {
        alert("Error al guardar la configuración");
      }
    } catch (error) {
      console.error("Error al actualizar la configuración de Pago Móvil:", error);
    }
  };

  // 📌 Guardar la configuración de PayPal en el backend
  const savePaypalConfig = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://polar-ux66.onrender.com/api/payments/paypal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled: paypalConfig.enabled,
          client_id: paypalConfig.clientId,
          sandbox: paypalConfig.sandbox,
          auto_return: paypalConfig.autoReturn,
        }),
      });

      if (response.ok) {
        alert("Configuración de PayPal guardada correctamente");
        setIsConfiguring(false);
      } else {
        alert("Error al guardar la configuración");
      }
    } catch (error) {
      console.error("Error al actualizar la configuración de PayPal:", error);
    }
  };

  // Renderizado de la configuración de Pago Móvil
  const renderPagoMovilConfig = () => (
    <form onSubmit={savePagoMovilConfig} className="payment-config-form">
      <h3>Configuración de Pago Móvil</h3>

      <div className="form-group">
        <label htmlFor="bankName">Nombre del Banco</label>
        <input
          type="text"
          id="bankName"
          value={pagoMovilConfig.bankName}
          onChange={(e) => setPagoMovilConfig({ ...pagoMovilConfig, bankName: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phoneNumber">Número de Teléfono</label>
        <input
          type="text"
          id="phoneNumber"
          value={pagoMovilConfig.phoneNumber}
          onChange={(e) => setPagoMovilConfig({ ...pagoMovilConfig, phoneNumber: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="identificationNumber">Número de Identificación (Cédula/RIF)</label>
        <input
          type="text"
          id="identificationNumber"
          value={pagoMovilConfig.identificationNumber}
          onChange={(e) =>
            setPagoMovilConfig({ ...pagoMovilConfig, identificationNumber: e.target.value })
          }
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-save">
          Guardar Configuración
        </button>
        <button type="button" className="btn-cancel" onClick={() => setIsConfiguring(false)}>
          Cancelar
        </button>
      </div>
    </form>
  );

  // Renderizado de la configuración de PayPal
  const renderPaypalConfig = () => (
    <form onSubmit={savePaypalConfig} className="payment-config-form">
      <h3>Configuración de PayPal</h3>

      <div className="form-group">
        <label htmlFor="clientId">Client ID</label>
        <input
          type="text"
          id="clientId"
          value={paypalConfig.clientId}
          onChange={(e) => setPaypalConfig({ ...paypalConfig, clientId: e.target.value })}
          required
        />
        <small>Encuentra tu Client ID en el Dashboard de desarrollador de PayPal</small>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={paypalConfig.sandbox}
            onChange={(e) => setPaypalConfig({ ...paypalConfig, sandbox: e.target.checked })}
          />
          Modo Sandbox (Pruebas)
        </label>
        <small>Activa esta opción para realizar pruebas sin procesar pagos reales</small>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={paypalConfig.autoReturn}
            onChange={(e) => setPaypalConfig({ ...paypalConfig, autoReturn: e.target.checked })}
          />
          Retorno Automático
        </label>
        <small>Redirige automáticamente al cliente después del pago</small>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-save">
          Guardar Configuración
        </button>
        <button type="button" className="btn-cancel" onClick={() => setIsConfiguring(false)}>
          Cancelar
        </button>
      </div>
    </form>
  );

  // Renderizado de la lista de métodos de pago
  const renderPaymentMethods = () => (
    <div className="payment-methods">
      <h3>Métodos de Pago Disponibles</h3>

      <div className="payment-methods-container">
        <div className="payment-method-card">
          <div className="payment-method-header">
            <div className="payment-method-icon">📱</div>
            <div className="payment-method-name">Pago Móvil</div>
            <div className="payment-method-status active">Activo</div>
          </div>

          <div className="payment-method-details">
            <div className="detail-row">
              <span className="detail-label">Banco:</span>
              <span className="detail-value">{pagoMovilConfig.bankName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Teléfono:</span>
              <span className="detail-value">{pagoMovilConfig.phoneNumber}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Identificación: </span>
              <span className="detail-value"> {pagoMovilConfig.identificationNumber}</span>
            </div>
          </div>

          <div className="payment-method-actions">
            <button
              className="btn-configure"
              onClick={() => {
                setActivePaymentMethod("pagoMovil");
                setIsConfiguring(true);
              }}
            >
              Configurar
            </button>
            <div className="toggle-container12">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={pagoMovilConfig.enabled}
                  onChange={(e) =>
                    setPagoMovilConfig({ ...pagoMovilConfig, enabled: e.target.checked })
                  }
                />
              </label>
            </div>
          </div>
        </div>

        <div className="payment-method-card">
          <div className="payment-method-header">
            <div className="payment-method-icon paypal-icon">💳</div>
            <div className="payment-method-name">PayPal</div>
            <div className="payment-method-status active">Activo</div>
          </div>

          <div className="payment-method-details">
            <div className="detail-row">
              <span className="detail-label">Client ID:</span>
              <span className="detail-value">{paypalConfig.clientId}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Modo:</span>
              <span className="detail-value">
                {paypalConfig.sandbox ? "Sandbox (Pruebas)" : "Producción"}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Retorno Automático:</span>
              <span className="detail-value">
                {paypalConfig.autoReturn ? "Activado" : "Desactivado"}
              </span>
            </div>
          </div>

          <div className="payment-method-actions">
            <button
              className="btn-configure"
              onClick={() => {
                setActivePaymentMethod("paypal");
                setIsConfiguring(true);
              }}
            >
              Configurar
            </button>
            <div className="toggle-container12">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={paypalConfig.enabled}
                  onChange={(e) =>
                    setPaypalConfig({ ...paypalConfig, enabled: e.target.checked })
                  }
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="payment-methods-manager">
      <div className="payment-header">
        <h2>Gestión de Pagos</h2>
      </div>

      <div className="payment-tabs">
        <button
          className={`tab-button ${activeTab === "methods" ? "active" : ""}`}
          onClick={() => setActiveTab("methods")}
        >
          Métodos de Pago
        </button>
      </div>

      <div className="payment-content">
        {isConfiguring
          ? activePaymentMethod === "pagoMovil"
            ? renderPagoMovilConfig()
            : renderPaypalConfig()
          : renderPaymentMethods()}
      </div>
    </div>
  );
};

export default PaymentMethodsManager;