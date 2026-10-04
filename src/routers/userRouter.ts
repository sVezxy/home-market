import { Router } from "express";
import { zodValidation } from "../middleware/zodValidationMiddleware";
import { registerLimit } from "../middleware/rateLimit";
import { regController } from "../controllers/userControllers/regController";
import { regSchema } from "../schemas/userSchemas/regSchemas";
import { loginScheme } from "../schemas/userSchemas/loginSchemas";
import { loginController } from  "../controllers/userControllers/loginController";
import { authMiddleware } from "../middleware/authMiddleware";
import { getProfile } from "../controllers/userControllers/getProfile";
import { idParamsSchema } from "../schemas/userSchemas/userSchema";
import { getProfileById } from "../controllers/userControllers/getProfileById";

const userRouter = Router();

userRouter.post("/register", registerLimit , zodValidation(regSchema), regController);
userRouter.post("/login", registerLimit, zodValidation(loginScheme), loginController);
userRouter.get("/me", authMiddleware, (req, res) =>{
    return res.status(201).json({message: "You are authorised", user: req.user});
});
userRouter.get("/profile", authMiddleware, getProfile);
userRouter.get("/profile/:id", zodValidation(idParamsSchema, "params"), getProfileById);

export default userRouter