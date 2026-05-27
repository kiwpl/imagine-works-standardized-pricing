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
  "Co-op Board Member",
  "Property Manager",
  "Managing Agent",
  "Architect / Consultant",
  "Other",
] as const;

export const coopInquirySchema = z.object({
  contactName: z.string().min(1, "Name is required"),
  contactEmail: z.string().email("Valid email required"),
  buildingAddress: z.string().min(1, "Building address is required"),
  numberOfUnits: z.string().optional(),
  role: z.enum(roleList, { required_error: "Please select your role" }),
  workCategories: z.array(z.string()).min(1, "Select at least one work category"),
  additionalNotes: z.string().optional(),
});

export type CoopInquiryFormData = z.infer<typeof coopInquirySchema>;
