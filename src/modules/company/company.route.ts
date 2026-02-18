import { Router } from "express";
import { createCompanyController, updateCompanyByIdController } from "./company.controller";

const companyRoutes = Router();
companyRoutes.post("/create", createCompanyController);
companyRoutes.put("/update/:id", updateCompanyByIdController);
export default companyRoutes;