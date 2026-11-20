import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import { Request } from "express";

// Localhost is exempt from rate limiting only in development.
// In production every client is limited (requests come through the Next.js proxy,
// so the real IP is taken from X-Forwarded-For via "trust proxy" in index.ts).
const LOCAL_IPS = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);
const isDev = process.env.NODE_ENV !== "production";
const skipLocalInDev = (req: Request) => isDev && LOCAL_IPS.has(req.ip ?? "");

export const registerLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {error: "Too many registration tries, try again shortly"},
    skipSuccessfulRequests: false,
    skip: skipLocalInDev
    
})

export const loginLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {error: "Too many unsuccessful login tries, try again shortly"},
    skipSuccessfulRequests: true,
    skip: skipLocalInDev
})

export const getLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {error: "Timed out"},
    skipSuccessfulRequests: false,
    skip: skipLocalInDev
})

export const crudeLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: {error: "Timed out"},
    skipSuccessfulRequests: false,
    skip: skipLocalInDev
})

export const uploadLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many upload requests, try again later" },
    skipSuccessfulRequests: false,
    skip: skipLocalInDev
});