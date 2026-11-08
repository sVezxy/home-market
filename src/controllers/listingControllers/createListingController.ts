import { Request, Response } from "express";
import http from 'http'
import { prisma } from "../../prisma";


export const createListings = async (req: Request, res: Response) => {
    try{
        const authorId = req.user?.userId;
        if (!authorId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const {categoryId} = req.body

        const validateId = await prisma.category.count({
            where: {
                id: categoryId
            }
        });

        if(validateId === 0){
            return res.status(404).json({error: http.STATUS_CODES[404]})
        }

        const newListing = await prisma.listing.create({
            data: {
                ...req.body,
                ownerId: authorId,
                status: "ACTIVE",
            },
            include: {
                Category: {
                    select: {
                        typeCategory: true
                    }
                },
            }
        });
        return res.status(201).json(newListing);
    }catch(error){
        console.log(error);
        return res.status(500).json({error: http.STATUS_CODES[500]});
        
    }
}
