import mongoose, { Document, Schema } from "mongoose";
import type { RoleDocument } from "./roles-permission.model";

export interface CompanyMemberDocument extends Document {
    isActive: boolean;
    // --- ADDED RELATIONSHIP ---
    companyId: mongoose.Types.ObjectId | null; 
    userId: mongoose.Types.ObjectId | null; 
    role: RoleDocument;
    joinedAt: Date;
    // ----END RELATIONSHIP ----
    createdAt: Date;
    updatedAt: Date;
}

const companyMemberSchema = new Schema<CompanyMemberDocument>(
    {
        isActive: { type: Boolean, default: true },
        // --- ADDED RELATIONSHIP FIELD ---
        companyId: {
            type: Schema.Types.ObjectId,
            ref: "Company", // This must match the name used in your Company model
            default: null,
            index: true, // Recommended for faster queries when filtering by company
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User", // This must match the name used in your User model
            default: null,
            index: true, // Recommended for faster queries when filtering by company
        },

        role: {
            type: Schema.Types.ObjectId,
            ref: "Role",
            required: true,
        },
        // ---END ADDED RELATIONSHIP FIELD ---
    },
    {
        timestamps: true,
    }
);

//This code is the final step in setting up your database model. It takes your configuration (the Schema) and creates a functional tool (the Model) that allows you to interact with the MongoDB database.
const CompanyUserModel = mongoose.model<CompanyMemberDocument>("CompanyMember", companyMemberSchema);
export default CompanyUserModel;