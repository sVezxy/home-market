import { z } from 'zod';
import { constantCatch } from 'zod/v4/core/util.cjs';

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

export const listingSchema = z.strictObject({
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

  area: z.int()
  .max(1000),

  photos: z.array(photoUrlSchema)
    .max(10, "Maximum of 10 photos allowed")
    .refine((urls) => new Set(urls).size === urls.length, {
      message: "Photos must not contain duplicates",
    }),

}).superRefine((data, ctx) => {
  if (data.deposit && (!data.depositAmount || data.depositAmount <= 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Deposit amount is required and must be greater than 0 when deposit is true",
      path: ["depositAmount"],
    });
  }

  if (!data.deposit && data.depositAmount && data.depositAmount > 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Deposit amount must be empty or 0 when deposit is false",
      path: ["depositAmount"],
    });
  }
});

export const ListingsQuerySchema = z.object({
  page: z.coerce.number().int()
  .min(1)
  .default(1),
  limit: z.coerce.number().int()
  .min(1)
  .max(50)
  .default(10)
});

export const listingsParamSchema = z.object({
  id: z.string().uuid("Invalid uuid")
});