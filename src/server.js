import Fastify from "fastify"
import fastifyCors from "@fastify/cors"
import userRoutes from "./routes/user"
import projectRoutes from "./routes/project"
import {fastify} from "./websocket/users"
import tasksRoutes from "./routes/task"
const PORT = process.env.PORT ||  3000

fastify.register(fastifyCors, {methods: "*", origin: "*", allowedHeaders: ["Content-Type", "Authorization"] })
fastify.register(userRoutes)
fastify.register(projectRoutes)
fastify.register(tasksRoutes)
function main (){
    try {
        fastify.listen({port:PORT, host: "0.0.0.0"}, (err)=> {
            if(err){
             console.error(err)
            }
            console.log(`Server is running at ${PORT} port`)
        })
    } catch (err) {
        return console.error(err)
    }
}

main()