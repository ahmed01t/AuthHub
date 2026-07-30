import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";    
import ratelimit from "express-rate-limit";
import authRouter from "./src/routes/auth.routes.js";
import errorHandler from "./src/middlewares/error.middleware.js";
//AUTH ROUTER IS AN EXPRESS ROUTER OBJEXT AND IT CONTAIN ALL THE ROUTES RELATED TO AUTHENTICATION AND AUTHORIZATION, SUCH AS REGISTER, LOGIN, LOGOUT, REFRESH TOKEN, FORGOT PASSWORD, RESET PASSWORD, ETC. IT IS IMPORTED FROM THE auth.routes.js FILE AND USED IN THE APP TO HANDLE REQUESTS TO THE /api/v1/auth ENDPOINT.
const app = express();

app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
));
    
app.use(cookieParser());
// helmet protection against cross-site scripting (XSS) attacks by setting various HTTP headers
app.use(helmet());
// limit the size of incoming request bodies to prevent denial-of-service (DoS) attacks
app.use(express.json({limit: "16kb"}));
//means in simple words that the server can handle requests with URL-encoded data, such as form submissions, and it will parse the data into a format that can be easily accessed in the request object. The extended: true option allows for rich objects and arrays to be encoded into the URL-encoded format, while the limit: "16kb" option restricts the size of the incoming request body to 16 kilobytes, which helps prevent denial-of-service (DoS) attacks by limiting the amount of data that can be sent in a single request.
app.use(express.urlencoded({extended: true, limit: "16kb"}));

// protection against brute-force attacks and denial-of-service attacks  from too many requests from the same IP address
const limiter = ratelimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use(limiter);

app.use("/api/v1/auth", authRouter);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "success", message: "API is healthy" });
})

app.use(errorHandler);

export default app;