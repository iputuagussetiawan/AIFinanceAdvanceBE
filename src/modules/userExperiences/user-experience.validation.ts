import { Types } from 'mongoose'

export interface IExperience {
    // --- Identifiers ---
    _id?: string | Types.ObjectId // ← added
    id?: string // ← added (virtual)

    // --- Company ---
    company?: string | Types.ObjectId | null
    companyName: string

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
    location?: string // ← changed from required to optional
    locationType?: string // ← changed from required to optional

    // --- Content ---
    description?: string
    whereFineThisJobs?: string

    // --- Metadata ---
    orderPosition: number
    createdAt?: Date
    updatedAt?: Date
}
