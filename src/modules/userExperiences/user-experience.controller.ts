import { Request, Response, NextFunction } from 'express'
import * as ExperienceService from './user-experience.service'
import { BadRequestException } from '../../utils/appError'

export const UserExperienceController = {
    updateExperience: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user?._id) {
                throw new BadRequestException('User authentication required')
            }
            const userId = req.user._id as string
            const data = await ExperienceService.updateUserExperienceService(
                userId.toString(),
                req.body
            )
            res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    },

    bulkUpdateExperience: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user?._id) {
                throw new BadRequestException('User authentication required')
            }
            const userId = req.user._id as string
            const data = await ExperienceService.bulkUpdateUserExperienceService(
                userId.toString(),
                req.body.experiences
            )
            res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    },

    removeExperience: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user?._id) {
                throw new BadRequestException('User authentication required')
            }
            const userId = req.user._id as string
            const { experienceId } = req.params
            const data = await ExperienceService.removeUserExperienceService(
                userId.toString(),
                experienceId.toString()
            )
            res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    },

    bulkRemoveExperience: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user?._id) {
                throw new BadRequestException('User authentication required')
            }
            const userId = req.user._id as string

            // FIXED: Changed from educationIds to experienceIds
            const { experienceIds } = req.body

            if (!Array.isArray(experienceIds)) {
                throw new BadRequestException('experienceIds must be an array')
            }

            // FIXED: Now calling ExperienceService instead of EducationService
            const data = await ExperienceService.bulkRemoveUserExperienceService(
                userId,
                experienceIds
            )

            res.status(200).json({
                success: true,
                message: 'Selected experience entries removed',
                data
            })
        } catch (error) {
            next(error)
        }
    }
}
