import { Schema } from 'mongoose'
import type { IExperience } from './user-experience.validation'
export const userExperienceSchema = new Schema<IExperience>(
    {
        // --- Identifiers ---
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: false,
            default: undefined
        },

        companyName: {
            type: String,
            required: [true, 'Institution name is required'],
            trim: true
        },

        // --- Role Details ---
        title: {
            type: String,
            required: [true, 'Job title is required'],
            trim: true,
            minlength: [2, 'Job title must be at least 2 characters'],
            maxlength: [100, 'Job title cannot exceed 100 characters']
        },

        profileHeadline: {
            type: String,
            trim: true,
            maxlength: [220, 'Profile headline cannot exceed 220 characters']
        },

        employmentType: {
            type: String,
            required: [true, 'Employment type is required'],
            trim: true,
            enum: {
                values: [
                    'Full-time',
                    'Part-time',
                    'Self-employed',
                    'Freelance',
                    'Contract',
                    'Internship'
                ],
                message:
                    'Employment type must be one of: Full-time, Part-time, Self-employed, Freelance, Contract, Internship'
            }
        },

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
                    return value > this.startDate
                },
                message: 'End date must be after the start date'
            }
        },

        location: {
            type: String,
            required: false,
            trim: true,
            maxlength: [100, 'Location cannot exceed 100 characters']
        },

        locationType: {
            type: String,
            required: false,
            enum: {
                values: ['Remote', 'On-site', 'Hybrid'],
                message: 'Location type must be one of: Remote, On-site, Hybrid'
            }
        },

        description: {
            type: String,
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters']
        },

        whereFineThisJobs: {
            type: String,
            trim: true,
            maxlength: [100, 'Job source cannot exceed 100 characters']
        },

        orderPosition: {
            type: Number,
            default: 0,
            min: [0, 'Order position cannot be negative']
        }
    },
    {
        _id: true,
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete (ret as any)._id // Hapus _id asli agar lebih rapi
                delete (ret as any).__v
                return ret
            }
        },
        toObject: { virtuals: true }
    }
)
