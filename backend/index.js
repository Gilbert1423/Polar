const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path')

require("dotenv").config(); // ✅ Esto hará que `process.env.JWT_SECRET` esté disponible en todo el proyecto
console.log("🛠️ JWT_SECRET cargado en el backend:", process.env.JWT_SECRET);

// Configuración básica que permite todas las solicitudes
app.use(cors({
  origin: process.env.ORIGIN, // Leer el origen desde el archivo .env
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
  credentials: true, // Permitir envío de cookies o credenciales
}));
app.use(express.json());
app.options("*", cors()); // Permitir solicitudes preflight para todas las rutas

// O, si deseas permitir solo solicitudes desde tu frontend
// app.use(cors({ origin: 'http://localhost:5173' }));

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Rutas
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
// perfil
const profileRoutes = require('./routes/profileRoutes');
app.use('/api/profile', profileRoutes);

const adminRoutes = require('./routes/adminRoutes'); // Rutas administrativas
app.use('/api/admin', adminRoutes);

// Importar rutas de productos
const productsRoutes = require('./routes/productsRoutes'); 
app.use('/api/products', productsRoutes);

const categoriesRoutes = require('./routes/categoriesRoutes');
app.use('/api/categories', categoriesRoutes);

const morgan = require('morgan');
app.use(morgan('dev')); // Para mostrar los logs en consola en formato dev

const usersRoutes = require('./routes/users');
app.use('/api/users', usersRoutes);

const ordersRoutes = require("./routes/ordersRoutes");
app.use("/api/orders", ordersRoutes);

const shopRoutes = require("./routes/shop");
app.use("/api/shop", shopRoutes);


const mobilePaymentRoutes = require("./routes/MobilePaymentRoutes");
app.use("/api/payments/mobile", mobilePaymentRoutes);

app.use(express.static("public"));



const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
