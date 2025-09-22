// index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import connectionDb from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import proyectsRoutes from "./routes/proyectsRoutes.js";
import toDoRoutes from "./routes/toDoRoutes.js";

dotenv.config();

// ---------------------------
// Configuración inicial
// ---------------------------
const app = express();
app.use(express.json());

// Conexión a la base de datos
connectionDb();

// ---------------------------
// CORS
// ---------------------------
const allowedOrigins = [
  process.env.FRONTEND_URL,   // Producción
  "http://localhost:5173"     // Desarrollo local
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Permite Postman o requests server-side
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS bloqueado:", origin);
      callback(new Error("Error de CORS"));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

// ---------------------------
// Rutas
// ---------------------------
app.use("/api/user", userRoutes);
app.use("/api/proyects", proyectsRoutes);
app.use("/api/todos", toDoRoutes);

// ---------------------------
// Levantar servidor
// ---------------------------
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`🚀 API run on port: ${PORT}`);
});

// ---------------------------
// Socket.io
// ---------------------------
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);

  // Unirse a un proyecto
  socket.on("open-project", (project) => {
    socket.join(project);
  });

  // Eventos de todos
  socket.on("new-todo", (todo) => {
    const project = todo.proyect;
    socket.to(project).emit("agree-todo", todo);
  });

  socket.on("delete-todo", (todo) => {
    const project = todo.proyect;
    socket.to(project).emit("deleted-todo", todo);
  });

  socket.on("edit-todo", (todo) => {
    const project = todo.proyect._id;
    socket.to(project).emit("edited-todo", todo);
  });

  socket.on("complete-todo", (todo) => {
    const project = todo.proyect._id;
    socket.to(project).emit("completed-todo", todo);
  });
});
