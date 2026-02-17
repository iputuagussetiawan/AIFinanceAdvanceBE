import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from "../config/app.config";
import { registerSchema } from "../validations/auth.validation";
import { registerUserService } from "../services/auth.service";
import { HTTPSTATUS } from "../config/http.config";

export const googleLoginCallback = asyncHandler(
    async (req: Request, res: Response) => {
        const jwt=req.jwt

        if (!jwt) {
            return res.redirect(
            `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
            );
        }

        return res.redirect(
          `${config.FRONTEND_ORIGIN}`
        );

        // return res.redirect(
        //     `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=success&access_token=${jwt}`
        // );
    }
);

export const registerUserController = asyncHandler(
    async (req: Request, res: Response) => {
        const body = registerSchema.parse({
            ...req.body,
        });
        await registerUserService(body);
        return res.status(HTTPSTATUS.CREATED).json({
            message: "User created successfully",
        });
    }
);

