"use client"
import PaymentMethodsManager from "../../components/Administrador/PaymentMethodsManager"
import { Navigate } from "react-router-dom"; // ✅ Importa Navigate

const PaymentMethodsPage = () => {
   const userData = JSON.parse(sessionStorage.getItem("user")); // ✅ Obtener usuario de sesión
    const isAdmin = userData?.role === "admin"; // ✅ Verificar si es administrador
  
    if (!isAdmin) {
      return <Navigate to="/" />; // 🚫 Redirigir usuarios normales al inicio
    }
  return <PaymentMethodsManager />
}

export default PaymentMethodsPage

