import UserController from "../controllers/User"
import express from "express"
const userRoutes = express.Router()

    userRoutes.post("/criar-conta", UserController.createAccount)
    userRoutes.post("/login", UserController.login)
    userRoutes.post("/validar-token", UserController.validateTokenUser)
    userRoutes.post("/login/validar-token", UserController.validateTokenLogin)
    userRoutes.get("/:id/projetos", UserController.getUserProjects)

    export default userRoutes