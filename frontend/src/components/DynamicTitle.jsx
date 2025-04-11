import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DynamicTitle = () => {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/login":
        document.title = "Iniciar Sesión";
        break;
      case "/profile":
        document.title = "Perfil";
        break;
      case "/panel-admin":
        document.title = "Panel de Administración";
        break;
      default:
        document.title = "Distribuidora Imperial";
        break;
    }
  }, [location.pathname]);

  return null; // ✅ No renderiza nada, solo cambia el título
};

export default DynamicTitle;