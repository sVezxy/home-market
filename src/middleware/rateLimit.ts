import rateLimit from "express-rate-limit";

export const registerLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {error: "Too many tries, try after 15 minut limit"},
    skipSuccessfulRequests: false,
    keyGenerator: (req) => req.body.email,
    skip: (req) => req.ip === '127.0.0.1'
    
})