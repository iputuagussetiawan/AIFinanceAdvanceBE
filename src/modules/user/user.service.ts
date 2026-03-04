import { BadRequestException, NotFoundException } from '../../utils/appError'
import UserModel from './user.model'
import type { UpdateUserInputType } from './user.validation'

export const getCurrentUserService = async (userId: string) => {
    const user = await UserModel.findById(userId)
        //It tells the database: "Fetch everything for this user, except for the password field."
        .select('-password')
    if (!user) {
        throw new BadRequestException('User not found')
    }
    return {
        user
    }
}

export const updateUserService = async (
    userId: string,
    body: UpdateUserInputType,
    profilePic?: Express.Multer.File
) => {
    const user = await UserModel.findById(userId)
    if (!user) throw new NotFoundException('User not found')

    if (profilePic) {
        user.profilePicture = profilePic.path
    }
    user.set({
        name: body.name
    })
    await user.save()
    return user.omitPassword()
}
