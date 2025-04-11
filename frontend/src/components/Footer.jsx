"use client"

import { useState } from "react"


const Footer = () => {
  const [email, setEmail] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la lógica para procesar la suscripción
    alert(`Gracias por suscribirte con: ${email}`)
    setEmail("")
  }

  return (
    <>
    
      <footer className="footer">
        <div className="footer-content">
          {/* Sección principal del footer */}
          <div className="footer-main">
            {/* Columna 1: Logo y descripción */}
            <div className="footer-column">
              <div className="footer-logo">
                <img src="/src/assets/img/logo_polar.png" alt="Logo" />
              </div>
              <p className="footer-description">
                Tu tienda online de confianza para todos tus productos de alimentación, bebidas y artículos de limpieza.
                Calidad garantizada y entrega rápida.
              </p>
              <div className="footer-social">
                <a href="https://www.facebook.com/empresaspolar" className="social-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="https://www.instagram.com/empresaspolar/" className="social-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="social-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
                <a href="#" className="social-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>

            {/* Columna 2: Enlaces de productos */}
            <div className="footer-column">
              <h3 className="footer-heading">Productos</h3>
              <ul className="footer-links">
                <li>
                  <a href="comida">Alimentos</a>
                </li>
                <li>
                  <a href="bebidas-alcoholicas">Bebidas alcohólicas</a>
                </li>
                <li>
                  <a href="bebidas-no-alcoholicas">Bebidas no alcohólicas</a>
                </li>
                <li>
                  <a href="limpieza">Limpieza</a>
                </li>
                {/* <li>
                  <a href="#">Ofertas especiales</a>
                </li>
                <li>
                  <a href="#">Nuevos productos</a>
                </li> */}
              </ul>
            </div>

            {/* Columna 3: Enlaces de la empresa */}
            <div className="footer-column">
              <h3 className="footer-heading">Nuestra empresa</h3>
              <ul className="footer-links">
                <li>
                Sobre nosotros
                  {/* <a href="#">Sobre nosotros</a> */}
                </li>
                <li>
                Nuestras tiendas
                  {/* <a href="#">Nuestras tiendas</a> */}
                </li>
                <li>
                Blog
                  {/* <a href="#">Blog</a> */}
                </li>
                <li>
                Trabaja con nosotros
                  {/* <a href="#">Trabaja con nosotros</a> */}
                </li>
                <li>
                Responsabilidad social
                  {/* <a href="#">Responsabilidad social</a> */}
                </li>
              </ul>
            </div>

            {/* Columna 4: Información de contacto y newsletter */}
            <div className="footer-column">
              <h3 className="footer-heading">Contacto</h3>
              <ul className="footer-contact">
                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="contact-icon"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>Calle Principal 123, Ciudad</span>
                </li>
                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="contact-icon"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>+58 414-103-81-05</span>
                </li>
                <li>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="contact-icon"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>gilbertlucasmero12@gmail.com</span>
                </li>
              </ul>

             
            </div>
          </div>

          {/* Sección inferior del footer */}
          <div className="footer-bottom">
            <div className="footer-copyright">
              &copy; {new Date().getFullYear()} Tu Tienda. Todos los derechos reservados.
            </div>
            <div className="footer-legal">
              <a href="#">Términos y condiciones</a>
              <a href="#">Política de privacidad</a>
              <a href="#">Política de cookies</a>
            </div>
            <div className="footer-payment">
              <span className="payment-icon">💳</span>
              <span className="payment-icon">💳</span>
              <span className="payment-icon">💳</span>
              <span className="payment-icon">💳</span>
            </div>
          </div>
        </div>
      </footer>  
      <div className="infinity">
        <div className="slide-track">
          <div className="infinity1">
            <img src="/src/assets/img/marca1.1.png" alt=""/>
          </div>
          <div className="infinity1">
            <img src="/src/assets/img/marca1.6.png" alt=""/>
          </div>
          <div className="infinity1">
            <img src="/src/assets/img/marca9.png" alt=""/>
          </div>
          <div className="infinity1">
            <img src="/src/assets/img/marca1.5.png" alt=""/>
          </div>
          <div className="infinity1">
            <img src="/src/assets/img/marca13.png" alt=""/>
          </div>
          <div className="infinity1">
            <img src="/src/assets/img/marca1.3.png" alt=""/>
          </div>
          <div className="infinity1">
            <img src="/src/assets/img/marca10.png" alt=""/>
          </div>
          <div className="infinity1">
            <img src="/src/assets/img/marca1.1.png" alt=""/>
          </div>
          <div className="infinity1">
            <img src="/src/assets/img/marca1.6.png" alt=""/>
          </div>
          <div className="infinity1">
            <img src="/src/assets/img/marca9.png" alt=""/>
          </div>
          <div className="infinity1">
            <img src="/src/assets/img/marca1.5.png" alt=""/>
          </div>
          <div className="infinity1">
            <img src="/src/assets/img/marca13.png" alt=""/>
          </div>
          <div className="infinity1">
            <img src="/src/assets/img/marca1.3.png" alt=""/>
          </div>
          <div className="infinity1">
            <img src="/src/assets/img/marca10.png" alt=""/>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer