import type mongoose from 'mongoose'

export interface IUserLanguage {
    // Diubah dari languageId menjadi language
    language: mongoose.Types.ObjectId | string

    // Field 'name' telah dihapus sesuai permintaan

    proficiency: {
        speaking?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native'
        listening?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native'
        writing?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native'
        jlptLevel?: 'N1' | 'N2' | 'N3' | 'N4' | 'N5' | null
    }
}
