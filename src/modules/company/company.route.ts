import { Router } from "express";
import { createCompanyController } from "./company.controller";

const companyRoutes = Router();
companyRoutes.post("/create", createCompanyController);

export default companyRoutes;