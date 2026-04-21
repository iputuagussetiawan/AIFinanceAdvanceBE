import type mongoose from 'mongoose'

export interface IUserLanguage {
    languageId: mongoose.Types.ObjectId // Reference to Language Master Data
    name: string // Redundant but helpful for quick display (Denormalization)
    proficiency: {
        speaking?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native'
        listening?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native'
        writing?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native'
        jlptLevel?: 'N1' | 'N2' | 'N3' | 'N4' | 'N5'
    }
}
