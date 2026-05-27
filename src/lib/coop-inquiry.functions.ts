import { createServerFn } from "@tanstack/react-start";

import { supabase } from "@/integrations/supabase/client";
import { coopInquirySchema } from "./coop-inquiry.schema";

export const submitCoopInquiry = createServerFn({ method: "POST" })
  .inputValidator(coopInquirySchema)
  .handler(async ({ data }) => {
    const { error } = await supabase.from("coop_inquiries").insert([
      {
        contact_name: data.contactName,
        contact_email: data.contactEmail,
        building_address: data.buildingAddress,
        number_of_units: data.numberOfUnits ?? null,
        role: data.role,
        work_categories: data.workCategories,
        additional_notes: data.additionalNotes ?? null,
      },
    ]);

    if (error) throw new Error(error.message);

    return { success: true };
  });
