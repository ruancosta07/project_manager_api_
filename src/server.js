import Fastify from "fastify"
import {server} from "./websocket/users"
const PORT = process.env.PORT ||  3000

function main (){
    try {
        server.listen({port:PORT, host: "0.0.0.0", }, (err)=> {
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