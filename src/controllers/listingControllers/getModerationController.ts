import { Request, Response } from "express";
import http from 'http'
import { prisma } from "../../prisma";
import { z } from "zod";
import { ListingsQuerySchema } from "../../schemas/listingSchemas/listingSchemas";
type ListingsQuery = z.infer<typeof ListingsQuerySchema>

// ADMIN only: queue of listings waiting for moderation (oldest first)
export const getModerationPage = async (req: Request, res: Response) => {
    try{
        const { page, limit, categoryId } = req.validateQuery as ListingsQuery;
        const whereCond = {
            status: "PENDING" as const,
            deletedAt: null,
            ...(categoryId && { categoryId }),
        };

        const [data, total] = await Promise.all([
            prisma.listing.findMany({
                where: whereCond,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { updatedAt: "asc" },
                include: {
                    Category: true,
                    User: { select: { id: true, name: true, email: true } }
                }
            }),
            prisma.listing.count({ where: whereCond })
        ]);

        return res.status(200).json({
            data,
            meta: { page, take: limit, total, totalPages: Math.ceil(total / limit) }
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({error: http.STATUS_CODES[500]});
    }
}
