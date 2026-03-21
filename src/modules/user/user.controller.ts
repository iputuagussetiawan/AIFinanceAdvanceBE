import { Request, Response } from 'express'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import { getCurrentUserService, updateUserService } from './user.service'
import { HTTPSTATUS } from '../../config/http.config'
import { updateUserSchema } from './user.validation'

export const getCurrentUserController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id
    const { user, role, joinedAt } = await getCurrentUserService(userId)
    return res.status(HTTPSTATUS.OK).json({
        message: 'User fetch successfully',
        user,
        role,
        joinedAt
    })
})

export const updateUserController = asyncHandler(async (req: Request, res: Response) => {
    const body = updateUserSchema.parse(req.body)
    const userId = req.user?._id
    const profilePic = req.file
    const { user, role, joinedAt } = await updateUserService(userId, body, profilePic)
    return res.status(HTTPSTATUS.OK).json({
        message: 'User profile updated successfully',
        user,
        role,
        joinedAt
    })
})
