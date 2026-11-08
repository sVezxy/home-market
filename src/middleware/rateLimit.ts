import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import { Request } from "express";

export const registerLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {error: "Too many registration tries, try again shortly"},
    skipSuccessfulRequests: false,
    skip: (req) => req.ip === '127.0.0.1'
    
})

export const loginLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {error: "Too many unsuccessful login tries, try again shortly"},
    skipSuccessfulRequests: true,
    skip: (req) => req.ip === '127.0.0.1'
})

export const getLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {error: "Timed out"},
    skipSuccessfulRequests: false,
    skip: (req) => req.ip === '127.0.0.1'
})

export const crudeLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: {error: "Timed out"},
    skipSuccessfulRequests: false,
    skip: (req) => req.ip === '127.0.0.1'
})

export const uploadLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many upload requests, try again later" },
    skipSuccessfulRequests: false,
    skip: (req) => req.ip === '127.0.0.1'
});