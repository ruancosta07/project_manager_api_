import prisma from "../utils/prisma";
import jwt from "jsonwebtoken"
import crypto from "crypto"
import getClientMail from "../utils/nodemailer";
const jwtKey = process.env.JWT_KEY
const UserController = {
    createAccount: async(req,res)=> {
        try{
            const {email, name} = req.body
            const foundUser = await prisma.users.findFirst({where:{email}})
            if(foundUser){
                return res.status(400).send({message: "Email já cadastrado"})
            }
            const newUser = await prisma.users.create({
                data:{
                    email,
                    name
                }
            })
            const token = jwt.sign({
                id: newUser.id,
                email: newUser.email,
                name: newUser.name
            }, jwtKey, {expiresIn: "7d", algorithm: "HS512"})
            return res.status(201).send({message: "Usuário criado com sucesso", ...newUser, token})
        }
        catch (err){
            console.log(err)
            return res.status(500).send()
        }
    },
    login: async(req, res)=> {
        try {
            const {email,} = req.body
            const foundUser = await prisma.users.findFirst({where: {email}})
            if(!foundUser){
                return res.status(400).send({message: "Usuário ou senha incorretos"})
            }
            const buffer = crypto.randomBytes(4);
            const randomNumber = buffer.readUInt32BE(0) % 1000000;
            const token = randomNumber.toString().padStart(6, "0");
            const expiresAt = Date.now() + 15 * 60 * 1000;
           const updatedUser = await prisma.users.update({
                where:{
                    id: foundUser.id
                },
                data:{
                    loginToken: token,
                    loginTokenExpiresAt: expiresAt
                }
            })
            const mail = await getClientMail()
            const message = await mail.sendMail({
                from: { name: "Ruan Costa", address: "ruancosta.ti0805@gmail.com" },
                to: email,
                subject: `Código de verificação única`,
                html: `
              <div style="background-color: #1C1C1C; margin: 0; padding: 32px; font-family: Arial, Helvetica, sans-serif;">
        <div style="max-width: 70%; margin: auto auto 12px auto;">
          <img src="https://dpvbxbfpfnahmtbhcadf.supabase.co/storage/v1/object/public/products_images/game-controller%20(1).svg">
        </div>
              <div style="background-color: #1C1C1C; padding: 1rem; border: 1px solid #36363688; border-radius: 4px; color: #ABABAB; max-width:70%; margin: auto;">
                  <h1 style="margin: 0; color: #fff;">Código de verificação única</h1>
                  <p style="font-size: 1.15rem;">Você está recebendo este email porque solicitou o envio de um código de autenticação. Insira o código
                      abaixo para se autenticar:</p>
                  <p style="text-align: center; font-size: 32px;">${updatedUser.loginToken}</p>
                  <p>Se você não solicitou este email, por favor ignore.</p>
              </div>
          </div>
                `.trim(),
              });
            return res.status(200).send({message: "Email enviado com sucesso"})
        } catch (error) {
            console.log(error)
            return res.status(500).send()
        }
    },
    validateTokenLogin: async(req, res)=> {
        try {
            const {token, email} = req.body
            const foundUser = await prisma.users.findFirst({where:{email}})
            if (!foundUser) {
                return res.status(400).send({ message: "Email inválido" });
              }
              if (foundUser.loginTokenExpiresAt < Date.now()) {
                return res.status(400).send({ message: "Token expirado" });
              }
        
              if (foundUser.loginToken != token) {
                return res.status(400).send({ message: "Token inválido" });
              }
        
              const userToken = jwt.sign(
                { id: foundUser.id, email: foundUser.email, name:foundUser.name },
                jwtKey,
                { expiresIn: "7d", algorithm: "HS512" }
              );
              return res.status(200).send({
                message: "Usuário autenticado com sucesso",
                token: userToken,
                user: {
                  id: foundUser.id,
                  email: foundUser.email,
                  name: foundUser.name,
                },
              });
        } catch (error) {
            console.log(error)
            return res.status(500).send()
        }
    },
    validateTokenUser: async(req, res)=>{
        try{
            const {authorization} = req.headers
            if(!authorization){
                return res.status(401).send()
            }
            const [,token] = authorization.split(" ")
            if(!token){
                return res.status(401).send()
            }
            const decodedToken = jwt.verify(token, jwtKey)
            const foundUser = await prisma.users.findFirst({where: {email:decodedToken.email}})
            if(!foundUser){
                return res.status(401).send()
            }
            return res.status(200).send({user: {email:foundUser.email, id:foundUser.id, name: foundUser.name, avatar: foundUser.avatar}})
        }
        catch(error){
            console.log(error)
        }
    },
    getUserProjects: async(req, res)=> {
        try {
            const {id} = req.params
            const foundUser = await prisma.projects.findMany({where: {
                participants: {
                    some: {
                        id
                    }
                },
            
            }, select: {
                background:true,
                id: true,
                logo: true,
                name: true,
                participants: true,
                tasks: true,

            }})
            if(!foundUser){
                return res.status(404).send({message: "Nenhum usuário encontrado"})
            }
            // if(!foundUser.projects.find((p)=> p.id)){
            //     return res.status(401).send({message: "Usuário não participa desse projeto"})
            // }
            return foundUser
        } catch (error) {
            console.error(error)
            return res.status(500).send()
        }
    }
}

export default UserController