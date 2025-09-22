import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectionDb from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import proyectsRoutes from './routes/proyectsRoutes.js';
import toDoRoutes from './routes/toDoRoutes.js';

const app = express();
app.use(express.json());

dotenv.config();
connectionDb();

//CORS

const whiteList = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.includes(origin)) {
      //puede consutlar la API
      callback(null, true);
    } else {
      //no puede consultar la API
      callback(new Error('Error de CORS'));
    }
  }
};

app.use(cors(corsOptions));

//Routing
app.use('/api/user', userRoutes);
app.use('/api/proyects', proyectsRoutes);
app.use('/api/todos', toDoRoutes);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`api run on port: ${PORT}`);
});

//socket.io

import { Server } from 'socket.io';
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL
  }
});

io.on('connection', (socket) => {
  // console.log('a user connected');

  socket.on('open-project', (project) => {
    socket.join(project);
  });

  socket.on('new-todo', (todo) => {
    const project = todo.proyect;
    socket.to(project).emit('agree-todo', todo);
  });
  socket.on('delete-todo', (todo) => {
    const project = todo.proyect;
    socket.to(project).emit('deleted-todo', todo);
  })
  socket.on('edit-todo', (todo)=>{
    const project = todo.proyect._id;
    socket.to(project).emit('edited-todo', todo);
  })
  socket.on('complete-todo', (todo)=>{
    const project = todo.proyect._id;
    socket.to(project).emit('completed-todo', todo);
  })
});
