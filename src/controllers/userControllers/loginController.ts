import { Request, Response } from "express";
import { prisma } from "../../prisma";
import http from 'http'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const DUMMY_HASH = "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

export const loginController = async (req: Request, res: Response) => {
    try{
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        })
        if(!user){
            await bcrypt.compare(password, DUMMY_HASH);
            return res.status(401).json({error: "Invalid credentials"});
        }
        const isPassValid = await bcrypt.compare(password, user.passwordHash);
        if(!isPassValid){
            return res.status(401).json({error: "Invalid credentials"});
        }
        const jwtSecret = process.env.JWT_SECRET || process.env.JWT_SECURITY;
        if (!jwtSecret) {
            console.error("JWT_SECRET is not defined in environment variables");
            return res.status(500).json({ error: "Internal server error" });
        }
        const AccessToken = jwt.sign({userId: user.id, role: user.role}, jwtSecret, { expiresIn: "1d"});    


        return res.status(200).json({AccessToken, user: {userId: user.id, email: user.email, name: user.name, role: user.role}});
    }catch(error){
        console.log(error);
        return res.status(500).json({ error: http.STATUS_CODES[500]});
    }
}