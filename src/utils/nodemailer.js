import nodemailer from "nodemailer"

export default async function getClientMail(){
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth:{
            
            user: "ruancosta.ti0805@gmail.com",
            pass: process.env.EMAIL_KEY
        }
    })
    return transporter
}