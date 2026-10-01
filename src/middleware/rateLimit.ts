import { rateLimit, ipKeyGenerator } from "express-rate-limit";
export const registerLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {error: "Too many registration tries, try after 15 minut limit"},
    skipSuccessfulRequests: false,
    skip: (req) => req.ip === '127.0.0.1'
    
})

export const loginLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {error: "Too many unsuccessful login tries, try again shortly"},
    skipSuccessfulRequests: true,
    keyGenerator: (req) => String(req.body?.email ?? '').toLowerCase().trim() || ipKeyGenerator(req.ip) || "unknown",
    skip: (req) => req.ip === '127.0.0.1'
})