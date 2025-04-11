"use client"
import { useEffect, useRef } from "react"
import "./Charts.css"

const ProductsChart = ({ data }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(centerX, centerY) - 40

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height)

    // Colores para el gráfico
    const colors = [
      "#4299E1", // Azul
      "#F6AD55", // Naranja
      "#68D391", // Verde
      "#F687B3", // Rosa
      "#B794F4", // Púrpura
      "#CBD5E0", // Gris (para "Otros")
    ]

    // Dibujar el gráfico de pastel
    let startAngle = 0
    const total = data.reduce((sum, item) => sum + item.percentage, 0)

    data.forEach((item, index) => {
      const sliceAngle = (2 * Math.PI * item.percentage) / total

      // Dibujar sector
      ctx.beginPath()
      ctx.fillStyle = colors[index % colors.length]
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()
      ctx.fill()

      // Calcular posición para la etiqueta
      const midAngle = startAngle + sliceAngle / 2
      const labelRadius = radius * 0.7
      const labelX = centerX + labelRadius * Math.cos(midAngle)
      const labelY = centerY + labelRadius * Math.sin(midAngle)

      // Añadir porcentaje si es suficientemente grande
      if (item.percentage >= 8) {
        ctx.fillStyle = "white"
        ctx.font = "bold 12px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`${item.percentage}%`, labelX, labelY)
      }

      startAngle += sliceAngle
    })

    // Dibujar leyenda
    const legendX = width - 150
    const legendY = 40
    const legendItemHeight = 25

    data.forEach((item, index) => {
      const y = legendY + index * legendItemHeight

      // Dibujar cuadrado de color
      ctx.fillStyle = colors[index % colors.length]
      ctx.fillRect(legendX, y, 15, 15)

      // Dibujar texto
      ctx.fillStyle = "#4A5568"
      ctx.font = "12px Arial"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"
      ctx.fillText(`${item.name} (${item.percentage}%)`, legendX + 25, y + 7.5)
    })
  }, [data])

  return (
    <div className="chart-container">
      <canvas ref={canvasRef} width="600" height="300"></canvas>
    </div>
  )
}

export default ProductsChart

