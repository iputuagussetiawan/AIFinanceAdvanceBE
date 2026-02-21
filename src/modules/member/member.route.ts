import { Router } from 'express'
import { joinCompanyController } from './member.controller'

const memberRoutes = Router()
memberRoutes.post('/workspace/:inviteCode/join', joinCompanyController)
export default memberRoutes
