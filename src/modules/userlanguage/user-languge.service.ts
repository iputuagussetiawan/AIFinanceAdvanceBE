import { NotFoundException } from '../../utils/appError'
import UserModel from '../user/user.model'
import type { IUserLanguage } from './user-language.validation'

export const updateUserLanguageService = async (userId: string, languageData: IUserLanguage) => {
    // 1. Check if the user exists
    const user = await UserModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    if (!user.languages) {
        user.languages = []
    }

    // 2. Check if the language already exists in the user's array
    const languageIndex = user.languages.findIndex(
        (lang) => lang.languageId.toString() === languageData.languageId.toString()
    )

    if (languageIndex > -1) {
        // UPDATE existing language proficiency
        user.languages[languageIndex] = languageData
    } else {
        // ADD new language to the array
        user.languages.push(languageData)
    }

    await user.save()
    return user.languages
}

/**
 * Bulk Add or Update languages for a user
 */
export const bulkUpdateUserLanguagesService = async (
    userId: string,
    languagesArray: IUserLanguage[]
) => {
    const user = await UserModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    // 1. Initialize if undefined
    if (!user.languages) {
        user.languages = []
    }

    // 2. Use for...of instead of .forEach
    // This allows TypeScript to keep the "not undefined" status
    for (const incomingLang of languagesArray) {
        const index = user.languages.findIndex(
            (existing) => existing.languageId.toString() === incomingLang.languageId.toString()
        )

        if (index > -1) {
            user.languages[index] = incomingLang
        } else {
            user.languages.push(incomingLang)
        }
    }

    await user.save()
    return user.languages
}

/**
 * Service to remove a language from the user
 */
export const removeUserLanguageService = async (userId: string, languageId: string) => {
    const result = await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { languages: { languageId: languageId } } },
        { new: true }
    )
    if (!result) throw new NotFoundException('User not found')
    return result.languages
}
