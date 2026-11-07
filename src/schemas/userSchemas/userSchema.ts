import { z } from 'zod'

export const idParamsSchema = z.strictObject({
    id: z.string().uuid("Invalid user ID format")
})