import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "cookie-session";
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "./config/http.config";
import passport from "passport";
import "./config/passport.config";
import authRoutes from "./routes/auth.route";

const app = express();
const BASE_PATH = config.BASE_PATH;

// This middleware looks at incoming requests where the Content-Type is 'application/json'.
// It parses the raw JSON string from the request body into a JavaScript object,
// allowing you to access data via 'req.body' (e.g., req.body.username).
app.use(express.json());

// This middleware parses incoming requests with URL-encoded payloads (usually from HTML <form> tags).
// The 'extended: true' option allows for parsing complex, nested objects using the 'qs' library 
// instead of the simpler 'querystring' library (extended: false).
app.use(express.urlencoded({ extended: true }));



app.use(passport.initialize());


app.use(
    cors({
        origin: config.FRONTEND_ORIGIN,
        credentials: true,
    })
);

app.get('/',
    asyncHandler(async(req:Request, res:Response, next:NextFunction)=>{
        return res.status(HTTPSTATUS.OK).json({
            message:"Welcome to AI Finance APP"
        })
    })
);

app.use(`${BASE_PATH}/auth`, authRoutes);

app.use(errorHandler)

app.listen(config.PORT, async () => {
    console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
    await connectDatabase()
});