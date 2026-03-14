import mongoose from 'mongoose'
import { NotFoundException } from '../../utils/appError'
import UserModel from '../user/user.model'
import ExperienceModel from './experience.model' // Ensure this is imported
import type { ExperienceDTO } from './experience.validation'

/**
 * Service to handle saving a single experience record
 */
export const saveExperienceHistoryService = async (userId: string, body: ExperienceDTO) => {
    // 1. Verify user exists
    const user = await UserModel.findById(userId)
    if (!user) {
        throw new NotFoundException('User not found')
    }

    // 2. Use a transaction for consistency
    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        // 3. Handle 'isCurrent' logic
        // If this is the current job, ensure endDate is null
        // regardless of what the frontend sent.
        const experienceData = {
            ...body,
            userId: userId,
            endDate: body.isCurrent ? null : body.endDate
        }

        // 4. Create and Save the Experience document
        const experience = new ExperienceModel(experienceData)

        // Save within the transaction
        await experience.save({ session })

        await session.commitTransaction()

        return {
            experience
        }
    } catch (error: any) {
        // Abort transaction on error
        await session.abortTransaction()
        console.error('❌ [TRANSACTION] Experience save aborted:', error.message)
        throw error
    } finally {
        // Always end the session
        session.endSession()
    }
}
