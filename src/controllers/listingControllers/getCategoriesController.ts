import { Request, Response } from "express";
import http from "http";
import { prisma } from "../../prisma";

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { typeCategory: "asc" },
    });
    return res.status(200).json({ categories });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: http.STATUS_CODES[500] });
  }
};