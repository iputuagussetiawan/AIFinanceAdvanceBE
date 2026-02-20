import { Router } from 'express'
import {
    createCompanyController,
    getCompanyByIdController,
    updateCompanyByIdController
} from './company.controller'

const companyRoutes = Router()
companyRoutes.post('/create', createCompanyController)
companyRoutes.put('/update/:id', updateCompanyByIdController)
companyRoutes.get('/detail/:id', getCompanyByIdController)

export default companyRoutes
