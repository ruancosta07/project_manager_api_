import ProjectController from "../controllers/Project";
import {Router} from "express"
const projectRoutes = Router()
    projectRoutes.post("/criar-projeto", ProjectController.createProject)
    projectRoutes.get("/:userId/:projectId", ProjectController.getProjectById)
    projectRoutes.delete("/:id/excluir-projeto", ProjectController.deleteProject)


export default projectRoutes