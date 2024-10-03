import prisma from "../utils/prisma"

const ProjectController = {
    createProject: async(req, res)=>{
        try {
            const {name, userId } = req.body
            const foundUser = await prisma.users.findUnique({where: {id:userId}})
            if(!foundUser){
                return res.status(404).send()
            }
           const newProject =  await prisma.projects.create({
                data:{
                    name: name,
                    participants: {
                        id: foundUser.id,
                        email: foundUser.email,
                        name: foundUser.name,
                        role: "admin"
                    }
                },
            })
            return res.status(200).send({message: "Projeto criado com sucesso"})
        } catch (error) {
            console.error(error)
            return res.status(500).send({message: "Erro interno do servidor"})
        }
    },
    editProject: async(req, res)=> {
        try {
            const {id} = req.body
            const {name, background, logo} = req.body
            await prisma.projects.update({
                where: {
                    id
                },
                data: {
                    name, background, logo
                }
            })
        } catch (error) {
            console.error(error)
            return res.status(500).send()
        }
    },
    getProjectById: async(req, res)=> {
        try {
            const {userId, projectId} = req.params
            const foundProject = await prisma.projects.findFirst({
                where:{
                    id: projectId
                },
                include: {
                    tasks: true
                }
            })
            if(!foundProject){
                return res.status(404).send({message: "Nenhum projeto encontrado"})
            }
            if(!foundProject.participants.find((p)=> p.id === userId)){
                return res.status(401).send({message: "Apenas participantes podem acessar esse projeto"})
            }
            return res.status(200).send(foundProject)
        } catch (error) {
        }
    },
    deleteProject: async(req, res)=>{
        try {
            const {id} = req.params
            const foundProject = await prisma.projects.findUnique({
                where:{
                    id
                }
            })
            if(!foundProject){
                return res.status(404).send({message: "Projeto não encontrado"})
            }
            await prisma.projects.delete({
                where: {
                    id
                }
            })
            
            return res.status(202).send({message: "Projeto excluído com sucesso"})
        } catch (error) {
            
        }
    }
}

export default ProjectController