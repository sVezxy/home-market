import { Request, Response, NextFunction, RequestHandler } from "express";
import { flattenError, ZodType } from "zod";

export const zodValidation = (schema: ZodType, source: "body"| "query" | "params" = "body"): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const validateZod = schema.safeParse(req[source]);

        if(!validateZod.success){
            return res.status(400).json({
                message: "Validation failed",
                error: flattenError(validateZod.error)
            });
        }
        if (source === "body") {
            req.body = validateZod.data;
        }else if(source === "query"){
            req.validateQuery = validateZod.data;
        }
        else {
            req.params = validateZod.data as any;
        }
        next();
    }
}