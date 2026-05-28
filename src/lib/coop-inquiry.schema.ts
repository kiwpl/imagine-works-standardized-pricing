import { z } from "zod";

export const workCategoryList = [
  "Bathroom renovations",
  "Kitchen renovations",
  "Unit turnovers",
  "Flooring replacement",
  "Wall and ceiling painting",
  "Staircase repair and replacement",
  "Common-area repairs",
  "Electrical and EV charger work",
] as const;

export const roleList = [
  "Property Manager",
  "Board Member",
  "Superintendent",
  "Other",
] as const;

  timeline: z.string().optional(),
  contactName: z.string().min(1, "Name is required"),
  contactEmail: z.string().email("Valid email required"),
  phone: z.string().optional(),
  propertyName: z.string().min(1, "Co-op / property name is required"),
  role: z.string().optional(),
  otherRoleText: z.string().optional(),
  numberOfUnits: z.string().optional(),
  timeline: z.string().optional(),
  workCategories: z.array(z.string()).min(1, "Select at least one work category"),
  message: z.string().optional(),
});

export type CoopInquiryFormData = z.infer<typeof coopInquirySchema>;
