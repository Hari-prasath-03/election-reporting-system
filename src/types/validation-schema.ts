import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createUserSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  display_name: z.string().min(1, "Display name is required"),
  role: z.enum(["admin", "informer", "user"], {
    message: "Role must be either admin or informer or user",
  }),
});

export const updateUserSchema = z.object({
  id: z.uuid("Invalid user ID"),
  display_name: z.string().min(1, "Display name is required"),
  role: z.enum(["admin", "informer", "user"], {
    message: "Role must be either admin or informer or user",
  }),
  email: z.email("Invalid email address").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
});

export const partySchema = z.object({
  name: z.string().min(2, "Party name must be at least 2 characters"),
  short_name: z.string().min(1, "Short name is required"),
  symbol_img: z.instanceof(File).optional(),
  color_code: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid color code"),
});

export const candidateSchema = z.object({
  name: z.string().min(2, "Candidate name must be at least 2 characters"),
  party_id: z.string().min(1, "Party is required"),
  constituency_id: z.string().min(1, "Constituency is required"),
  gender: z.enum(["Male", "Female", "Other"], {
    message: "Please select a valid gender",
  }),
  photo_img: z.instanceof(File).optional(),
});

export const countingCenterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  location_address: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
