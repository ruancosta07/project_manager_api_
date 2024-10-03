import UserController from "../controllers/User"

export default async function userRoutes (fastify){
    fastify.post("/criar-conta", UserController.createAccount)
    fastify.post("/login", UserController.login)
    fastify.post("/validar-token", UserController.validateTokenUser)
    fastify.post("/login/validar-token", UserController.validateTokenLogin)
    fastify.get("/:id/projetos", UserController.getUserProjects)
}