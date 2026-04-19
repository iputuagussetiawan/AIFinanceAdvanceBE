import mongoose, { Schema, Document, Model } from 'mongoose'

export interface UserLanguageDocument extends Document {
    userId: mongoose.Types.ObjectId
    languageId: mongoose.Types.ObjectId // Ref ke Master Data Language
    proficiency: {
        speaking?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native'
        listening?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native'
        writing?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native'
        jlptLevel?: 'N1' | 'N2' | 'N3' | 'N4' | 'N5'
    }
    createdAt: Date
    updatedAt: Date
}

const userLanguageSchema = new Schema<UserLanguageDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            index: true
        },
        languageId: {
            type: Schema.Types.ObjectId,
            ref: 'Language',
            required: [true, 'Language ID is required']
        },
        proficiency: {
            speaking: {
                type: String,
                enum: ['Beginner', 'Intermediate', 'Advanced', 'Native']
            },
            listening: {
                type: String,
                enum: ['Beginner', 'Intermediate', 'Advanced', 'Native']
            },
            writing: {
                type: String,
                enum: ['Beginner', 'Intermediate', 'Advanced', 'Native']
            },
            jlptLevel: {
                type: String,
                enum: ['N1', 'N2', 'N3', 'N4', 'N5']
            }
        }
    },
    {
        timestamps: true
    }
)

// Compound Index: Satu user tidak boleh punya 2 entry untuk bahasa yang sama
userLanguageSchema.index({ userId: 1, languageId: 1 }, { unique: true })

const UserLanguageModel: Model<UserLanguageDocument> =
    mongoose.models.UserLanguage ||
    mongoose.model<UserLanguageDocument>('UserLanguage', userLanguageSchema)

export default UserLanguageModel
