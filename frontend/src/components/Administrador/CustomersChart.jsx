"use client"
import { useEffect, useRef } from "react"
import "./Charts.css"

const CustomersChart = ({ data }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !data) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height
    const padding = 40

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height)

    // Obtener valores máximos para escalar
    const allCounts = [...data.new.map((item) => item.count), ...data.returning.map((item) => item.count)]
    const maxCount = Math.max(...allCounts) * 1.1 // 10% extra para espacio

    // Dibujar ejes
    ctx.beginPath()
    ctx.strokeStyle = "#CBD5E0"
    ctx.lineWidth = 1
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

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
      ctx.fillText((maxCount * (i / numLines)).toFixed(0), padding - 5, y + 3)
    }
    ctx.stroke()
    ctx.setLineDash([])

    // Calcular espaciado para puntos
    const pointSpacing = (width - padding * 2) / (data.new.length - 1)

    // Dibujar línea para nuevos clientes
    ctx.beginPath()
    ctx.strokeStyle = "#4299E1"
    ctx.lineWidth = 2

    data.new.forEach((item, index) => {
      const x = padding + pointSpacing * index
      const y = height - padding - (height - padding * 2) * (item.count / maxCount)

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      // Dibujar puntos
      ctx.fillStyle = "#4299E1"
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()

      // Añadir etiquetas de mes
      if (index === 0 || index === data.new.length - 1 || index % 2 === 0) {
        ctx.fillStyle = "#718096"
        ctx.font = "10px Arial"
        ctx.textAlign = "center"
        ctx.fillText(item.month, x, height - padding + 15)
      }
    })

    ctx.stroke()

    // Dibujar línea para clientes recurrentes
    ctx.beginPath()
    ctx.strokeStyle = "#F6AD55"
    ctx.lineWidth = 2

    data.returning.forEach((item, index) => {
      const x = padding + pointSpacing * index
      const y = height - padding - (height - padding * 2) * (item.count / maxCount)

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      // Dibujar puntos
      ctx.fillStyle = "#F6AD55"
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.stroke()

    // Dibujar leyenda
    const legendX = width - 150
    const legendY = 40

    // Nuevos clientes
    ctx.fillStyle = "#4299E1"
    ctx.beginPath()
    ctx.arc(legendX, legendY, 4, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#4A5568"
    ctx.font = "12px Arial"
    ctx.textAlign = "left"
    ctx.textBaseline = "middle"
    ctx.fillText("Nuevos Clientes", legendX + 10, legendY)

    // Clientes recurrentes
    ctx.fillStyle = "#F6AD55"
    ctx.beginPath()
    ctx.arc(legendX, legendY + 20, 4, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#4A5568"
    ctx.fillText("Clientes Recurrentes", legendX + 10, legendY + 20)
  }, [data])

  return (
    <div className="chart-container">
      <canvas ref={canvasRef} width="600" height="300"></canvas>
    </div>
  )
}

export default CustomersChart

