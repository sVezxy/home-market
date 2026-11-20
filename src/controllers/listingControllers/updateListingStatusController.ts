import { Request, Response } from "express";
import http from 'http'
import { prisma } from "../../prisma";
import { Status } from "@prisma/client";

// Which statuses an admin may move a listing from, per target status.
// HIDDEN (deleted by owner) is never touched by moderation.
const ALLOWED_FROM: Record<"ACTIVE" | "BANNED", Status[]> = {
    ACTIVE: ["PENDING", "BANNED"],
    BANNED: ["PENDING", "ACTIVE"],
};

export const updateListingStatus = async (req: Request<{ id: string }>, res: Response) => {
    try{
        const { id } = req.params;
        const { status } = req.body as { status: "ACTIVE" | "BANNED" };

        // Single conditional update: the status check and the write are atomic
        const { count } = await prisma.listing.updateMany({
            where: {
                id,
                deletedAt: null,
                status: { in: ALLOWED_FROM[status] },
            },
            data: { status },
        });

        if(count === 0){
            const exists = await prisma.listing.count({ where: { id, deletedAt: null } });
            if(exists === 0){
                return res.status(404).json({error: http.STATUS_CODES[404]});
            }
            return res.status(409).json({error: `Listing cannot be moved to ${status} from its current status`});
        }

        const listing = await prisma.listing.findUnique({ where: { id } });
        return res.status(200).json(listing);
    }catch(error){
        console.log(error);
        return res.status(500).json({error: http.STATUS_CODES[500]});
    }
}
