import { Router } from "express";
import { zodValidation } from "../middleware/zodValidationMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";
import { ListingsQuerySchema, listingSchema, listingsParamSchema, updateListingSchema } from "../schemas/listingSchemas/listingSchemas";
import { getPage } from "../controllers/listingControllers/getPageController";
import { getListingById } from "../controllers/listingControllers/getListingController";
import { createListings } from "../controllers/listingControllers/createListingController";
import { deleteListing } from "../controllers/listingControllers/deleteListingController";
import { updateListing } from "../controllers/listingControllers/updateListingController";
import { uploadLimit } from "../middleware/rateLimit";
import { uploadPhotosMiddleware } from "../middleware/uploadMiddleware";
import { uploadPhotos } from "../controllers/listingControllers/uploadPhotosController";
import { requireRole } from "../middleware/authRoleMiddleware";
import { crudeLimit, getLimit, } from "../middleware/rateLimit";
import { getCategories } from "../controllers/listingControllers/getCategoriesController";
const listingRouter = Router();

listingRouter.get("/", getLimit, zodValidation(ListingsQuerySchema, "query"), getPage);
listingRouter.post("/create-product", crudeLimit, authMiddleware, requireRole("USER", "ADMIN"), zodValidation(listingSchema), createListings);
listingRouter.get("/categories", getLimit, getCategories);
listingRouter.get("/:id", getLimit, zodValidation(listingsParamSchema, "params"), getListing);
listingRouter.delete("/:id", crudeLimit, authMiddleware, zodValidation(listingsParamSchema, "params"), deleteListing)
listingRouter.patch("/:id", crudeLimit, authMiddleware, zodValidation(updateListingSchema, "body"), zodValidation(listingsParamSchema, "params"), updateListing)
export default listingRouter;
listingRouter.post("/upload-photos", uploadLimit, authMiddleware, requireRole("USER", "ADMIN"), uploadPhotosMiddleware, uploadPhotos);