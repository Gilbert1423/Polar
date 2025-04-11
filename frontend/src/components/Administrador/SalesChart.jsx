"use client"
import { useEffect, useRef } from "react"
import "./Charts.css"

const SalesChart = ({ data }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height
    const padding = 40

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height)

    // Obtener valores máximos para escalar
    const maxSales = Math.max(...data.map((item) => item.sales)) * 1.1 // 10% extra para espacio

    // Dibujar ejes
    ctx.beginPath()
    ctx.strokeStyle = "#CBD5E0"
    ctx.lineWidth = 1
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Calcular espaciado para barras
    const barWidth = ((width - padding * 2) / data.length) * 0.6
    const barSpacing = ((width - padding * 2) / data.length) * 0.4

    // Dibujar líneas de referencia horizontales
    const numLines = 5
    ctx.beginPath()
    ctx.strokeStyle = "#EDF2F7"
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])

    for (let i = 1; i <= numLines; i++) {
      const y = height - padding - (height - padding * 2) * (i / numLines)
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)

      // Añadir etiquetas de valor
      ctx.fillStyle = "#718096"
      ctx.font = "10px Arial"
      ctx.textAlign = "right"
      ctx.fillText((maxSales * (i / numLines)).toFixed(0), padding - 5, y + 3)
    }
    ctx.stroke()
    ctx.setLineDash([])

    // Dibujar barras
    data.forEach((item, index) => {
      const x = padding + ((width - padding * 2) / data.length) * index + barSpacing / 2
      const barHeight = (height - padding * 2) * (item.sales / maxSales)
      const y = height - padding - barHeight

      // Gradiente para las barras
      const gradient = ctx.createLinearGradient(0, y, 0, height - padding)
      gradient.addColorStop(0, "#4299E1")
      gradient.addColorStop(1, "#63B3ED")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0])
      ctx.fill()

      // Añadir etiquetas de fecha
      ctx.fillStyle = "#718096"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText(item.date, x + barWidth / 2, height - padding + 15)

      // Añadir valores sobre las barras
      if (barHeight > 20) {
        ctx.fillStyle = "white"
        ctx.font = "bold 10px Arial"
        ctx.textAlign = "center"
        ctx.fillText("$" + item.sales.toFixed(0), x + barWidth / 2, y + 15)
      }
    })
  }, [data])

  return (
    <div className="chart-container">
      <canvas ref={canvasRef} width="600" height="300"></canvas>
    </div>
  )
}

export default SalesChart

