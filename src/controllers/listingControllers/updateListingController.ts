import { Request, Response } from "express";
import http from 'http'
import { prisma } from "../../prisma";

export const updateListing = async (req: Request<{id: string}>, res: Response) => {
    try{
        if(!req.user){
            return res.status(401).json({error: http.STATUS_CODES[401]})
        }
                
        const {id} = req.params
                
        const listings = await prisma.listing.findUnique({
            where: { id }
        });
        if(!listings){
            return res.status(404).json({ error: http.STATUS_CODES[404] });
        }
        if(listings.status !== "ACTIVE"){
            return res.status(404).json({ error: http.STATUS_CODES[404]});
        }
        if(listings?.ownerId !== req.user.userId){
            return res.status(403).json({error: http.STATUS_CODES[403]})
        }
        const updateData = req.body
        const updatedData = await prisma.listing.update({
            where: {
                id: id,
            },
            data:{
                ...updateData,
                updatedAt: new Date()
            }               
        });
        if(!updatedData){
            return res.status(404).json({error: http.STATUS_CODES[404]})
        }
        return res.status(200).json(updatedData);
    }catch(error){
        console.log(error);
        return res.status(500).json({error: http.STATUS_CODES[500]})
    }
}