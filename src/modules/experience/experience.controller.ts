import type { Request, Response } from 'express'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import { HTTPSTATUS } from '../../config/http.config'
import { experienceValidation } from './experience.validation'
import { saveExperienceHistoryService } from './experience.service'
import { BadRequestException } from '../../utils/appError'

export const saveExperienceHistoryController = asyncHandler(async (req: Request, res: Response) => {
    // 1. Validate req.body against the Experience schema
    const body = experienceValidation.parse(req.body)

    // 2. Extract userId and ensure it exists from the auth middleware
    const userId = req.user?._id as string

    if (!userId) {
        throw new BadRequestException('User not authenticated')
    }

    // 3. Call the Experience service
    const { experience } = await saveExperienceHistoryService(userId, body)

    // 4. Return response with 201 Created status
    return res.status(HTTPSTATUS.CREATED).json({
        message: 'Experience record created successfully',
        experience
    })
})
