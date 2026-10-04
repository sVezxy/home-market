import { Request, Response } from "express";
import http from 'http'
import { prisma } from "../../prisma";

export const getPage = async (req: Request, res: Response) =>{
    try{
        const { page, limit, search, minPrice, maxPrice}  = req.query as unknown as {page:number,limit:number,search?:string,minPrice?:number,maxPrice?:number};
        const take = Number(limit);
        const skip = Number((page - 1) * limit);
        const whereCond: any = {
            status: "ACTIVE"
        } 
        
        if(search){
            whereCond.OR = [
                { description:{contains: search, mode: "insensitive"}},
                { name:{contains: search, mode: "insensitive"}},
                { street:{contains: search, mode: "insensitive"}}
            ]
        }
        if(minPrice !== undefined || maxPrice !== undefined){
            if(minPrice !== undefined && maxPrice !== undefined && Number(minPrice) > Number(maxPrice)){
                return res.status(400).json({error:"minPrice higher than maxPrice"})
            }
            whereCond.price = {
                ...(maxPrice !== undefined && {lte: Number(maxPrice)}),
                ...(minPrice !== undefined && {gte: Number(minPrice)})
            }
        }

        const[data,total] = await Promise.all([
            prisma.listing.findMany({
                where: whereCond,
                skip: skip,
                take: take,
                orderBy: {createdAt: "desc"},
                include:{
                    Category: true,
                    User: {select:{
                        id:true, name:true, email:true,
                    }}
                }
            }),
            prisma.listing.count({where: whereCond})
        ]);

        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            data,
            meta: {
                page,take,total,totalPages
            }
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({error: http.STATUS_CODES[500]});
    }
}