import { Request, Response } from "express";
import http from 'http'
import { prisma } from "../../prisma";

// Owner's private view of a listing in any status (needed for editing PENDING listings)
export const getOwnListing = async (req: Request<{ id: string }>, res: Response) => {
    try{
        if(!req.user){
            return res.status(401).json({error: http.STATUS_CODES[401]});
        }
        const { id } = req.params;

        const listing = await prisma.listing.findFirst({
            where: { id, ownerId: req.user.userId, deletedAt: null },
            include: { Category: true }
        });

        if(!listing){
            return res.status(404).json({error: http.STATUS_CODES[404]});
        }
        return res.status(200).json({listing});
    }catch(error){
        console.log(error);
        return res.status(500).json({error: http.STATUS_CODES[500]});
    }
}
