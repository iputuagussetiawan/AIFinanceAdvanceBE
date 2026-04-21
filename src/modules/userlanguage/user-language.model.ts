import mongoose, { Schema, Document, Model } from 'mongoose'
import type { IUserLanguage } from './user-language.validation'

export const userLanguageSchema = new Schema<IUserLanguage>(
    {
        languageId: {
            type: Schema.Types.ObjectId,
            ref: 'Language',
            required: true
        },
        name: { type: String, required: true }, // Keep the name so you don't always have to populate
        proficiency: {
            speaking: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Native'] },
            listening: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Native'] },
            writing: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Native'] },
            jlptLevel: { type: String, enum: ['N1', 'N2', 'N3', 'N4', 'N5'] }
        }
    },
    { _id: false }
)
