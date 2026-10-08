import { Request, Response } from "express";
import  {prisma}  from "../../prisma";
import { Prisma } from '@prisma/client';
import  bcrypt  from 'bcrypt';
import http from 'http'

export const regController = async (req: Request, res: Response) => {
    try{

        const {name, email, password, phone, telegramNick} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                passwordHash: passwordHash,
                phone: phone,
                telegramUsername: telegramNick
            },
            select: {
                id: true,
                email: true,
                name: true
            }
        })

        return res.status(201).json(newUser);
    }catch(error){
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            const field = (error.meta?.target as string[])?.[0] ?? 'field';
            return res.status(409).json({ error: `User with that ${field} exists` });
         }

        console.log(error);
        return res.status(500).json({error: http.STATUS_CODES[500]});
    }
}