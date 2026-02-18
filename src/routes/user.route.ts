import { Router } from "express";
import { getCurrentUserController } from "../controller/user.controller";

const userRoutes = Router();

userRoutes.get("/current", getCurrentUserController);

export default userRoutes;