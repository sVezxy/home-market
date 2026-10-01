import { Router } from "express";
import { zodValidation } from "../middleware/zodValidationMiddleware";
import { ListingsQuerySchema } from "../schemas/listingSchemas/listingSchemas";
import { getListings } from "../controllers/listingControllers/listingController";

const listingRouter = Router();

listingRouter.get("/", zodValidation(ListingsQuerySchema, "query"), getListings);

export default listingRouter;