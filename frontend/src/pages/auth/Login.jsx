import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Asegúrate de tener react-router-dom instalado

const Login = () => {
  // Hook para redirecciones
  const navigate = useNavigate();

  // Estado para controlar la vista (login/register)
  const [isActive, setIsActive] = useState(false);

  // Estados para datos de registro (nuevos campos agregados)
  const [registerName, setRegisterName] = useState("");
  const [registerLastname, setRegisterLastname] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerShippingAddress, setRegisterShippingAddress] = useState("");

  // Estados para datos de login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Funciones para alternar entre formularios
  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  // Manejo del submit para el registro
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    // Incluye los nuevos campos en el objeto a enviar
    const data = {
      name: registerName,
      lastname: registerLastname,
      email: registerEmail,
      password: registerPassword,
      phone: registerPhone,
      shippingAddress: registerShippingAddress,
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        window.alert(result.message || "Usuario registrado con éxito");
        // Cambia la vista a login para que el usuario inicie sesión
        setIsActive(false);
        // Limpiar campos de registro
        setRegisterName("");
        setRegisterLastname("");
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterPhone("");
        setRegisterShippingAddress("");
      } else {
        window.alert(result.error || "Error en el registro");
      }
    } catch (error) {
      console.error("Error en register:", error);
      window.alert("Error de red al registrar");
    }
  };

  // Manejo del submit para el login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const data = { email: loginEmail, password: loginPassword };
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      console.log("Respuesta del servidor en login:", result);
  
      if (response.ok && result.user) {
        sessionStorage.setItem("token", result.token);
  
        // ✅ Limpiar el role antes de guardarlo en sessionStorage
        const cleanUser = { ...result.user, role: result.user.role.trim().replace(/\s+/g, '') };
        sessionStorage.setItem("user", JSON.stringify(cleanUser));
  
        console.log("Usuario guardado en sessionStorage:", cleanUser); // ✅ Verifica si el role está limpio
        console.log("Token guardado:", sessionStorage.getItem("token")); // ✅ Revisa si se está guardando bien
        console.log("Usuario guardado:", JSON.parse(sessionStorage.getItem("user"))); // ✅ Verifica si el usuario está guardado correctamente
        
        window.alert(result.message || "Inicio de sesión exitoso");
        navigate("/");
      } else {
        window.alert(result.error || "Error en el login");
      }
    } catch (error) {
      console.error("Error en login:", error);
      window.alert("Error de red al iniciar sesión");
    }
  };



  return (
    <>
      <div className="reinicio">
        <div className="body1">
          <div className={`container_register ${isActive ? "active" : ""}`} id="auth">
            <div className="form-container sign-up">
              <form id="registroForm" onSubmit={handleRegisterSubmit}>
                <h1>Create Account</h1>
                {/* <div className="social-icons">
                  <a href="#" className="icon">
                    <i className="fa-brands fa-google"></i>
                  </a>
                  <a href="#" className="icon">
                    <i className="fa-brands fa-facebook-f"></i>
                  </a>
                  <a href="#" className="icon">
                    <i className="fa-brands fa-github"></i>
                  </a>
                  <a href="#" className="icon">
                    <i className="fa-brands fa-linkedin-in"></i>
                  </a>
                </div> */}
                <span>or use your email for registration</span>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  value={registerLastname}
                  onChange={(e) => setRegisterLastname(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email"
                  id="correoRegistro"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  id="passwordRegistro"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
                <input
                  type="tel"
                  placeholder="Teléfono"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Dirección de Envío"
                  value={registerShippingAddress}
                  onChange={(e) => setRegisterShippingAddress(e.target.value)}
                />
                <button type="submit">Sign Up</button>
              </form>
            </div>
            <div className="form-container sign-in">
              <form id="loginForm" onSubmit={handleLoginSubmit}>
                <h1>Sign in</h1>
                {/* <div className="social-icons">
                  <a href="#" className="icon">
                    <i className="fa-brands fa-google"></i>
                  </a>
                  <a href="#" className="icon">
                    <i className="fa-brands fa-facebook-f"></i>
                  </a>
                  <a href="#" className="icon">
                    <i className="fa-brands fa-github"></i>
                  </a>
                  <a href="#" className="icon">
                    <i className="fa-brands fa-linkedin-in"></i>
                  </a>
                </div> */}
                <span>or use your email password</span>
                <input
                  type="email"
                  placeholder="Email"
                  id="correoLogin"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  id="passwordLogin"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
                <button type="submit">Sign in</button>
              </form>
            </div>
            <div className="toggle-container">
              <div className="toggle">
                <div className="toggle-panel toggle-left">
                  <h1>Welcome Back!</h1>
                  <p>Enter your personal details to use all of site features</p>
                  <button className="hidden" id="login" onClick={handleLoginClick}>
                    Sign IN
                  </button>
                </div>
                <div className="toggle-panel toggle-right">
                  <h1>Hello, Friend!</h1>
                  <p>Register with your personal details to use all of site features</p>
                  <button className="hidden" id="register" onClick={handleRegisterClick}>
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
