import { Router } from 'express'
import { saveEducationHistoryController } from './education.controller'
const educationRoutes = Router()
educationRoutes.post('/create', saveEducationHistoryController)
export default educationRoutes
