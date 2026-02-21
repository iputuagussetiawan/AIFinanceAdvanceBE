import mongoose from 'mongoose'
import { NotFoundException } from '../../utils/appError'
import CompanyModel from './company.model'
import type { CreateCompanyInputType, UpdateCompanyInputType } from './company.validation'
import UserModel from '../user/user.model'
import MemberModel from '../member/member.model'
import RoleModel from '../role/roles-permission.model'
import { Roles } from '../role/role.enum'

export const createCompanyService = async (userId: string, body: CreateCompanyInputType) => {
    const user = await UserModel.findById(userId)
    if (!user) {
        throw new NotFoundException('User not found')
    }
    const ownerRole = await RoleModel.findOne({ name: Roles.OWNER })

    if (!ownerRole) {
        throw new NotFoundException('Owner role not found')
    }

    // //buat company
    const company = new CompanyModel({
        ...body,
        // Ensure owner is set correctly if it differs from body.owner
        owner: userId
    })

    //simpan company
    await company.save()

    //  // 1. Check if name already exists (The "Unique" check)
    // const existingCompany = await CompanyModel.findOne({
    //     name: { $regex: new RegExp(`^${body.name}$`, 'i') }
    // })

    // if (existingCompany) {
    //     // Assuming you have a custom exception handler
    //     throw new Error('Company name already exists')
    // }

    const member = new MemberModel({
        userId: user._id,
        companyId: company._id,
        role: ownerRole._id,
        joinedAt: new Date()
    })
    await member.save()
    user.currentCompany = company._id as mongoose.Types.ObjectId
    await user.save()
    return {
        company
    }
}

export const getAllCompaniesUserIsMemberService = async (userId: string) => {
    const memberships = await MemberModel.find({ userId })
        .populate('companyId')
        .select('-password')
        .exec()
    // Extract company details from memberships
    const companies = memberships.map((membership) => membership.companyId)
    return { companies }
}

export const updateCompanyByIdService = async (companyId: string, body: UpdateCompanyInputType) => {
    const company = await CompanyModel.findById(companyId)
    if (!company) {
        throw new NotFoundException('Workspace not found')
    }
    // Update the company details
    company.name = body.name || company.name
    company.slug = body.slug || company.slug
    company.logoUrl = body.logoUrl || company.logoUrl
    company.bgUrl = body.bgUrl || company.bgUrl
    company.baseCurrency = body.baseCurrency || company.baseCurrency
    company.fiscalYearStartMonth = body.fiscalYearStartMonth || company.fiscalYearStartMonth
    company.isActive = body.isActive || company.isActive
    await company.save()
    return {
        company
    }
}

export const getCompanyByIdService = async (companyId: string) => {
    const company = await CompanyModel.findById(companyId)
    if (!company) {
        throw new NotFoundException('Company not found')
    }

    const members = await MemberModel.find({
        companyId
    }).populate('role')
    const companyWithMembers = {
        ...company.toObject(),
        members
    }
    return {
        company: companyWithMembers
    }
}
