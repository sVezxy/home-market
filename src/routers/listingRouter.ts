import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createListings } from "../controllers/listingControllers/createListingController";
import { zodValidation } from "../middleware/zodValidationMiddleware";
import { listingSchema } from "../schemas/listingSchemas/listingSchemas";

const listingRouter = Router();

listingRouter.post("/create-product", authMiddleware, zodValidation(listingSchema) , createListings);

export default listingRouter