import { Request, Response } from "express";
import http from 'http'
import { prisma } from "../../prisma";

export const getListing = async (req: Request<{ id: string }>, res: Response) =>{
    try{
        const {id} = req.params;
        const listing = await prisma.listing.findUnique({
            where: {id: id},
            include:{
                Category: true,
                User:{
                    select:{
                        id: true,
                        name: true,
                        phone: true,
                        telegramUsername: true,
                    }
                }
            }
        });

        if(!listing){
            return res.status(404).json({error: "Requested listing is not found"})
        }
        if(listing.status !== "ACTIVE"){
            return res.status(404).json({ error: http.STATUS_CODES[404]});
        }

        return res.status(200).json({listing})
    }catch(error){
        console.log(error);
        return res.status(500).json({error: http.STATUS_CODES[500]});
    }
}