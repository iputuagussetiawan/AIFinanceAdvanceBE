import CompanyModel from "./company.model";
import type { CreateCompanyInputType } from "./company.validation";

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

