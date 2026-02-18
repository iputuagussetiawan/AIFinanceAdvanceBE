import { NotFoundException } from "../../utils/appError";
import CompanyModel from "./company.model";
import type { CreateCompanyInputType, UpdateCompanyInputType } from "./company.validation";

export const createCompanyService = async (
    userId: string,
    body: CreateCompanyInputType
) => {
    // 1. Check if name already exists (The "Unique" check)
    const existingCompany = await CompanyModel.findOne({ 
        name: { $regex: new RegExp(`^${body.name}$`, "i") } 
    });

    if (existingCompany) {
        // Assuming you have a custom exception handler
        throw new Error("Company name already exists"); 
    }

    // //buat company
    const company = new CompanyModel({
        ...body,
        // Ensure owner is set correctly if it differs from body.owner
        owner: userId,
    });
    //simpan company
    await company.save();
    return {
        company,
    };
};

export const updateCompanyByIdService = async (
    companyId: string,
    body:UpdateCompanyInputType
) => {
    const company = await CompanyModel.findById(companyId);
    if (!company) {
        throw new NotFoundException("Workspace not found");
    }
    // Update the company details
    company.name = body.name || company.name;
    company.slug = body.slug || company.slug;
    company.baseCurrency = body.baseCurrency || company.baseCurrency;
    company.fiscalYearStartMonth = body.fiscalYearStartMonth || company.fiscalYearStartMonth;
    company.isActive = body.isActive || company.isActive;
    await company.save();
    return {
        company,
    };
};

