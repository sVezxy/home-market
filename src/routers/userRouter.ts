import { Router } from "express";
import { zodValidation } from "../middleware/zodValidationMiddleware";
import { registerLimit } from "../middleware/rateLimit";
import { regController } from "../controllers/userControllers/regController";
import { regSchema } from "../schemas/userSchemas/regSchemas";


const userRouter = Router();

userRouter.post("/register", registerLimit , zodValidation(regSchema), regController);

export default userRouter