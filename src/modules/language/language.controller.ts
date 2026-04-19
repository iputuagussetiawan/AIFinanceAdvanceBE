import type { Request, Response } from 'express'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import { HTTPSTATUS } from '../../config/http.config'
import { languageValidation, updateLanguageValidation } from './language.validation'
import {
    createLanguageService,
    updateLanguageService,
    getLanguagesService,
    deleteLanguageService,
    bulkCreateLanguageService,
    getLanguageByIdService
} from './language.service'
import { BadRequestException } from '../../utils/appError'
import z from 'zod'

/**
 * Create a new master language
 */
export const createLanguageController = asyncHandler(async (req: Request, res: Response) => {
    // 1. Validate incoming data
    const body = languageValidation.parse(req.body)

    // 2. Call service (No userId needed for Master Data)
    const language = await createLanguageService(body)

    // 3. Return response
    return res.status(HTTPSTATUS.CREATED).json({
        message: 'Language created successfully',
        data: language
    })
})

export const bulkCreateLanguageController = asyncHandler(async (req: Request, res: Response) => {
    // Validate that req.body is an array of languages
    const validatedData = z.array(languageValidation).parse(req.body)

    const result = await bulkCreateLanguageService(validatedData)

    return res.status(HTTPSTATUS.CREATED).json({
        message: 'Languages bulk inserted successfully',
        ...result
    })
})

/**
 * Update a specific master language
 */
export const updateLanguageController = asyncHandler(async (req: Request, res: Response) => {
    // 1. Validate body (ensure ID and partial fields are correct)
    const validatedData = updateLanguageValidation.parse(req.body)
    // 2. Call update service
    const { id } = req.params as { id: string }

    if (!id) {
        throw new BadRequestException('Language ID is required')
    }
    const updatedLanguage = await updateLanguageService(id, validatedData)

    // 3. Return response
    return res.status(HTTPSTATUS.OK).json({
        message: 'Language updated successfully',
        data: updatedLanguage
    })
})

/**
 * Get all languages (Public or Admin)
 */
export const getLanguagesController = asyncHandler(async (req: Request, res: Response) => {
    // Optional: Filter active only if query param ?active=true exists
    const activeOnly = req.query.active === 'true'

    const languages = await getLanguagesService(activeOnly)

    return res.status(HTTPSTATUS.OK).json({
        message: 'Languages retrieved successfully',
        count: languages.length,
        data: languages
    })
})

/**
 * Get a single language by its ID
 */
export const getLanguageByIdController = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string }

    if (!id) {
        throw new BadRequestException('Language ID is required')
    }

    const language = await getLanguageByIdService(id)

    return res.status(HTTPSTATUS.OK).json({
        message: 'Language retrieved successfully',
        data: language
    })
})

/**
 * Delete a language from master data
 */
export const deleteLanguageController = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string }

    if (!id) {
        throw new BadRequestException('Language ID is required')
    }

    await deleteLanguageService(id)

    return res.status(HTTPSTATUS.OK).json({
        message: 'Language deleted successfully'
    })
})
