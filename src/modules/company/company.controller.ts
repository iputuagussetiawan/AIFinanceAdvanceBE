import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";
import { createCompanySchema } from "./company.validation";
import { createCompanyService } from "./company.service";
import { HTTPSTATUS } from "../../config/http.config";

export const createCompanyController = asyncHandler(
    async (req: Request, res: Response) => {
        const body = createCompanySchema.parse(req.body);
        const userId = req.user?._id;
        const { company } = await createCompanyService(userId, body);
        return res.status(HTTPSTATUS.OK).json({
            message: "Company created successfully",
            company,
        });
    }
);

