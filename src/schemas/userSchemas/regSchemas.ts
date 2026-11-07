import { custom, z } from 'zod'

export const regSchema = z.strictObject({
    name: z.string({
        error: (issue) => issue.input === undefined ? "Required field" : "Invalid"
    }),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8, "Mininmum 8 characters").max(64, "Maximum 64 characters"),
    phone: z.e164().optional(),
    telegramNick: z.string().trim().regex(/^@?[a-zA-Z0-9_]{5,32}$/, "Invalid telegram username").optional()
}).superRefine((data, ctx) => {
    if(data.phone === undefined && data.telegramNick === undefined){
        const message: string = "Must be atleast one contact: phone or telegram nickname"
        ctx.addIssue({code: "custom", message, path: ["phone"]})
        ctx.addIssue({code: "custom", message, path: ["telegramNick"]})
    }

})