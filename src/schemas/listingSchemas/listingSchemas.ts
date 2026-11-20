import { uuid, z } from 'zod';

const photoUrlSchema = z
  .string()
  .url("Invalid photo URL format")
  .refine((url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }, { message: "Photo URL must use HTTPS protocol" });

const coordinatesSchema = (name: string, limit: number) => {
  return z
    .number()
    .min(-limit, `${name} must be between -${limit} and ${limit}`)
    .max(limit, `${name} must be between -${limit} and ${limit}`)
}

// Base shape shared by create and update; refinements are added separately,
// because Zod v4 does not allow .partial() on a schema that already has refinements.
const listingBaseSchema = z.strictObject({
  categoryId: z.string().uuid("Invalid category ID format"),

  name: z.string()
    .trim()
    .min(5, "Name is too short (minimum 5 characters)")
    .max(100, "Name is too long (maximum 100 characters)"),

  description: z.string()
    .trim()
    .min(20, "Description is too short (minimum 20 characters)")
    .max(500, "Description is too long (maximum 500 characters)"),

  price: z.number().int("Price must be an integer")
    .positive("Price must be greater than zero")
    .max(1000000, "Price exceeds the maximum allowed value"),

  deposit: z.boolean(),

  depositAmount: z.number().int("Deposit amount must be an integer")
    .nonnegative("Deposit amount cannot be negative")
    .max(1000000, "Deposit amount exceeds the maximum allowed value")
    .optional()
    .nullable(),

  latitude: coordinatesSchema("Latitude", 90),

  longitude: coordinatesSchema("Longitude", 180),

  street: z.string()
    .trim()
    .min(2, "Street name is too short")
    .max(100, "Street name is too long"),

  streetNumber: z.string()
    .trim()
    .min(1, "Street number is required")
    .max(20, "Street number is too long"),

  amenities: z.array(z.string().trim().min(1).max(50))
    .max(30, "Maximum of 30 amenities allowed")
    .refine((items) => new Set(items).size === items.length, {
      message: "Amenities list must not contain duplicates",
    }),

  isShared: z.boolean(),

  countPeople: z.number().int()
    .min(1, "Must allow at least 1 person")
    .max(15, "Too many people (maximum 15 allowed)"),

  countRoom: z.number().int()
    .min(1, "Must have at least 1 room")
    .max(10, "Too many rooms (maximum 10 allowed)"),

  allowedGender: z.enum(["ANY", "ONLY_MALE", "ONLY_FEMALE"], {
    message: "Invalid gender option. Allowed values: ANY, ONLY_MALE, ONLY_FEMALE",
  }),

  area: z.number()
  .int("Must be an integer")
  .positive("Area must be greater than zero")
  .max(1000),

  photos: z.array(photoUrlSchema)
    .max(10, "Maximum of 10 photos allowed")
    .refine((urls) => new Set(urls).size === urls.length, {
      message: "Photos must not contain duplicates",
    }),

});

type DepositFields = { deposit?: boolean; depositAmount?: number | null };

const depositRefine = (data: DepositFields, ctx: z.RefinementCtx) => {
  if (data.deposit === true && (!data.depositAmount || data.depositAmount <= 0)) {
    ctx.addIssue({
      code: "custom",
      message: "Deposit amount is required and must be greater than 0 when deposit is true",
      path: ["depositAmount"],
    });
  }

  if (data.deposit === false && data.depositAmount && data.depositAmount > 0) {
    ctx.addIssue({
      code: "custom",
      message: "Deposit amount must be empty or 0 when deposit is false",
      path: ["depositAmount"],
    });
  }
};

export const listingSchema = listingBaseSchema.superRefine(depositRefine);

export const ListingsQuerySchema = z.object({
  page: z.coerce.number().int()
  .min(1)
  .default(1),
  limit: z.coerce.number().int()
  .min(1)
  .max(50)
  .default(10),
  search: z.string().trim().max(100).optional(),
  categoryId: z.string().uuid().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional()
});

export const listingsParamSchema = z.object({
  id: z.string().uuid("Invalid uuid"),
});

// Same rules as creation, but every field is optional (partial update)
export const updateListingSchema = listingBaseSchema.partial().superRefine(depositRefine);

export const listingStatusSchema = z.strictObject({
  status: z.enum(["ACTIVE", "BANNED"], {
    message: "Invalid status. Allowed values: ACTIVE, BANNED",
  }),
});
