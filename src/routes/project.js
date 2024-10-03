import ProjectController from "../controllers/Project";
export default async function projectRoutes(fastify){
    fastify.post("/criar-projeto", ProjectController.createProject)
    fastify.get("/:userId/:projectId", ProjectController.getProjectById)
    fastify.delete("/:id/excluir-projeto", ProjectController.deleteProject)
}

