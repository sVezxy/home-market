import { Request, Response } from "express";
import { prisma } from "../../prisma";
import http from 'http'

export const getProfileById = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;

        if(!id){
            return res.status(400).json({error: http.STATUS_CODES[400]});
        }

        const foundUser = await prisma.user.findUnique({
            where: {
                id: id as string
            },select: {
                id: true,
                name: true,
                rate: true,       
                createdAt: true,
                Listing: {
                    where: {
                        deletedAt: null,
                        status: "ACTIVE"
                    }
                }
            }
        })

        if(!foundUser){
            return res.status(404).json({error: http.STATUS_CODES[404]});
        }

        return res.status(200).json({foundUser, message: "User was found"});
    }catch(error){
        console.log(error);
        return res.status(500).json({error: http.STATUS_CODES[500]});

    }
}