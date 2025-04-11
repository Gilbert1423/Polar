"use client"

// Actualizar para obtener la página activa del hash de la URL
import { useState, useEffect } from "react"
import "./ReportsPage.css"
import Sidebar from "../../components/Administrador/Sidebar"
import Header from "../../components/Administrador/Header"
import SalesChart from "../../components/Administrador/SalesChart"
import ProductsChart from "../../components/Administrador/ProductsChart"
import CustomersChart from "../../components/Administrador/CustomersChart"

const ReportsPage = () => {
  // Obtener la página activa del hash de la URL
  const [activePage, setActivePage] = useState("reportes")

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") || "productos"
    setActivePage(hash)
  }, [])

  // Estado para el sidebar en móvil
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Estado para el filtro de búsqueda
  const [searchTerm, setSearchTerm] = useState("")

  // Estado para el filtro de período
  const [periodFilter, setPeriodFilter] = useState("month")

  // Datos de ejemplo para los reportes
  const reportData = {
    sales: {
      day: [
        { date: "2023-10-19", sales: 120.5 },
        { date: "2023-10-20", sales: 145.75 },
        { date: "2023-10-21", sales: 165.3 },
        { date: "2023-10-22", sales: 190.25 },
        { date: "2023-10-23", sales: 210.8 },
        { date: "2023-10-24", sales: 180.45 },
        { date: "2023-10-25", sales: 220.6 },
      ],
      week: [
        { date: "Semana 1", sales: 850.75 },
        { date: "Semana 2", sales: 920.3 },
        { date: "Semana 3", sales: 1050.45 },
        { date: "Semana 4", sales: 980.2 },
      ],
      month: [
        { date: "Enero", sales: 3500.25 },
        { date: "Febrero", sales: 3200.5 },
        { date: "Marzo", sales: 3800.75 },
        { date: "Abril", sales: 4100.3 },
        { date: "Mayo", sales: 3900.45 },
        { date: "Junio", sales: 4300.6 },
        { date: "Julio", sales: 4500.25 },
        { date: "Agosto", sales: 4700.8 },
        { date: "Septiembre", sales: 4200.35 },
        { date: "Octubre", sales: 4600.9 },
        { date: "Noviembre", sales: 0 },
        { date: "Diciembre", sales: 0 },
      ],
    },
    topProducts: [
      { name: "Harina P.A.N.", sales: 450, percentage: 25 },
      { name: "Cerveza Polar Pilsen", sales: 380, percentage: 21 },
      { name: "Maltín Polar", sales: 320, percentage: 18 },
      { name: "Pepsi-Cola", sales: 280, percentage: 15 },
      { name: "Detergente Ace", sales: 210, percentage: 12 },
      { name: "Otros", sales: 160, percentage: 9 },
    ],
    customerStats: {
      new: [
        { month: "Ene", count: 12 },
        { month: "Feb", count: 15 },
        { month: "Mar", count: 18 },
        { month: "Abr", count: 22 },
        { month: "May", count: 19 },
        { month: "Jun", count: 25 },
        { month: "Jul", count: 28 },
        { month: "Ago", count: 30 },
        { month: "Sep", count: 26 },
        { month: "Oct", count: 32 },
      ],
      returning: [
        { month: "Ene", count: 8 },
        { month: "Feb", count: 10 },
        { month: "Mar", count: 12 },
        { month: "Abr", count: 15 },
        { month: "May", count: 14 },
        { month: "Jun", count: 18 },
        { month: "Jul", count: 20 },
        { month: "Ago", count: 22 },
        { month: "Sep", count: 19 },
        { month: "Oct", count: 24 },
      ],
    },
  }

  // Función para alternar la visibilidad del sidebar en móvil
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Función para obtener los datos según el período seleccionado
  const getSalesData = () => {
    return reportData.sales[periodFilter]
  }

  // Función para calcular el total de ventas
  const getTotalSales = () => {
    return getSalesData().reduce((total, item) => total + item.sales, 0)
  }

  // Función para calcular el promedio de ventas
  const getAverageSales = () => {
    const data = getSalesData()
    return data.length > 0 ? getTotalSales() / data.length : 0
  }

  // Función para obtener el crecimiento de ventas
  const getSalesGrowth = () => {
    const data = getSalesData()
    if (data.length < 2) return 0

    const currentSales = data[data.length - 1].sales
    const previousSales = data[data.length - 2].sales

    if (previousSales === 0) return 100

    return ((currentSales - previousSales) / previousSales) * 100
  }

  // Función para obtener el total de nuevos clientes
  const getTotalNewCustomers = () => {
    return reportData.customerStats.new.reduce((total, item) => total + item.count, 0)
  }

  return (
    <div className="admin-panel">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} activePage={activePage} />

      <div className="main-content">
        <Header onMenuClick={toggleSidebar} searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <div className="content-wrapper">
          <div className="content-header">
            <h1>Reportes y Estadísticas</h1>
            <div className="period-filter">
              <button
                className={`period-button ${periodFilter === "day" ? "active" : ""}`}
                onClick={() => setPeriodFilter("day")}
              >
                Diario
              </button>
              <button
                className={`period-button ${periodFilter === "week" ? "active" : ""}`}
                onClick={() => setPeriodFilter("week")}
              >
                Semanal
              </button>
              <button
                className={`period-button ${periodFilter === "month" ? "active" : ""}`}
                onClick={() => setPeriodFilter("month")}
              >
                Mensual
              </button>
            </div>
          </div>

          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon sales-icon"></div>
              <div className="stat-info">
                <h3>${getTotalSales().toFixed(2)}</h3>
                <p>Ventas Totales</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon average-icon"></div>
              <div className="stat-info">
                <h3>${getAverageSales().toFixed(2)}</h3>
                <p>Promedio de Ventas</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon growth-icon"></div>
              <div className="stat-info">
                <h3 className={getSalesGrowth() >= 0 ? "positive" : "negative"}>
                  {getSalesGrowth() >= 0 ? "+" : ""}
                  {getSalesGrowth().toFixed(1)}%
                </h3>
                <p>Crecimiento</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon customers-icon"></div>
              <div className="stat-info">
                <h3>{getTotalNewCustomers()}</h3>
                <p>Nuevos Clientes</p>
              </div>
            </div>
          </div>

          <div className="reports-grid">
            <div className="report-card sales-chart">
              <div className="report-header">
                <h3>Ventas</h3>
                <div className="report-actions">
                  <button className="report-action-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Exportar
                  </button>
                </div>
              </div>
              <div className="report-content">
                <SalesChart data={getSalesData()} />
              </div>
            </div>

            <div className="report-card products-chart">
              <div className="report-header">
                <h3>Productos Más Vendidos</h3>
                <div className="report-actions">
                  <button className="report-action-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Exportar
                  </button>
                </div>
              </div>
              <div className="report-content">
                <ProductsChart data={reportData.topProducts} />
              </div>
            </div>

            <div className="report-card customers-chart">
              <div className="report-header">
                <h3>Clientes</h3>
                <div className="report-actions">
                  <button className="report-action-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Exportar
                  </button>
                </div>
              </div>
              <div className="report-content">
                <CustomersChart data={reportData.customerStats} />
              </div>
            </div>

            <div className="report-card top-products-table">
              <div className="report-header">
                <h3>Rendimiento de Productos</h3>
                <div className="report-actions">
                  <button className="report-action-button">
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Exportar
                  </button>
                </div>
              </div>
              <div className="report-content">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Ventas</th>
                      <th>Porcentaje</th>
                      <th>Rendimiento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.topProducts.map(
                      (product, index) =>
                        index < 5 && (
                          <tr key={product.name}>
                            <td>{product.name}</td>
                            <td>${product.sales.toFixed(2)}</td>
                            <td>{product.percentage}%</td>
                            <td>
                              <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${product.percentage}%` }}></div>
                              </div>
                            </td>
                          </tr>
                        ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage

