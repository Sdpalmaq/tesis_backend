import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import morgan from "morgan";
import { wss } from './server.js';

const app = express();

app.use((req, res, next) => {
    req.wss = wss; // Agregar la instancia del WebSocket Server a cada request
    next();
});


import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import vehiculoRoutes from "./routes/vehiculos.routes.js";
import huellasRouetes from "./routes/huellasDactilares.routes.js";
import configSistemRoutes from "./routes/configuracionesSistema.routes.js";
import registroAccesoRoutes from "./routes/registrosAcceso.routes.js";
import wifiRoutes from "./routes/wifi.routes.js";
import arranque_forzoso from "./routes/arranque_forzoso.routes.js";
import restaurarSistema from "./routes/restaurarSistema.routes.js";
import notificaciones from "./routes/notificaciones.routes.js";



// Error Handling Middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Error interno del servidor";
  console.error(`[${req.method}] ${req.url} - Error: ${message}`);
  res.status(status).json({ error: message });
});

// Middlewares
app.use(
  cors({
    origin: "https://tesis-frontend-nine.vercel.app/" || "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(morgan("combined")); // Logs detallados

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vehiculos", vehiculoRoutes);
app.use("/api/huellas-dactilares", huellasRouetes);
app.use("/api/configuraciones-sistema", configSistemRoutes);
app.use("/api/registros-acceso", registroAccesoRoutes);
app.use("/api/wifi", wifiRoutes);
app.use("/api/forzar-arranque", arranque_forzoso);
app.use("/api/sistema", restaurarSistema);
app.use("/api/notificaciones", notificaciones);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});


export default app;
