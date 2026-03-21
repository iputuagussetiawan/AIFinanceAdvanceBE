import type { Request, Response } from 'express'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import { HTTPSTATUS } from '../../config/http.config'
import { educationValidation } from './education.validation'
import { saveEducationHistoryService } from './education.service'
import { BadRequestException } from '../../utils/appError'

export const saveEducationHistoryController = asyncHandler(async (req: Request, res: Response) => {
    // 1. Validate req.body as a single object (Removed z.array)
    const body = educationValidation.parse(req.body)

    // 2. Extract userId and ensure it exists
    const userId = req.user?._id as string

    if (!userId) {
        throw new BadRequestException('User not authenticated')
    }

    // 3. Call the service (Now passing a single object)
    const { education } = await saveEducationHistoryService(userId, body)

    // 4. Return response
    return res.status(HTTPSTATUS.CREATED).json({
        message: 'Education record created successfully',
        education
    })
})
