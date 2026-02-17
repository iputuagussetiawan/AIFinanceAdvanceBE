import mongoose, { Document, Schema } from "mongoose";

// Define the interface for TypeScript
export interface CompanyDocument extends Document {
    name: string;
    slug: string;
    baseCurrency: string;
    fiscalYearStartMonth: number;
    // --- ADDED RELATIONSHIP ---
    owner: mongoose.Types.ObjectId | null;
    // ----END RELATIONSHIP ----
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const companySchema = new Schema<CompanyDocument>(
    {
        // The display name of the company
        name: {
            type: String,
            required: true,
            trim: true,
        },
        // A unique string for URLs (e.g., 'my-company-inc')
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        // The primary currency used for financial reports (e.g., 'USD', 'IDR')
        baseCurrency: {
            type: String,
            required: true,
            default: "USD",
            uppercase: true,
        },
        // Important for finance apps: which month the financial year begins (1-12)
        fiscalYearStartMonth: {
            type: Number,
            required: true,
            default: 1, // Default to January
            min: 1,
            max: 12,
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        // Whether the company account is currently active
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        // Automatically creates 'createdAt' and 'updatedAt' fields shown in your image
        timestamps: true,
    }
);

// Create an index on the slug for high-performance searching in URLs
companySchema.index({ slug: 1 });

const CompanyModel = mongoose.model<CompanyDocument>("Company", companySchema);
export default CompanyModel;