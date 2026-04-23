import { Schema, model } from 'mongoose'
import type { IUserEducation } from './user-education.validation'

export const userEducationSchema = new Schema<IUserEducation>(
    {
        institution: {
            type: Schema.Types.ObjectId,
            ref: 'Institution', // Assumes you have an Institution model
            required: [true, 'Institution is required']
        },
        degree: {
            type: String,
            required: [true, 'Degree is required'],
            trim: true
        },
        fieldOfStudy: {
            type: String,
            required: [true, 'Field of study is required'],
            trim: true
        },
        startDate: {
            type: Date,
            required: [true, 'Start date is required']
        },
        endDate: {
            type: Date,
            default: null,
            // Custom validation: End date cannot be before Start date
            validate: {
                validator: function (this: IUserEducation, value: Date) {
                    if (!value) return true // Ongoing education
                    return value >= this.startDate
                },
                message: 'End date must be after the start date.'
            }
        },
        grade: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters']
        },
        orderPosition: {
            type: Number,
            default: 0
        }
    },
    {
        _id: true, // Usually keep this true for Education so you can edit specific entries
        timestamps: true
    }
)
