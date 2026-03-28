import mongoose from 'mongoose'
import { NotFoundException } from '../../utils/appError'
import type { EducationDTO } from './education.validation'
import UserModel from '../user/user.model'
import EducationModel, { type EducationDocument } from './education.model'

/**
 * Service to handle saving a single education record
 */
export const saveEducationHistoryService = async (
    userId: string,
    body: EducationDTO // Changed from EducationDTO[] to a single object
) => {
    // 1. Verify user exists
    const user = await UserModel.findById(userId)
    if (!user) {
        throw new NotFoundException('User not found')
    }

    // 2. Since we are only saving one document,
    // we can use a simpler approach without a heavy transaction if preferred,
    // but keeping it here for consistency with your auth logic.
    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        // 3. Create the single education document
        const education = new EducationModel({
            ...body,
            userId: userId
        })

        // 4. Save within the transaction
        await education.save({ session })

        await session.commitTransaction()

        return {
            education
        }
    } catch (error: any) {
        await session.abortTransaction()
        console.error('❌ [TRANSACTION] Education save aborted:', error.message)
        throw error
    } finally {
        session.endSession()
    }
}

export const getEducationHistory = async (userId: string): Promise<EducationDocument[]> => {
    try {
        // 1. Validate the userId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid User ID format')
        }

        // 2. Fetch the data
        // We sort by orderPosition (ascending) then by startDate (descending)
        const history = await EducationModel.find({ userId })
            .sort({ orderPosition: 1, startDate: -1 })
            .lean() // .lean() makes the query faster by returning plain JS objects

        return history as unknown as EducationDocument[]
    } catch (error: any) {
        throw new Error(`Error fetching education history: ${error.message}`)
    }
}
