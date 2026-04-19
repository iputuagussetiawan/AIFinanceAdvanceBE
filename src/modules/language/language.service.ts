import mongoose from 'mongoose'
import { NotFoundException, ConflictException } from '../../utils/appError'
import type { LanguageDTO } from './language.validation'
import LanguageModel, { type LanguageDocument } from './language.model'

/**
 * Create a new master language entry
 */
export const createLanguageService = async (body: LanguageDTO) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        const language = new LanguageModel(body)
        await language.save({ session })

        await session.commitTransaction()
        return language
    } catch (error: any) {
        await session.abortTransaction()
        console.error('❌ [TRANSACTION] Language creation failed:', error.message)
        throw error
    } finally {
        session.endSession()
    }
}

/**
 * Update a language entry by its ID
 */
export const updateLanguageService = async (id: string, body: Partial<LanguageDTO>) => {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid Language ID format')
    }

    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        const updatedLanguage = await LanguageModel.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, session, runValidators: true }
        )

        if (!updatedLanguage) {
            throw new NotFoundException('Language not found')
        }

        await session.commitTransaction()
        return updatedLanguage
    } catch (error: any) {
        await session.abortTransaction()
        throw error
    } finally {
        session.endSession()
    }
}

/**
 * Fetch languages for the application
 * @param activeOnly - If true, only returns languages where isActive is true
 */
export const getLanguagesService = async (activeOnly = false): Promise<LanguageDocument[]> => {
    const query = activeOnly ? { isActive: true } : {}

    return (await LanguageModel.find(query)
        .sort({ orderPosition: 1, name: 1 })
        .lean()) as unknown as LanguageDocument[]
}

/**
 * Delete a language from master data
 */
export const deleteLanguageService = async (id: string) => {
    const result = await LanguageModel.findByIdAndDelete(id)

    if (!result) {
        throw new NotFoundException('Language not found')
    }

    return { success: true }
}
