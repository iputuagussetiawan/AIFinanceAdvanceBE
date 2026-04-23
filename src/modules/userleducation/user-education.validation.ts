import { Types } from 'mongoose'

export interface IUserEducation {
    // Reference to an Institution model
    _id?: string | Types.ObjectId // Add this line
    institution: Types.ObjectId | string

    // Core details
    degree: string
    fieldOfStudy: string

    // Timeframe
    startDate: Date
    endDate?: Date | null // Nullable for "Present" or ongoing education
    isCurrent: boolean // Helpful flag for UI logic (e.g., "2022 - Present")

    // Academic performance
    grade?: string // Supports GPA (e.g., "3.8/4.0") or classification (e.g., "First Class")

    // Additional content
    description?: string // Achievements, societies, or relevant coursework

    // UI/UX handling
    orderPosition: number // For manual sorting of education history
}
