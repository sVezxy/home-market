import { z } from 'zod'

export const idParamsSchema = z.object({
    id: z.string().uuid("Invalid user ID format")
})