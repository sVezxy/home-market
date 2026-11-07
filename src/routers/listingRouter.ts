import { Router } from "express";
import { zodValidation } from "../middleware/zodValidationMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";
import { ListingsQuerySchema, listingSchema, listingsParamSchema, updateListingSchema } from "../schemas/listingSchemas/listingSchemas";
import { getPage } from "../controllers/listingControllers/getPageController";
import { getListingById } from "../controllers/listingControllers/getListingController";
import { createListings } from "../controllers/listingControllers/createListingController";
import { deleteListing } from "../controllers/listingControllers/deleteListingController";
import { updateListing } from "../controllers/listingControllers/updateListingController";

const listingRouter = Router();

listingRouter.get("/", zodValidation(ListingsQuerySchema, "query"), getPage);
listingRouter.post("/create-product", authMiddleware, zodValidation(listingSchema), createListings);
listingRouter.get("/:id", zodValidation(listingsParamSchema, "params"), getListingById);
listingRouter.delete("/:id", authMiddleware, zodValidation(listingsParamSchema, "params"), deleteListing)
listingRouter.patch("/:id", authMiddleware, zodValidation(updateListingSchema, "body"), zodValidation(listingsParamSchema, "params"), updateListing)
export default listingRouter;
