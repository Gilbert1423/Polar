"use client"

import { useState, useEffect, useRef } from "react"


const ProductSlider = ({ slides = [], autoPlay = true, interval = 5000 }) => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const autoPlayRef = useRef(null)
    const totalSlides = slides.length

    // Función para avanzar al siguiente slide
    const nextSlide = () => {
      if (isTransitioning || totalSlides <= 1) return

      setIsTransitioning(true)
      setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))

      // Restablecer el estado de transición después de la animación
      setTimeout(() => {
        setIsTransitioning(false)
      }, 500) // Debe coincidir con la duración de la transición CSS
    }

    // Función para retroceder al slide anterior
    const prevSlide = () => {
      if (isTransitioning || totalSlides <= 1) return

      setIsTransitioning(true)
      setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))

      setTimeout(() => {
        setIsTransitioning(false)
      }, 500)
    }

    // Configurar el autoplay
    useEffect(() => {
      if (autoPlay && totalSlides > 1) {
        autoPlayRef.current = setInterval(() => {
          nextSlide()
        }, interval)
      }

      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current)
        }
      }
    }, [autoPlay, interval, isTransitioning, totalSlides])

    // Si no hay slides, no mostrar nada
    if (totalSlides === 0) {
      return null
    }

  return (
    <div className="product-slider">
      <div className="slider-container">
        <div className="slider-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((slide, index) => (
            <div className="product-slide" key={index}>
              <div className="product-image12">
                {slide.badge && <span className="product-badge">{slide.badge}</span>}
                <img src={slide.image || "/placeholder.svg"} alt={slide.title} />
              </div>
              <div className="product-info">
                <h3 className="product-title">{slide.title}</h3>
                <p className="product-description">{slide.description}</p>
                <div className="product-price">
                  {slide.oldPrice && <span className="old-price">${slide.oldPrice}</span>}
                  <span className="current-price">${slide.price}</span>
                </div>
                {/* <button className="product-button">Ver detalles</button> */}
              </div>
            </div>
          ))}
        </div>

        {totalSlides > 1 && (
          <>
            <button className="slider-arrow prev" onClick={prevSlide} aria-label="Anterior">
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
            <button className="slider-arrow next" onClick={nextSlide} aria-label="Siguiente">
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
          </>
        )}
      </div>

      {totalSlides > 1 && (
        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true)
                  setCurrentSlide(index)
                  setTimeout(() => {
                    setIsTransitioning(false)
                  }, 500)
                }
              }}
              aria-label={`Ir al producto ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductSlider

