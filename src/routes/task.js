import { TaskController } from "../controllers/Tasks";
export default async function tasksRoutes(fastify){
    fastify.get("/:projectId/tarefas", TaskController.getTasksByProject)
    fastify.post("/criar-tarefa", TaskController.createTasks)
    fastify.post("/:id/excluir-tarefa", TaskController.deleteTask)
}