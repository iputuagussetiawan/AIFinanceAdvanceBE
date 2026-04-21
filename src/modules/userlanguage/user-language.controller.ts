import { Request, Response, NextFunction } from 'express'
import { BadRequestException } from '../../utils/appError'
import {
    bulkUpdateUserLanguagesService,
    removeUserLanguageService,
    updateUserLanguageService
} from './user-languge.service'

/**
 * Handles Add or Update of a language proficiency
 * PUT /api/users/languages
 */
export const upsertUserLanguage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Ensure user exists (Safety check for TypeScript)
        if (!req.user?._id) {
            throw new BadRequestException('User authentication required')
        }

        const userId = req.user._id as string
        const languageData = req.body

        // 2. Basic check for body (if Zod fails or is bypassed)
        if (!languageData.languageId || !languageData.name) {
            throw new BadRequestException('languageId and name are required')
        }

        // 3. Call service to update the embedded array
        const updatedLanguages = await updateUserLanguageService(userId, languageData)

        return res.status(200).json({
            success: true,
            message: 'Language proficiency updated successfully',
            data: updatedLanguages
        })
    } catch (error) {
        next(error)
    }
}

/**
 * Handles Bulk Add or Update of language proficiencies
 * PUT /api/users/languages/bulk
 */
export const bulkUpsertUserLanguages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Get the current user from auth middleware
        if (!req.user?._id) {
            throw new BadRequestException('User authentication required')
        }
        const userId = req.user._id as string

        // 2. Extract the languages array from the body
        // We expect a body format like: { "languages": [...] }
        const { languages } = req.body

        // 3. Validation: Ensure it is actually an array
        if (!languages || !Array.isArray(languages)) {
            throw new BadRequestException('Request body must contain a "languages" array')
        }

        if (languages.length === 0) {
            throw new BadRequestException('Languages array cannot be empty')
        }

        // 4. Call the bulk service
        const updatedLanguages = await bulkUpdateUserLanguagesService(userId, languages)

        // 5. Success Response
        return res.status(200).json({
            success: true,
            message: `${languages.length} languages processed successfully`,
            data: updatedLanguages
        })
    } catch (error) {
        next(error) // Pass to your global error handler
    }
}

/**
 * Removes a specific language from the user's array
 * DELETE /api/users/languages/:languageId
 */
export const removeUserLanguage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?._id) {
            throw new BadRequestException('User authentication required')
        }

        const userId = req.user._id as string
        const languageId = req.params.languageId as string

        const remainingLanguages = await removeUserLanguageService(userId, languageId)

        return res.status(200).json({
            success: true,
            message: 'Language removed from profile successfully',
            data: remainingLanguages
        })
    } catch (error) {
        next(error)
    }
}
