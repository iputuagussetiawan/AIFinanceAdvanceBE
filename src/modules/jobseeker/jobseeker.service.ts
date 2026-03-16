import mongoose from 'mongoose'
import { NotFoundException, BadRequestException } from '../../utils/appError'
import UserModel from '../user/user.model'
import JobseekerModel from './jobseeker.model' // Assuming your profile model name
import type { JobseekerPersonalInfoDTO } from './jobseeker.validation' // Assuming you have this schema

/**
 * Service to handle creating or updating the core Jobseeker profile
 */
export const saveJobseekerProfileService = async (
    userId: string,
    body: JobseekerPersonalInfoDTO
) => {
    // 1. Verify user exists
    const user = await UserModel.findById(userId)
    if (!user) {
        throw new NotFoundException('User not found')
    }

    // 2. Start session for atomic transaction
    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        // 3. Upsert Logic: Update if exists, Create if not
        // We use userId as the unique identifier for the profile
        const profile = await JobseekerModel.findOneAndUpdate(
            { userId },
            {
                ...body,
                userId // Ensure userId is correctly mapped
            },
            {
                new: true, // Return the updated document
                upsert: true, // Create if it doesn't exist
                runValidators: true,
                session
            }
        )

        await session.commitTransaction()

        return {
            profile
        }
    } catch (error: any) {
        await session.abortTransaction()
        console.error('❌ [TRANSACTION] Jobseeker profile save aborted:', error.message)

        // Handle MongoDB unique constraint errors (e.g., duplicate slug or phone)
        if (error.code === 11000) {
            throw new BadRequestException('A profile with this unique information already exists')
        }

        throw error
    } finally {
        session.endSession()
    }
}

/**
 * Service to get the complete Jobseeker profile including Experience and Education
 */
export const getFullJobseekerProfileService = async (userId: string) => {
    const profile = await JobseekerModel.findOne({ userId })
        .populate('userId', 'name email avatar') // Get basic user info
        .lean()
    if (!profile) {
        throw new NotFoundException('Profile not found')
    }
    return { profile }
}
