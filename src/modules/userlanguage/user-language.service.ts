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
    return await UserLanguageModel.find({ userId }).populate('languageId', 'name logo').lean()
}
