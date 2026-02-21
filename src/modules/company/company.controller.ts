import { Request, Response } from 'express'
import { asyncHandler } from '../../middlewares/asyncHandler.middleware'
import { companyIdSchema, createCompanySchema, updateCompanySchema } from './company.validation'
import {
    createCompanyService,
    getAllCompaniesUserIsMemberService,
    getCompanyByIdService,
    updateCompanyByIdService
} from './company.service'
import { HTTPSTATUS } from '../../config/http.config'
import { getMemberRoleInCompany } from '../member/member.service'

export const createCompanyController = asyncHandler(async (req: Request, res: Response) => {
    const body = createCompanySchema.parse(req.body)
    const userId = req.user?._id
    const { company } = await createCompanyService(userId, body)
    return res.status(HTTPSTATUS.OK).json({
        message: 'Company created successfully',
        company
    })
})

export const getAllCompanyUserIsMemberController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id
        const { companies } = await getAllCompaniesUserIsMemberService(userId)
        return res.status(HTTPSTATUS.OK).json({
            message: 'User companies fetched successfully',
            companies
        })
    }
)

export const updateCompanyByIdController = asyncHandler(async (req: Request, res: Response) => {
    const companyId = companyIdSchema.parse(req.params.id)
    const body = updateCompanySchema.parse(req.body)
    const { company } = await updateCompanyByIdService(companyId, body)
    return res.status(HTTPSTATUS.OK).json({
        message: 'Company updated successfully',
        company
    })
})

export const getCompanyByIdController = asyncHandler(async (req: Request, res: Response) => {
    const companyId = companyIdSchema.parse(req.params.id)
    const userId = req.user?._id
    await getMemberRoleInCompany(userId, companyId)
    const { company } = await getCompanyByIdService(companyId)
    return res.status(HTTPSTATUS.OK).json({
        message: 'Company fetched successfully',
        company
    })
})
