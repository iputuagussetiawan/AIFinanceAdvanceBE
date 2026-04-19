import { Request, Response } from 'express'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import { HTTPSTATUS } from '../../config/http.config'
import { userLanguageListValidation } from './user-language.validation'
import { syncUserLanguagesService, getUserLanguagesService } from './user-language.service'
import { BadRequestException } from '../../utils/appError'

export const syncUserLanguagesController = asyncHandler(async (req: Request, res: Response) => {
    // 1. Validasi array bahasa dari req.body
    const validatedData = userLanguageListValidation.parse(req.body)

    const userId = req.user?._id as string
    if (!userId) throw new BadRequestException('User not authenticated')

    // 2. Jalankan service sync
    const data = await syncUserLanguagesService(userId, validatedData.languages)

    return res.status(HTTPSTATUS.OK).json({
        status: 'success',
        message: 'Profile languages updated successfully',
        data
    })
})

export const getUserLanguagesController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id as string

    const languages = await getUserLanguagesService(userId)

    return res.status(HTTPSTATUS.OK).json({
        status: 'success',
        message: 'User languages retrieved successfully',
        data: languages,
        meta: { total: languages.length }
    })
})
