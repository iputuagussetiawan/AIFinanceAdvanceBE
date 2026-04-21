import mongoose from 'mongoose'
import { NotFoundException, ConflictException, BadRequestException } from '../../utils/appError'
import type { LanguageDTO, UpdateLanguageDTO } from './language.validation'
import LanguageModel, { type LanguageDocument } from './language.model'
import { FilterQuery } from 'mongoose'

export interface PaginationResponse {
    data: LanguageDocument[]
    meta: {
        totalData: number
        totalPage: number
        currentPage: number
        limit: number
    }
}

export const getLanguagesPaginatedService = async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    isActive?: boolean
) => {
    if (page < 1 || limit < 1) {
        throw new BadRequestException('Page and limit must be greater than 0')
    }

    const query: FilterQuery<LanguageDocument> = {}

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ]
    }

    if (typeof isActive === 'boolean') {
        query.isActive = isActive
    }

    const skip = (page - 1) * limit

    const [data, totalData] = await Promise.all([
        LanguageModel.find(query)
            .sort({ orderPosition: 1, name: 1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        LanguageModel.countDocuments(query)
    ])

    return {
        data,
        meta: {
            totalData,
            totalPage: Math.ceil(totalData / limit),
            currentPage: page,
            limit
        }
    }
}

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
export const updateLanguageService = async (id: string, body: UpdateLanguageDTO) => {
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
