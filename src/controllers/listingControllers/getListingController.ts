import { Request, Response } from "express";
import http from 'http'
import { prisma } from "../../prisma";

export const getListings = async (req: Request, res: Response) =>{
    try{
        const { page, limit} = req.query as unknown as {page: number, limit: number};
        const skip = (page - 1) * limit;
        const take = limit;

        const[data,total] = await Promise.all([
            prisma.listing.findMany({
                where: {status: "ACTIVE"},
                skip: skip,
                take: limit,
                orderBy: {createdAt: "desc"},
                include:{
                    Category: true,
                    User: {select:{
                        id:true, name:true, email:true,
                    }}
                }
            }),
            prisma.listing.count({where: {status: "ACTIVE"}})
        ]);

        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            data,
            meta: {
                page,limit,total,totalPages
            }
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({message: "Internal sever error"});
    }
}