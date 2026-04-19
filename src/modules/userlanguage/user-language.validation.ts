import * as z from 'zod'

// Definisi level yang konsisten dengan Enum di Database
const ProficiencyLevel = z.enum(['Beginner', 'Intermediate', 'Advanced', 'Native'])
const JLPTLevel = z.enum(['N1', 'N2', 'N3', 'N4', 'N5'])

export const userLanguageValidation = z.object({
    // ID dari Master Data Language
    languageId: z.string().min(1, 'Language ID is required'),

    proficiency: z
        .object({
            speaking: ProficiencyLevel.optional(),
            listening: ProficiencyLevel.optional(),
            writing: ProficiencyLevel.optional(),

            // Khusus untuk sertifikasi Jepang
            jlptLevel: JLPTLevel.optional()
        })
        .refine(
            (data) => {
                // Logika: Harus ada minimal satu nilai yang diisi
                return data.speaking || data.listening || data.writing || data.jlptLevel
            },
            {
                message: 'At least one proficiency level or JLPT level must be provided'
            }
        )
})

export const userLanguageUpdateValidation = userLanguageValidation.partial()

// Untuk Bulk Update (jika user mengupdate semua bahasa sekaligus di profil)
export const userLanguageListValidation = z.object({
    languages: z.array(userLanguageValidation)
})

export type UserLanguageDTO = z.infer<typeof userLanguageValidation>
export type UserLanguageListDTO = z.infer<typeof userLanguageListValidation>
export type UpdateUserLanguageDTO = z.infer<typeof userLanguageUpdateValidation>
