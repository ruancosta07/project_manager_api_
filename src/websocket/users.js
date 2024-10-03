// utils/socketio.js
import { Server } from "socket.io"
import cors from "cors"
import prisma from "../utils/prisma";
import express from "express";
import http from "http"
import userRoutes from "../routes/user";
import taskRoutes from "../routes/task";
import projectRoutes from "../routes/project";
const app = express()
app.use(express.json())
app.use(cors({
  origin: "*",
  methods: "*"
}))
app.use(userRoutes)
app.use(taskRoutes)
app.use(projectRoutes)
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: "*"
  }
})


const Users = new Map();


io.on("connection", (socket) => {
  socket.on("usersOnline", (msg) => {
    const parseUser = msg;
    
    Users.set(socket.handshake.query.userId, { ...parseUser });
    
    socket.emit("usersOnline", Array.from(Users.values()));
    io.emit("usersOnline", Array.from(Users.values()));
  });

  socket.on("disconnect", () => {
    Users.delete(socket.handshake.query.userId);
    
    io.emit("usersOnline", Array.from(Users.values()));
  });

  socket.on("createTask", async (msg)=>{
    const tasks = await prisma.tasks.findMany({where:{projectId: msg}, include:{project: {select: {id:true, name:true}}}})
    io.emit("createTask", tasks)
  })
  socket.on("deleteTask", async (msg)=>{
    const tasks = await prisma.tasks.findMany({where:{projectId: msg}, include:{project: {select: {id:true, name:true}}}})
    io.emit("createTask", tasks)
  })

  socket.on("mousePosition", msg=> {
    io.emit("mousePosition", msg)
  })
})

export { io, server };
