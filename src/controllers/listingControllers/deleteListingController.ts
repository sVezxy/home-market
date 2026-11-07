import { Request, Response } from "express";
import http from 'http'
import { prisma } from "../../prisma";

export const deleteListing = async (req: Request<{id: string}>, res: Response) => {
    try{
        if(!req.user){
            return res.status(401).json({error: http.STATUS_CODES[401]})
        }
        
        const {id} = req.params
        
        const listing = await prisma.listing.findUnique({
            where: { id }
        });
        if(!listing){
            return res.status(404).json({error: "Requested listing is not found"})
        }
        if(listing.status !== "ACTIVE"){
            return res.status(404).json({ error: http.STATUS_CODES[404]});
        }
        if(listing?.ownerId !== req.user!.userId){
            return res.status(403).json({error: http.STATUS_CODES[403]})
        }
        const deletedListing = await prisma.listing.update({
            where: {
                id: id,
            },
            data: {
                status: "HIDDEN",
                deletedAt: new Date()
            },
        });
        if(!deletedListing){
            return res.status(404).json({error: http.STATUS_CODES[404]})
        }
        return res.status(200).json(deletedListing);
    }catch(error){
        console.log(error);
        return res.status(500).json({error: http.STATUS_CODES[500]})
    }
}