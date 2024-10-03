// utils/socketio.js
import { Server } from "socket.io";
import Fastify from "fastify";
import prisma from "../utils/prisma";

const fastify = Fastify({
});
const server = fastify.server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
  },
});

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

export { io, fastify };
