import { Router } from "express";
<<<<<<< HEAD
import { zodValidation } from "../middleware/zodValidationMiddleware";
import { ListingsQuerySchema } from "../schemas/listingSchemas/listingSchemas";
import { getListings } from "../controllers/listingControllers/listingController";

const listingRouter = Router();

listingRouter.get("/", zodValidation(ListingsQuerySchema, "query"), getListings);

export default listingRouter;
=======
import { authMiddleware } from "../middleware/authMiddleware";
import { createListings } from "../controllers/listingControllers/createListingController";
import { zodValidation } from "../middleware/zodValidationMiddleware";
import { listingSchema } from "../schemas/listingSchemas/listingSchemas";

const listingRouter = Router();

listingRouter.post("/create-product", authMiddleware, zodValidation(listingSchema) , createListings);

export default listingRouter
>>>>>>> c1331e1cf9f15a9fad239bf812d4ba768f0d3d5b
