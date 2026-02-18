import UserModel from "../models/user.model";
import { BadRequestException } from "../utils/appError";

export const getCurrentUserService = async (userId: string) => {
    const user = await UserModel.findById(userId)
        //It tells the database: "Fetch everything for this user, except for the password field."
        .select("-password");
    if (!user) {
        throw new BadRequestException("User not found");
    }
    return {
        user,
    };
};