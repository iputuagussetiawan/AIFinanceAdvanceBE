import { Types } from 'mongoose'

export interface IExperience {
    // MongoDB ID (Optional for new entries, required for updates/deletes)
    _id?: string | Types.ObjectId
    id?: string // Virtual ID for the frontend

    // --- Identifiers ---
    // Link to a Company model ID or a custom string name
    company?: string | Types.ObjectId | null

    // --- Role Details ---
    title: string
    profileHeadline?: string
    employmentType:
        | 'Full-time'
        | 'Part-time'
        | 'Self-employed'
        | 'Freelance'
        | 'Contract'
        | 'Internship'
        | string

    // --- Status & Dates ---
    isCurrent: boolean
    startDate: Date
    endDate?: Date | null

    // --- Location ---
    location: string
    locationType: 'Remote' | 'On-site' | 'Hybrid' | string

    // --- Content ---
    description?: string
    whereFineThisJobs?: string // "Where did you find this job?"

    // --- Metadata ---
    orderPosition: number
    createdAt?: Date
    updatedAt?: Date
}
