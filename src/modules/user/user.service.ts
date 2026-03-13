import { BadRequestException, NotFoundException } from '../../utils/appError'
import UserModel from './user.model'
import type { UpdateUserInputType } from './user.validation'
import { v2 as cloudinary } from 'cloudinary'

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
        if (user.profilePicture && user.profilePicture.includes('cloudinary')) {
            try {
                // Robust extraction: get everything between /upload/v12345/ and the extension
                const splitUrl = user.profilePicture.split('/')
                const lastPart = splitUrl[splitUrl.length - 1].split('.')[0]
                const folderPart = splitUrl[splitUrl.length - 2]

                // If your images are in a folder, publicId must be "folder/filename"
                const publicId = user.profilePicture.includes('upload/v')
                    ? `${folderPart}/${lastPart}`
                    : lastPart

                await cloudinary.uploader.destroy(publicId, { invalidate: true })
            } catch (error) {
                console.error('Cloudinary cleanup failed:', error)
            }
        }
        user.profilePicture = profilePic.path
    }

    user.name = body.name || user.name
    user.bio = body.bio || user.bio
    await user.save()
    return user.omitPassword()
}
