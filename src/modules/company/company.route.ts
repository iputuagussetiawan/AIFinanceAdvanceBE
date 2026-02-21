import { Router } from 'express'
import {
    changeCompanyMemberRoleController,
    createCompanyController,
    deleteCompanyByIdController,
    getCompanyByIdController,
    getCompanyMembersController,
    updateCompanyByIdController
} from './company.controller'

const companyRoutes = Router()
companyRoutes.post('/create', createCompanyController)
companyRoutes.put('/update/:id', updateCompanyByIdController)
companyRoutes.get('/detail/:id', getCompanyByIdController)
companyRoutes.get('/members/:id', getCompanyMembersController)
companyRoutes.delete('/delete/:id', deleteCompanyByIdController)
companyRoutes.put('/change/member/role/:id', changeCompanyMemberRoleController)

export default companyRoutes
