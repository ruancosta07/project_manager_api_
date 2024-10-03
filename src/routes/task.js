import { TaskController } from "../controllers/Tasks";
import express from "express";
const taskRoutes = express.Router();

taskRoutes.get("/:projectId/tarefas", TaskController.getTasksByProject);
taskRoutes.post("/criar-tarefa", TaskController.createTasks);
taskRoutes.post("/:id/excluir-tarefa", TaskController.deleteTask);

export default taskRoutes;
