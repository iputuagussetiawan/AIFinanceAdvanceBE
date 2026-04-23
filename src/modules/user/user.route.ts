import { Router } from 'express'
import {
    getCurrentUserController,
    updateUserController,
    updateUserPhotoProfileController,
    updateUserProfileController
} from './user.controller'
import { upload } from '../../config/cloudinary.config'
import {
    bulkRemoveUserLanguages,
    bulkUpsertUserLanguages,
    removeUserLanguage,
    upsertUserLanguage
} from '../userlanguage/user-language.controller'
import { UserEducationController } from '../userEducation/user-education.controller'

const userRoutes = Router()

userRoutes.get('/current', getCurrentUserController)
userRoutes.put('/update', upload.single('profilePicture'), updateUserController)
userRoutes.put('/update-profile', updateUserProfileController)
userRoutes.put('/update-photo', upload.single('profilePicture'), updateUserPhotoProfileController)

userRoutes.put('/languages', upsertUserLanguage)
userRoutes.put('/languages/bulk', bulkUpsertUserLanguages)
userRoutes.delete('/languages/bulk', bulkRemoveUserLanguages)
userRoutes.delete('/languages/:languageId', removeUserLanguage)

userRoutes.put('/educations', UserEducationController.updateEducation)
userRoutes.put('/educations/bulk', UserEducationController.bulkUpdateEducation)
userRoutes.delete('/educations/bulk', UserEducationController.bulkRemoveEducation)
userRoutes.delete('/educations/:educationId', UserEducationController.removeEducation)
export default userRoutes
