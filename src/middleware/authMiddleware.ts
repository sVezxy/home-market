import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request,res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({error: "No token provided"});
    }
    const token = authHeader.split(" ")[1]
    try{
        const jwtSecret = process.env.JWT_SECRET || process.env.JWT_SECURITY;
        if(!jwtSecret){
            return res.status(500).json({ error: "JWT secret is not configured" });
        }
        const payload = jwt.verify(token, jwtSecret, {algorithms: ["HS256"]});
        req.user = payload as {userId: string, role: string};
        next();
    }catch(error){
        res.status(401).json({error: "Invalid token"});
    }
}