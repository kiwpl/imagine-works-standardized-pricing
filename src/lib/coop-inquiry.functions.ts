import { createServerFn } from "@tanstack/react-start";

import { supabase } from "@/integrations/supabase/client";
import { coopInquirySchema } from "./coop-inquiry.schema";

export const submitCoopInquiry = createServerFn({ method: "POST" })
  .inputValidator(coopInquirySchema)
  .handler(async ({ data }) => {
    const effectiveRole =
      data.role === "Other"
        ? (data.otherRoleText ?? "Other")
        : (data.role ?? null);

    const { error } = await supabase.from("coop_inquiries").insert([
      {
        contact_name: data.contactName,
        contact_email: data.contactEmail,
        phone: data.phone ?? null,
        property_name: data.propertyName,
        role: effectiveRole,
        number_of_units: data.numberOfUnits ?? null,
        timeline: data.timeline ?? null,
        work_categories: data.workCategories,
        message: data.message ?? null,
      },
    ]);

    if (error) throw new Error(error.message);

    return { success: true };
  });
