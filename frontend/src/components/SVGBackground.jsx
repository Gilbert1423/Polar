import { useLocation } from "react-router-dom";
import loginSVG from "../assets/svg/login.svg";
import profileSVG from "../assets/svg/profile.svg";
import adminSVG from "../assets/svg/admin.svg";
import homeSVG from "../assets/svg/home.svg";

const SVGBackground = () => {
  const location = useLocation();

  const getSVG = () => {
    switch (location.pathname) {
      case "/login":
        return loginSVG;
      case "/profile":
        return profileSVG;
      case "/panel-admin":
        return adminSVG;
      default:
        return homeSVG; // SVG por defecto
    }
  };

  return (
    <div className="svg-container">
      <img src={getSVG()} alt="Fondo dinámico" className="svg-background" />
    </div>
  );
};

export default SVGBackground;