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
        session.endSession();
        throw error;
    } finally {
        session.endSession();
    }
};


