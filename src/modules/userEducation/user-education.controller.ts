import { Request, Response, NextFunction } from 'express'
import * as EducationService from './user-education.service'
import { BadRequestException } from '../../utils/appError'

export const UserEducationController = {
    /**
     * Update or Add a single education entry
     * PUT /api/user/education
     */
    updateEducation: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user?._id) {
                throw new BadRequestException('User authentication required')
            }
            const userId = req.user._id as string
            const educationData = req.body

            const data = await EducationService.updateUserEducationService(userId, educationData)

            res.status(200).json({
                success: true,
                message: 'Education updated successfully',
                data
            })
        } catch (error) {
            next(error)
        }
    },

    /**
     * Bulk Sync Education (Add/Update multiple)
     * POST /api/user/education/bulk
     */
    bulkUpdateEducation: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user?._id) {
                throw new BadRequestException('User authentication required')
            }
            const userId = req.user._id as string
            const { educations } = req.body // Expects { educations: [...] }

            const data = await EducationService.bulkUpdateUserEducationService(userId, educations)

            res.status(200).json({
                success: true,
                message: 'Education history synced successfully',
                data
            })
        } catch (error) {
            next(error)
        }
    },

    /**
     * Remove a single education entry
     * DELETE /api/user/education/:id
     */
    removeEducation: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user?._id) {
                throw new BadRequestException('User authentication required')
            }
            const userId = req.user._id as string

            // FIX: Change 'id' to 'educationId' to match your route
            const { educationId } = req.params

            if (!educationId) {
                throw new BadRequestException('Education ID is required')
            }

            const data = await EducationService.removeUserEducationService(
                userId.toString(),
                educationId.toString()
            )

            res.status(200).json({
                success: true,
                message: 'Education entry removed',
                data
            })
        } catch (error) {
            next(error)
        }
    },

    /**
     * Bulk Remove education entries
     * DELETE /api/user/education/bulk
     */
    bulkRemoveEducation: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user?._id) {
                throw new BadRequestException('User authentication required')
            }
            const userId = req.user._id as string
            const { educationIds } = req.body // Expects { educationIds: ['id1', 'id2'] }

            const data = await EducationService.bulkRemoveUserEducationService(userId, educationIds)

            res.status(200).json({
                success: true,
                message: 'Selected education entries removed',
                data
            })
        } catch (error) {
            next(error)
        }
    }
}
