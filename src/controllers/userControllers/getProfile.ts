import { Request, Response } from "express";
import { prisma } from "../../prisma";
import http from 'http'


export const getProfile = async (req: Request, res: Response) => {
    try{
        
        const userId = req.user?.userId

        if(!userId){
            return res.status(401).json({ error: http.STATUS_CODES[401] });
        }

        const userGet = await prisma.user.findUnique({
            where: {
                id: userId
            },select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                telegramUsername: true,
                rate: true,
                createdAt: true,
                Listing: {
                    where: { 
                        deletedAt: null
                     }
                }
            }

        });

        if(!userGet){
            return res.status(404).json({error: http.STATUS_CODES[404]});
        }

        return res.status(200).json({
            user: userGet
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({error: http.STATUS_CODES[500]});
    }
}