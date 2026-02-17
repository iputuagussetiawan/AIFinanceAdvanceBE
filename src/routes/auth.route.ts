import { Router } from "express";
import passport from "passport";
import { config } from "../config/app.config";
import {  googleLoginCallback, loginController, registerUserController } from "../controller/auth.controller";

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;
const authRoutes = Router();
authRoutes.post("/register", registerUserController);
authRoutes.post("/login", loginController);
authRoutes.get("/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
    })
);
authRoutes.get("/google/callback",
    passport.authenticate("google", {
        failureRedirect: failedUrl,
        session: false
    }),
    googleLoginCallback
);

export default authRoutes;