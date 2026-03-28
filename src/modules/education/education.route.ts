import { Router } from 'express'
import {
    getEducationHistoryController,
    saveEducationHistoryController
} from './education.controller'
const educationRoutes = Router()
educationRoutes.post('/create', saveEducationHistoryController)
educationRoutes.get('/get', getEducationHistoryController)
export default educationRoutes
