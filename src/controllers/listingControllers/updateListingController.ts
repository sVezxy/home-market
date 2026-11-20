import { Request, Response } from "express";
import http from 'http'
import { prisma } from "../../prisma";
import { Status } from "@prisma/client";

// BANNED/HIDDEN are excluded on purpose: editing resets status to PENDING,
// so allowing it would let an owner lift a ban just by editing the listing
const EDITABLE_STATUSES: Status[] = ["ACTIVE", "PENDING"];

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
        if(!EDITABLE_STATUSES.includes(listings.status) || listings.deletedAt){
            return res.status(404).json({ error: http.STATUS_CODES[404]});
        }
        if(listings?.ownerId !== req.user.userId){
            return res.status(403).json({error: http.STATUS_CODES[403]})
        }
        const updateData = req.body

        if(updateData.categoryId){
            const categoryExists = await prisma.category.count({
                where: { id: updateData.categoryId }
            });
            if(categoryExists === 0){
                return res.status(404).json({error: "Category not found"})
            }
        }

        // Turning the deposit off must also clear the stored amount
        if(updateData.deposit === false){
            updateData.depositAmount = null;
        }
        const updatedData = await prisma.listing.update({
            where: {
                id: id,
            },
            data:{
                ...updateData,
                updatedAt: new Date(),
                status: "PENDING",
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