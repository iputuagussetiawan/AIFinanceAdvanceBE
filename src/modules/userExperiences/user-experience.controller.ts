import { Request, Response, NextFunction } from 'express'
import * as ExperienceService from './user-experience.service'
import { BadRequestException } from '../../utils/appError'

export const UserExperienceController = {
    updateExperience: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user?._id) {
                throw new BadRequestException('User authentication required')
            }
            const data = await ExperienceService.updateUserExperienceService(
                req.user._id.toString(),
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

            const { experiences } = req.body
            if (!Array.isArray(experiences) || experiences.length === 0) {
                throw new BadRequestException('experiences must be a non-empty array')
            }

            const data = await ExperienceService.bulkUpdateUserExperienceService(
                req.user._id.toString(),
                experiences
            )
            res.status(200).json({ success: true, data })
        } catch (error) {
            next(error)
        }
    }

    // removeExperience: async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const userId = getUserId(req)

    //         const { experienceId } = req.params
    //         if (!experienceId) throw new BadRequestException('experienceId is required')

    //         const data = await ExperienceService.removeUserExperienceService(userId, experienceId)
    //         res.status(200).json({ success: true, data })
    //     } catch (error) {
    //         next(error)
    //     }
    // },

    // bulkRemoveExperience: async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         if (!req.user?._id) {
    //             throw new BadRequestException('User authentication required')
    //         }

    //         const { experienceIds } = req.body
    //         if (!Array.isArray(experienceIds) || experienceIds.length === 0) {
    //             throw new BadRequestException('experienceIds must be a non-empty array')
    //         }

    //         const data = await ExperienceService.bulkRemoveUserExperienceService(
    //             req.user._id.toString(),
    //             experienceIds,
    //         )
    //         res.status(200).json({
    //             success: true,
    //             message: 'Selected experience entries removed',
    //             data,
    //         })
    //     } catch (error) {
    //         next(error)
    //     }
    // },
}
