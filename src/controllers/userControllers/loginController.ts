import { Request, Response } from "express";
import { prisma } from "../../prisma";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const loginController = async (req: Request, res: Response) => {
    try{
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        })
        if(!user){
            const isPassValid = await bcrypt.compare(password,"$2b$10$1233430123234789012");
            return res.status(401).json({error: "Invalid credentials"});
        }
        const isPassValid = await bcrypt.compare(password, user.passwordHash);
        if(!isPassValid){
            return res.status(401).json({error: "Invalid credentials"});
        }
        const AccessToken = jwt.sign({userId: user.id, role: user.role}, process.env.JWT_SECRET!, { expiresIn: "1d"});    


        return res.status(200).json({AccessToken, user: {userId: user.id, email: user.email, name: user.name, role: user.role}});
    }catch(error){
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}