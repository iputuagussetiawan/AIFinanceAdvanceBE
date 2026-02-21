import { Router } from 'express'
import {
    createCompanyController,
    getCompanyByIdController,
    getCompanyMembersController,
    updateCompanyByIdController
} from './company.controller'

const companyRoutes = Router()
companyRoutes.post('/create', createCompanyController)
companyRoutes.put('/update/:id', updateCompanyByIdController)
companyRoutes.get('/detail/:id', getCompanyByIdController)
companyRoutes.get('/members/:id', getCompanyMembersController)

export default companyRoutes
