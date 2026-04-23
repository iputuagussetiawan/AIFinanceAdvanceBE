import { NotFoundException } from '../../utils/appError'
import UserModel from '../user/user.model'
import type { IExperience } from './user-experience.validation'

/**
 * Service to Add or Update a single Experience entry
 */
export const updateUserExperienceService = async (userId: string, experienceData: IExperience) => {
    const user = await UserModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    if (!user.experiences) user.experiences = []

    /**
     * Match by _id if updating, or by title/company combo for new entries
     */
    const experienceIndex = user.experiences.findIndex((exp: any) => {
        if (experienceData._id) {
            return exp._id?.toString() === experienceData._id.toString()
        }
        return (
            exp.company?.toString() === experienceData.company?.toString() &&
            exp.title === experienceData.title
        )
    })

    if (experienceIndex > -1) {
        // UPDATE: Overwrite existing entry
        user.experiences[experienceIndex] = experienceData
    } else {
        // ADD: Push new entry
        user.experiences.push(experienceData)
    }

    user.markModified('experiences')
    await user.save()

    // Populate company if it's an ObjectId reference
    await user.populate('experiences.company')

    return user.experiences
}

/**
 * Bulk Add or Update experience history
 */
export const bulkUpdateUserExperienceService = async (
    userId: string,
    experienceArray: IExperience[]
) => {
    const user = await UserModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    if (!user.experiences) user.experiences = []

    for (const incomingExp of experienceArray) {
        const index = user.experiences.findIndex((existing: any) => {
            if (incomingExp._id && existing._id) {
                return existing._id.toString() === incomingExp._id.toString()
            }
            return (
                existing.company?.toString() === incomingExp.company?.toString() &&
                existing.title === incomingExp.title
            )
        })

        if (index > -1) {
            user.experiences[index] = incomingExp
        } else {
            user.experiences.push(incomingExp)
        }
    }

    user.markModified('experiences')
    await user.save()
    await user.populate('experiences.company')

    return user.experiences
}

/**
 * Service to remove a specific experience entry
 */
export const removeUserExperienceService = async (userId: string, experienceId: string) => {
    const result = await UserModel.findByIdAndUpdate(
        userId,
        {
            $pull: { experiences: { _id: experienceId } }
        },
        { new: true }
    )

    if (!result) throw new NotFoundException('User not found')

    await result.populate('experiences.company')
    return result.experiences
}

/**
 * Bulk remove experience entries by IDs
 */
export const bulkRemoveUserExperienceService = async (userId: string, experienceIds: string[]) => {
    const result = await UserModel.findByIdAndUpdate(
        userId,
        {
            $pull: {
                experiences: { _id: { $in: experienceIds } }
            }
        },
        { new: true }
    )

    if (!result) throw new NotFoundException('User not found')

    await result.populate('experiences.company')
    return result.experiences
}
