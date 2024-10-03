import prisma from "../utils/prisma"

export const TaskController = {
    getTasksByProject: async(req, res)=> {
        try {
            const {projectId} = req.params
            const tasks = await prisma.tasks.findMany({where: {projectId}, include:{project: {select: {name:true}}}})
            return res.status(200).send(tasks)
        } catch (error) {
            
        }
    },
    createTasks: async (req, res) => {
        try {
            const { name, status, startsAt, endsAt, projectId, priority } = req.body
    
            // Cria a tarefa já associando ao projeto através de projectId
            const newTask = await prisma.tasks.create({
                data: {
                    name,
                    status,
                    startsAt,
                    endsAt,
                    projectId, 
                    priority
                },
            });
    
            return res.status(200).send({ message: "Tarefa criada com sucesso", newTask });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: "Erro ao criar a tarefa" });
        }
    },
    deleteTask: async(req, res)=> {
        try{
            const {id} = req.params
            const foundTask = await prisma.tasks.findFirst({where: {id}})
            if(!foundTask){
                return res.status(404).send({message: "Tarefa não encontrada"})
            }
            await prisma.tasks.delete({where: {id:foundTask.id}})
            return res.status(202).send({message: "Tarefa excluída com sucesso"})
        }
        catch(error){
            console.log(error)
        }
    }
    
}