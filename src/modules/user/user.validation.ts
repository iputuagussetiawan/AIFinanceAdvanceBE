import { z } from 'zod'

// --- Reusable Base Schemas ---
export const nameSchema = z.string().trim().min(1, { message: 'Name is required' }).max(100)

export const userObject = z.object({
    name: nameSchema,
    bio: z
        .string()
        .max(260, 'Bio must be less than 160 characters') // Standard Twitter-length limit
        .trim()
        .optional()
        .or(z.literal('')) // Allows empty string in addition to undefined
})

// For updates, we use .partial() so you don't have to send every field
export const updateUserSchema = userObject.partial()

// Extract the type from the schema
export type UpdateUserInputType = z.infer<typeof updateUserSchema>
