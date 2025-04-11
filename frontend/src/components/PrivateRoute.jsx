import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, adminOnly }) => {
  const token = sessionStorage.getItem("token");
  const userData = JSON.parse(sessionStorage.getItem("user"));

  // console.log("Token en PrivateRoute:", token);
  // console.log("Datos del usuario en PrivateRoute:", userData);

  if (!token) {
    window.alert("No tienes sesión iniciada, redirigiendo a login.");
    return <Navigate to="/login" />;
  }

  if (!userData || !userData.role) {
    window.alert("Error: No se encontraron datos de usuario o rol.");
    return <Navigate to="/login" />;
  }

  const userRole = userData.role.trim();
  // console.log("Rol del usuario después de limpiar:", `"${userRole}"`);
  // console.log("adminOnly:", adminOnly);

  if (adminOnly && userRole !== "admin") {
    // console.log("Condición fallida: adminOnly =", adminOnly, ", userRole =", userRole);
    window.alert(`Acceso denegado. Tu rol es: ${userRole}`);
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;