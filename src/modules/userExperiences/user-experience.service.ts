import { Types } from 'mongoose'
import { NotFoundException, BadRequestException } from '../../utils/appError'
import UserModel from '../user/user.model'
import type { IExperience } from './user-experience.validation'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Sanitize incoming experience data:
 * - Convert empty string company to undefined (prevents ObjectId cast error)
 * - Convert empty string endDate to null
 */
const sanitizeExperience = (exp: IExperience): IExperience => ({
    ...exp,
    company: exp.company && exp.company !== '' ? exp.company : undefined,
    endDate: exp.endDate || null
})

/**
 * Match experience by _id if provided, otherwise fallback to title match
 */
const matchExperience = (existing: any, incoming: IExperience): boolean => {
    if (incoming._id && existing._id) {
        return existing._id.toString() === incoming._id.toString()
    }
    // Fallback: match by title only (company can be null/undefined)
    return existing.title === incoming.title
}

// ─── Services ─────────────────────────────────────────────────────────────────

/**
 * Add or Update a single Experience entry
 */
export const updateUserExperienceService = async (userId: string, experienceData: IExperience) => {
    const user = await UserModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    if (!user.experiences) user.experiences = []

    const sanitized = sanitizeExperience(experienceData)
    const index = user.experiences.findIndex((exp: any) => matchExperience(exp, sanitized))

    if (index > -1) {
        user.experiences[index] = sanitized
    } else {
        user.experiences.push(sanitized)
    }

    user.markModified('experiences')
    await user.save()
    await user.populate('experiences.company')

    return user.experiences
}

/**
 * Bulk Add or Update experience history
 * Replaces entire experiences array with incoming order (orderPosition driven)
 */
export const bulkUpdateUserExperienceService = async (
    userId: string,
    experienceArray: IExperience[]
) => {
    if (!Array.isArray(experienceArray)) {
        throw new BadRequestException('experienceArray must be an array')
    }

    const user = await UserModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    if (!user.experiences) user.experiences = []

    const sanitizedArray = experienceArray.map(sanitizeExperience)

    for (const incoming of sanitizedArray) {
        const index = user.experiences.findIndex((existing: any) =>
            matchExperience(existing, incoming)
        )

        if (index > -1) {
            // UPDATE existing
            user.experiences[index] = incoming
        } else {
            // ADD new
            user.experiences.push(incoming)
        }
    }

    // Re-sort by orderPosition after bulk update
    user.experiences.sort((a: any, b: any) => (a.orderPosition ?? 0) - (b.orderPosition ?? 0))

    user.markModified('experiences')
    await user.save()
    await user.populate('experiences.company')

    return user.experiences
}

/**
 * Remove a single experience entry by ID
 */
export const removeUserExperienceService = async (userId: string, experienceId: string) => {
    if (!Types.ObjectId.isValid(experienceId)) {
        throw new BadRequestException('Invalid experience ID')
    }

    const result = await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { experiences: { _id: experienceId } } },
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
    if (!Array.isArray(experienceIds) || experienceIds.length === 0) {
        throw new BadRequestException('experienceIds must be a non-empty array')
    }

    // Validate all IDs before touching the DB
    const invalidIds = experienceIds.filter((id) => !Types.ObjectId.isValid(id))
    if (invalidIds.length > 0) {
        throw new BadRequestException(`Invalid experience IDs: ${invalidIds.join(', ')}`)
    }

    const result = await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { experiences: { _id: { $in: experienceIds } } } },
        { new: true }
    )

    if (!result) throw new NotFoundException('User not found')

    await result.populate('experiences.company')
    return result.experiences
}
