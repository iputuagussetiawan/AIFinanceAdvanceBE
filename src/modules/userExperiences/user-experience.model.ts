import { Schema } from 'mongoose'
import type { IExperience } from './user-experience.validation'
export const userExperienceSchema = new Schema<IExperience>(
    {
        // --- Identifiers ---
        company: {
            type: Schema.Types.Mixed, // Allows ObjectId (ref) or String
            ref: 'Company',
            default: null
        },

        // --- Role Details ---
        title: {
            type: String,
            required: [true, 'Job title is required'],
            trim: true
        },
        profileHeadline: {
            type: String,
            trim: true
        },
        employmentType: {
            type: String,
            required: [true, 'Employment type is required'],
            enum: ['Full-time', 'Part-time', 'Self-employed', 'Freelance', 'Contract', 'Internship']
        },

        // --- Status & Dates ---
        isCurrent: {
            type: Boolean,
            default: false
        },
        startDate: {
            type: Date,
            required: [true, 'Start date is required']
        },
        endDate: {
            type: Date,
            default: null,
            validate: {
                validator: function (this: IExperience, value: Date) {
                    if (this.isCurrent || !value) return true
                    return value >= this.startDate
                },
                message: 'End date must be after the start date.'
            }
        },

        // --- Location ---
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true
        },
        locationType: {
            type: String,
            required: [true, 'Location type is required'],
            enum: ['Remote', 'On-site', 'Hybrid']
        },

        // --- Content ---
        description: {
            type: String,
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters']
        },
        whereFineThisJobs: {
            type: String,
            trim: true
        },

        // --- Metadata ---
        orderPosition: {
            type: Number,
            default: 0
        }
    },
    {
        _id: true,
        timestamps: true,
        toJSON: {
            virtuals: true
        }
    }
)
