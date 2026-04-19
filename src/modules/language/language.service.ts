import mongoose from 'mongoose'
import { NotFoundException, ConflictException, BadRequestException } from '../../utils/appError'
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
 * Service to bulk insert multiple master languages
 * Useful for initial setup or migrations
 */
export const bulkCreateLanguageService = async (languages: LanguageDTO[]) => {
    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        // 1. Extract names to check for duplicates in the database
        const names = languages.map((lang) => lang.name)

        // 2. Check if any of these languages already exist
        const existingLanguages = await LanguageModel.find({
            name: { $in: names.map((n) => new RegExp(`^${n}$`, 'i')) }
        }).session(session)

        if (existingLanguages.length > 0) {
            const existingNames = existingLanguages.map((l) => l.name).join(', ')
            throw new ConflictException(`Some languages already exist: ${existingNames}`)
        }

        // 3. Bulk Insert
        // insertMany is more efficient than looping .save()
        const savedLanguages = await LanguageModel.insertMany(languages, { session })

        await session.commitTransaction()

        return {
            data: savedLanguages,
            count: savedLanguages.length
        }
    } catch (error: any) {
        await session.abortTransaction()
        console.error('❌ [TRANSACTION] Bulk language insert aborted:', error.message)
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
/**
 * Fetch all languages with pagination and metadata
 */
export const getLanguagesService = async (query: {
    activeOnly?: boolean
    page?: number
    limit?: number
}) => {
    const { activeOnly = false, page = 1, limit = 10 } = query

    // Menghitung jumlah data yang dilewati
    const skip = (page - 1) * limit

    const filter = activeOnly ? { isActive: true } : {}

    // Menjalankan count dan find secara paralel untuk performa lebih cepat
    const [languages, total] = await Promise.all([
        LanguageModel.find(filter)
            .sort({ orderPosition: 1, name: 1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        LanguageModel.countDocuments(filter)
    ])

    return {
        languages: languages as unknown as LanguageDocument[],
        total,
        page,
        limit
    }
}

/**
 * Fetch a single language by its ID
 */
export const getLanguageByIdService = async (id: string): Promise<LanguageDocument> => {
    // 1. Validasi format ID MongoDB agar tidak menyebabkan crash
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid Language ID format')
    }

    // 2. Cari data berdasarkan ID
    const language = await LanguageModel.findById(id).lean()

    // 3. Jika tidak ditemukan, lempar NotFoundException
    if (!language) {
        throw new NotFoundException('Language record not found')
    }

    return language as unknown as LanguageDocument
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
