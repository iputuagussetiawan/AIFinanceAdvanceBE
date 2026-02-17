import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from "../config/app.config";
import { registerSchema } from "../validations/auth.validation";
import { registerUserService } from "../services/auth.service";
import { HTTPSTATUS } from "../config/http.config";
import passport from "passport";
import { signJwtToken } from "../utils/jwt";

export const googleLoginCallback = (req: Request, res: Response) => {
    try {
        // 1. Passport attaches the user to req.user after successful strategy
        const user = req.user as any; 

        if (!user) {
            console.log("⚠️  [AUTH] Google authentication failed: No user found.");
            return res.redirect(`${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=error&message=unauthorized`);
        }

        // 2. Generate your stateless JWT
        const access_token = signJwtToken({ userId: user._id });
        console.log(`✅ [AUTH] Issued JWT for Google User: ${user.email}`);

        // 3. Set the JWT in a secure HttpOnly Cookie
        res.cookie("accessToken", access_token, {
            httpOnly: true,    // Prevents JavaScript from reading the cookie
            secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
            sameSite: "strict", // Prevents CSRF attacks
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            path: "/",         // Cookie available for all routes
        });

        // 4. Redirect to the frontend (No token in the URL!)
        return res.redirect(
            `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=success&provider=google`
        );
        
    } catch (error:any) {
        console.error("❌ [AUTH] Callback Error:", error);
        const errorType = error.name === "NotFoundException" ? "user_not_found" : "server_error";
        return res.redirect(
            `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=error&code=${errorType}`
        );
    }
};

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

export const loginController = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        // We use { session: false } because we are using JWT, not Express sessions
        passport.authenticate("local", { session: false }, (
            err: Error | null,
            user: any, // Use your AuthenticatedUser interface here
            info: { message: string } | undefined
        ) => {
            // 1. Handle system errors
            if (err) {
                console.error("❌ [AUTH] Login internal error:", err);
                return next(err);
            }

            // 2. Handle invalid credentials
            if (!user) {
                console.log(`⚠️  [AUTH] Login failed: ${info?.message}`);
                return res.status(HTTPSTATUS.UNAUTHORIZED).json({
                    message: info?.message || "Invalid email or password",
                });
            }

            // 3. Generate the JWT
            const access_token = signJwtToken({ userId: user._id });

            // 4. Set the HttpOnly Cookie
            // This 'bakes' the token into the browser so it's sent automatically
            res.cookie("accessToken", access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // HTTPS only in prod
                sameSite: "strict", // Protection against CSRF
                maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
                path: "/",
            });

            console.log(`✅ [AUTH] User logged in: ${user.email}`);

            // 5. Return success (Notice we still return access_token for debugging, 
            // but the browser will primarily use the cookie)
            return res.status(HTTPSTATUS.OK).json({
                message: "Logged in successfully",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                },
                access_token, // Optional: useful if you want to store it in memory
            });
        })(req, res, next);
    }
);

