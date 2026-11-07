import { Request, Response, NextFunction, RequestHandler } from "express";
import { Role } from "@prisma/client";
import http from 'http'
export const requireRole = (...allowedRoles:Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if(!req.user){
            return res.status(401).json({error: http.STATUS_CODES[401]})
        }

        if(!allowedRoles.includes(req.user.role as Role)){
            return res.status(403).json({error: http.STATUS_CODES[403]})
        }
        next();
    }
}