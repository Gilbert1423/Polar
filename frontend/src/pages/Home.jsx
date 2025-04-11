"use client"

import { useState, useEffect, useRef } from "react"
import ProductSlider from "./ProductSlider"


const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0)
  const carouselRef = useRef(null)
  const autoPlayRef = useRef(null)
  const totalSlides = 3

  // Efecto para animaciones de scroll
  useEffect(() => {
    const handleScroll = () => {
      const elementos = document.querySelectorAll(".entrada, .entrada1")
      const mitadPantalla = window.innerHeight / 1.3

      elementos.forEach((elemento) => {
        const posicionElemento = elemento.getBoundingClientRect().top

        if (posicionElemento < mitadPantalla) {
          elemento.style.transform = "translateX(0)"
          elemento.style.opacity = "1"
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    // Ejecutar una vez al cargar para elementos ya visibles
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Configuración del carrusel
  useEffect(() => {
    const startAutoPlay = () => {
      clearInterval(autoPlayRef.current)
      autoPlayRef.current = setInterval(() => {
        nextSlide()
      }, 5000)
    }

    startAutoPlay()

    return () => {
      clearInterval(autoPlayRef.current)
    }
  }, [activeSlide])

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % totalSlides)
    if (carouselRef.current) {
      carouselRef.current.style.setProperty("--calculation", 1)
    }
  }

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
    if (carouselRef.current) {
      carouselRef.current.style.setProperty("--calculation", -1)
    }
  }

  const goToSlide = (index) => {
    setActiveSlide(index)
  }

  // Datos para el slider de productos destacados
  const featuredProducts = [
    {
      image: "/src/assets/img/harina.png",
      title: "Harina P.A.N.",
      description: "La harina de maíz precocida preferida por los venezolanos para preparar las mejores arepas.",
      price: "3.99",
      badge: "Favorito",
    },
    {
      image: "/src/assets/img/cerveza.png",
      title: "Cerveza Polar Pilsen",
      description: "Cerveza tipo pilsen con sabor único y refrescante. Perfecta para cualquier ocasión.",
      price: "1.50",
      oldPrice: "1.99",
      badge: "Oferta",
    },
    {
      image: "/src/assets/img/maltin.jpg",
      title: "Maltín Polar",
      description: "Bebida de malta sin alcohol, nutritiva y refrescante para toda la familia.",
      price: "0.99",
      badge: "Popular",
    },
    {
      image: "/src/assets/img/pepsi.png",
      title: "Pepsi-Cola",
      description: "Refresco con el sabor único de Pepsi que todos conocen y aman.",
      price: "1.25",
      oldPrice: "1.50",
    },
  ]

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="main-title">Distribuidora Imperial</h1>
        <p className="subtitle">Distribuidores oficiales de productos Empresas Polar</p>
      </div>

      {/* Carrusel Mejorado */}
      <section className="carousel" ref={carouselRef}>
        <div className="list">
          <div className={`item ${activeSlide === 0 ? "active" : ""}`}>
            <figure>
              <img src="/src/assets/img/cerveza.png" alt="Promoción especial" />
            </figure>
            <div className="content">
              <p className="category">Promoción Especial</p>
              <h2 className="title">Cerveza Polar Pilsen</h2>
              <p className="description">
                Disfruta de la auténtica cerveza venezolana con un sabor único y refrescante. Ideal para compartir con
                amigos y familia en cualquier ocasión.
              </p>
              <div className="more">
                {/* <button className="primary-btn">Ver Producto</button>
                <button className="secondary-btn">
                  <i className="fa-solid fa-play"></i> Más Información
                </button> */}
              </div>
            </div>
          </div>
          <div className={`item ${activeSlide === 1 ? "active" : ""}`}>
            <figure>
              <img src="/src/assets/img/carrusel2.jpg" alt="Nuevos productos" />
            </figure>
            <div className="content">
              <p className="category">Nuevos Productos</p>
              <h2 className="title">Harina P.A.N. Integral</h2>
              <p className="description">
                Descubre nuestra nueva harina integral, con todos los nutrientes del maíz y el mismo sabor tradicional
                que conoces. Perfecta para arepas más saludables.
              </p>
              <div className="more">
                {/* <button className="primary-btn">Ver Producto</button>
                <button className="secondary-btn">
                  <i className="fa-solid fa-play"></i> Más Información
                </button> */}
              </div>
            </div>
          </div>
          <div className={`item ${activeSlide === 2 ? "active" : ""}`}>
            <figure>
              <img src="/src/assets/img/carrusel3.jpeg" alt="Paquetes especiales" />
            </figure>
            <div className="content">
              <p className="category">Paquetes Especiales</p>
              <h2 className="title">Kit Parrillero</h2>
              <p className="description">
                Todo lo que necesitas para una parrillada perfecta: Cerveza Polar, salsas, condimentos y más. ¡Sorprende
                a tus invitados con el mejor sabor!
              </p>
              <div className="more">
                {/* <button className="primary-btn">Ver Producto</button>
                <button className="secondary-btn">
                  <i className="fa-solid fa-play"></i> Más Información
                </button> */}
              </div>
            </div>
          </div>
        </div>
        <div className="arrows">
          <button id="prev" onClick={prevSlide}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button id="next" onClick={nextSlide}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        <div className="indicators">
          <ul>
            {[0, 1, 2].map((index) => (
              <li key={index} className={activeSlide === index ? "active" : ""} onClick={() => goToSlide(index)}></li>
            ))}
          </ul>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="featured-section">
        <h2 className="section-title">Productos Destacados</h2>
        <ProductSlider slides={featuredProducts} />
      </section>

      {/* Sobre Empresas Polar */}
      <div id="empresasPolar" className="content-section">
        <h2 className="section-title">Empresas Polar</h2>
        <div className="polar-content">
          <div className="polar-text">
            <p>
              Empresas Polar es una corporación industrial venezolana fundada el 14 de marzo de 1941 por Lorenzo
              Alejandro Mendoza Fleury. Inicialmente, la empresa se llamaba Cervecería Polar y se estableció en una
              pequeña planta en Antímano, al oeste de Caracas, produciendo aproximadamente 30,000 litros mensuales de
              cerveza.
            </p>
            <p>
              A lo largo de los años, Empresas Polar ha expandido sus operaciones y diversificado sus productos. En
              1950, abrieron una segunda planta en Barcelona, estado Anzoátegui, y en 1951, una tercera planta en Los
              Cortijos, Caracas. En 1960, se inauguró una planta en Maracaibo, estado Zulia.
            </p>
            <p>
              Además de cerveza, Empresas Polar también produce alimentos y bebidas no alcohólicas. En 1960, lanzaron
              Harina P.A.N., una harina precocida de maíz que se convirtió en un producto icónico en Venezuela. También
              introdujeron Maltín Polar, una bebida no alcohólica, en 1951.
            </p>
          </div>
          <div className="polar-image">
            <img src="/src/assets/img/EmpresasPolar.jpg" alt="Empresas Polar" />
          </div>
        </div>
      </div>

      {/* Sección Sobre Nosotros y Productos */}
      <div id="productos" className="content-section">
        <div className="entrada">
          <h2 className="section-title">Sobre Nosotros</h2>
          <div className="productos">
            <img src="/src/assets/img/empresas-polarnosotros.jpg" alt="Sobre nosotros" />
            <p>
              En nuestra tienda, nos enorgullece ofrecer productos de la reconocida Empresas Polar, una corporación
              industrial venezolana con más de 80 años de trayectoria. Fundada en 1941, Empresas Polar ha sido un pilar
              en la industria de alimentos y bebidas en Venezuela y América Latina.
            </p>
          </div>
        </div>

        <div className="entrada1">
          <h2 className="section-title">Nuestros Productos</h2>
          <div className="productos">
            <div className="productos1">
              <p>Ofrecemos una variedad de productos de alta calidad, incluyendo:</p>
              <ul className="product-list">
                <li>Cervezas: Polar Pilsen, Polar Ice y más.</li>
                <li>Bebidas gaseosas: Pepsi-Cola, 7UP, entre otras marcas.</li>
                <li>Alimentos: Harina P.A.N, Maltín Polar y otros productos.</li>
                <li>Snacks y complementos para todas tus celebraciones.</li>
              </ul>
            </div>
            <img src="/src/assets/img/productos.jpg" alt="Nuestros productos" />
          </div>
        </div>

        <div className="entrada">
          <h2 className="section-title">Conviértete en el Maestro Cervecero de tus Reuniones</h2>
          <div className="productos">
            <img src="/src/assets/img/maestro cervecero.avif" alt="Maestro cervecero" />
            <div className="tip-container">
              <div className="tip">
                <h3>Consejo del experto:</h3>
                <p>
                  Utiliza Cerveza Polar para marinar carnes antes de asarlas. La cerveza ayuda a ablandar la carne y le
                  aporta un sabor único y delicioso.
                </p>
              </div>
              <div className="benefit">
                <h3>Beneficio:</h3>
                <p>
                  Tus invitados quedarán impresionados con tus habilidades culinarias y disfrutarán de carnes más
                  jugosas y sabrosas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Testimonios */}
      <section className="testimonials-section">
        <h2 className="section-title">Lo que dicen nuestros clientes</h2>
        <div className="testimonials-container">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>
                "Distribuidora Imperial siempre tiene los mejores precios y la mejor calidad. Nunca me han fallado con
                mis pedidos."
              </p>
            </div>
            <div className="testimonial-author">
             <img src="../../src/assets/img/default-avatar.png" alt="Cliente" className="testimonial-avatar" />
              <div className="testimonial-info">
                <h4>Carlos Rodríguez</h4>
                <p>Cliente desde 2018</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>
                "Excelente servicio y productos siempre frescos. Recomiendo totalmente a Distribuidora Imperial para
                cualquier evento."
              </p>
            </div>
            <div className="testimonial-author">
             <img src="../../src/assets/img/default-avatar.png" alt="Cliente" className="testimonial-avatar" />
              <div className="testimonial-info">
                <h4>María González</h4>
                <p>Cliente desde 2020</p>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>
                "Siempre encuentro todo lo que necesito para mis reuniones familiares. El servicio a domicilio es rápido
                y eficiente."
              </p>
            </div>
            <div className="testimonial-author">
              <img src="../../src/assets/img/default-avatar.png" alt="Cliente" className="testimonial-avatar" />
              <div className="testimonial-info">
                <h4>José Martínez</h4>
                <p>Cliente desde 2019</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Contacto Rápido */}
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-info1">
            <h2>¿Necesitas hacer un pedido?</h2>
            <p>Contáctanos ahora y te atenderemos de inmediato</p>
          </div>
          <div className="contact-buttons">
            <a href="tel:+58 4141038105" className="contact-button phone">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Llamar ahora
            </a>
            <a href="https://api.whatsapp.com/send?phone=584141038105&text=Gracias%20por%20contactarme%20ah%20distribuidora%20imperial%20en%20que%20le%20puedo%20ayudar%3F" className="contact-button whatsapp">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

