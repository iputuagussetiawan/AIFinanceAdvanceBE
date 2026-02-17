import mongoose, { Document, Schema } from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";

export interface UserDocument extends Document {
    name: string;
    email: string;
    password?: string;
    profilePicture: string | null;
    isActive: boolean;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;

    comparePassword(value: string): Promise<boolean>;
    omitPassword(): Omit<UserDocument, "password">;
}

const userSchema = new Schema<UserDocument>(
    {
        name: {
            type: String,
            required: false,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: { type: String, select: true },
        profilePicture: {
            type: String,
            default: null,
        },
        isActive: { type: Boolean, default: true },
        lastLogin: { type: Date, default: null },
    },
    {
        timestamps: true,
    }
);

//This code is a Mongoose Middleware (specifically a "Pre-Save Hook"). Its primary purpose is to automatically hash the user's password before it ever touches your database, ensuring that you never store plain-text passwords.
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        if (this.password) {
            this.password = await hashValue(this.password);
        }
    }
    next();
});

//This code defines a Custom Instance Method in Mongoose. Its specific job is to "clean" the user data by removing the sensitive password field before you send the information back to the frontend.
userSchema.methods.omitPassword = function (): Omit<UserDocument, "password"> {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};


//This code defines an Instance Method called comparePassword. It is used during the login process to verify if the plain-text password entered by a user matches the hashed password stored in your MongoDB database.
userSchema.methods.comparePassword = async function (value: string) {
    return compareValue(value, this.password);
};

//This code is the final step in setting up your database model. It takes your configuration (the Schema) and creates a functional tool (the Model) that allows you to interact with the MongoDB database.
const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;