import { Router } from 'express'
import { saveExperienceHistoryController } from './experience.controller'

const experienceRoutes = Router()

/**
 * @route   POST /api/experience/create
 * @desc    Add a new experience record to the user profile
 * @access  Private
 */
experienceRoutes.post('/create', saveExperienceHistoryController)

export default experienceRoutes
