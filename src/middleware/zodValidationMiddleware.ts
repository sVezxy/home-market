import { Request, Response, NextFunction, RequestHandler } from "express";
import { flattenError, ZodType } from "zod";

export const zodValidation = (schema: ZodType, source: "body"| "query" | "params" = "body"): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log('Крок 1: Мідлвар');
        const validateZod = schema.safeParse(req[source]);

        if(!validateZod.success){
            return res.status(400).json({
                message: "Validation failed",
                error: flattenError(validateZod.error)
            });
        }

        req[source] = validateZod.data
        next();
    }
}