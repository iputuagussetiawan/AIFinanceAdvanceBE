import mongoose from 'mongoose'
import UserLanguageModel, { type UserLanguageDocument } from './user-language.model'
import { UserLanguageDTO } from './user-language.validation'

export const syncUserLanguagesService = async (userId: string, languages: UserLanguageDTO[]) => {
    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        // 1. Hapus semua bahasa lama milik user ini
        await UserLanguageModel.deleteMany({ userId }).session(session)

        // 2. Jika ada data baru, masukkan kembali dengan userId yang sesuai
        let result: UserLanguageDocument[] = []
        if (languages.length > 0) {
            const languagesToSave = languages.map((lang) => ({
                ...lang,
                userId
            }))
            result = await UserLanguageModel.insertMany(languagesToSave, { session })
        }

        await session.commitTransaction()
        return result
    } catch (error) {
        await session.abortTransaction()
        throw error
    } finally {
        session.endSession()
    }
}

export const getUserLanguagesService = async (userId: string) => {
    const results = await UserLanguageModel.find({ userId })
        .select('-userId -__v -createdAt -updatedAt') // Hanya ambil field yang diperlukan
        .populate('languageId', 'name')
        .lean()

    // Mapping: Ubah languageId menjadi language
    return results.map((item: any) => {
        const { languageId, ...rest } = item
        return {
            ...rest,
            language: languageId // Rename key di sini
        }
    })
}
