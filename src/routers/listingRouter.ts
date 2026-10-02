import { Router } from "express";
import { zodValidation } from "../middleware/zodValidationMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";
import { ListingsQuerySchema, listingSchema, listingsParamSchema } from "../schemas/listingSchemas/listingSchemas";
import { getPage } from "../controllers/listingControllers/getPageController";
import { getListing } from "../controllers/listingControllers/getListingController";
import { createListings } from "../controllers/listingControllers/createListingController";

const listingRouter = Router();

listingRouter.get("/", zodValidation(ListingsQuerySchema, "query"), getPage);
listingRouter.post("/create-product", authMiddleware, zodValidation(listingSchema), createListings);
listingRouter.get("/:id", zodValidation(listingsParamSchema, "params"), getListing);

export default listingRouter;
