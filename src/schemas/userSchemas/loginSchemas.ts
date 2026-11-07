import { z } from "zod"

export const loginScheme = z.strictObject({
    email: z.string().trim().toLowerCase().max(254).email(),
    password: z.string().min(8).max(64)
})

