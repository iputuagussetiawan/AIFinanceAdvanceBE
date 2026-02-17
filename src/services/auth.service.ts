import mongoose from "mongoose";
import UserModel from "../models/user.model";
import AccountModel from "../models/account.model";
import {
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
} from "../utils/appError";
import { ProviderEnum } from "../enums/account-provider.enum";

export const loginOrCreateAccountService = async (data: {
    provider: string;
    displayName: string;
    providerId: string;
    picture?: string;
    email?: string;
}) => {
    const { providerId, provider, displayName, email, picture } = data;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        console.log("Started Session...");

        //check user on db
        let user = await UserModel.findOne({ email }).session(session);

        //jika tidak ada user, maka buat user baru
        if (!user) {
            //buat user baru
            user = new UserModel({
                email,
                name: displayName,
                profilePicture: picture || null,
            });
            await user.save({ session });

            //buat akun baru
            const account = new AccountModel({
                userId: user._id,
                provider: provider,
                providerId: providerId,
            });
            await account.save({ session });
        }
        await session.commitTransaction();
        session.endSession();
        console.log("End Session...");
        return { user };
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};


/**
 * Service to handle new user registration and account creation
 */
export const registerUserService = async (body: {
    email: string;
    name: string;
    password: string;
}) => {
    const { email, name, password } = body;
    // Create a Mongoose session for the transaction
    const session = await mongoose.startSession();
    try {
        // Start the atomic transaction
        session.startTransaction();
        console.log("🏁 [TRANSACTION] Registration started...");
        // 1. Search for existing user with the same email within the session
        const existingUser = await UserModel.findOne({ email }).session(session);
        // 2. If a user is found, prevent duplicate registration
        if (existingUser) {
            console.log(`⚠️[AUTH] Registration failed: Email ${email} already exists.`);
            throw new BadRequestException("Email already exists");
        }
        // 3. Initialize a new User document (middleware handles password hashing)
        const user = new UserModel({
            email,
            name,
            password,
        });
        // 4. Save the user document as part of the transaction
        await user.save({ session });

        // 5. Initialize the associated Account (Auth Provider) for the user
        const account = new AccountModel({
            userId: user._id,
            provider: ProviderEnum.EMAIL,
            providerId: email,
        });
        // 6. Save the account document as part of the transaction
        await account.save({ session });
        // 7. Commit all changes to the database permanently
        await session.commitTransaction();
        session.endSession();
        console.log("✅ [TRANSACTION] Registration successful and committed.");
        return {
            userId: user._id,
        };
    } catch (error:any) {
        await session.abortTransaction();
        console.error("❌ [TRANSACTION] Registration aborted due to error:", error.message);
        throw error;
    }finally{
        session.endSession();
    }
};


