import { NotFoundException } from '../../utils/appError'
import UserModel from '../user/user.model'
import type { IUserEducation } from './user-education.validation'

/**
 * Service to Add or Update a single Education entry
 */
export const updateUserEducationService = async (userId: string, educationData: IUserEducation) => {
    const user = await UserModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    // Ensure the array exists (though default: [] handles this in the schema)
    if (!user.educations) user.educations = []

    /**
     * If educationData has an _id, we are updating.
     * Otherwise, we check if an entry with the same institution and degree exists
     * to prevent accidental duplicates.
     */
    const educationIndex = user.educations.findIndex((edu) => {
        if (educationData._id) {
            return edu._id?.toString() === educationData._id.toString()
        }
        return (
            edu.institution.toString() === educationData.institution.toString() &&
            edu.degree === educationData.degree
        )
    })

    if (educationIndex > -1) {
        // UPDATE: Overwrite existing entry
        user.educations[educationIndex] = educationData
    } else {
        // ADD: Push new entry
        user.educations.push(educationData)
    }

    user.markModified('educations')
    await user.save()

    // Populate to get Institution details for the frontend
    await user.populate('educations.institution')

    return user.educations
}

/**
 * Bulk Add or Update education history
 */
export const bulkUpdateUserEducationService = async (
    userId: string,
    educationArray: IUserEducation[]
) => {
    const user = await UserModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    if (!user.educations) user.educations = []

    for (const incomingEdu of educationArray) {
        const index = user.educations.findIndex((existing) => {
            // Priority 1: Match by _id
            if (incomingEdu._id && existing._id) {
                return existing._id.toString() === incomingEdu._id.toString()
            }
            // Priority 2: Match by unique combination
            return (
                existing.institution.toString() === incomingEdu.institution.toString() &&
                existing.degree === incomingEdu.degree
            )
        })

        if (index > -1) {
            user.educations[index] = incomingEdu
        } else {
            user.educations.push(incomingEdu)
        }
    }

    user.markModified('educations')
    await user.save()
    await user.populate('educations.institution')

    return user.educations
}

/**
 * Service to remove a specific education entry
 */
export const removeUserEducationService = async (userId: string, educationId: string) => {
    const result = await UserModel.findByIdAndUpdate(
        userId,
        {
            $pull: { educations: { _id: educationId } }
        },
        { new: true }
    )

    if (!result) throw new NotFoundException('User not found')

    await result.populate('educations.institution')
    return result.educations
}

/**
 * Bulk remove education entries by IDs
 */
export const bulkRemoveUserEducationService = async (userId: string, educationIds: string[]) => {
    const result = await UserModel.findByIdAndUpdate(
        userId,
        {
            $pull: {
                educations: { _id: { $in: educationIds } }
            }
        },
        { new: true }
    )

    if (!result) throw new NotFoundException('User not found')

    await result.populate('educations.institution')
    return result.educations
}
