import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  coopInquirySchema,
  workCategoryList,
  roleList,
  type CoopInquiryFormData,
} from "@/lib/coop-inquiry.schema";
import { submitCoopInquiry } from "@/lib/coop-inquiry.functions";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.625rem 0.875rem",
  background: "var(--cream)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  fontFamily: "var(--font-body)",
  fontSize: "0.9375rem",
  color: "var(--charcoal)",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-display)",
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "var(--charcoal)",
  marginBottom: "0.375rem",
};

const errorStyle: React.CSSProperties = {
  color: "#C04A22",
  fontSize: "0.75rem",
  marginTop: "0.25rem",
  fontFamily: "var(--font-body)",
};

export function CoopInquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CoopInquiryFormData>({
    resolver: zodResolver(coopInquirySchema),
    defaultValues: { workCategories: [] },
  });

  const selectedCategories = watch("workCategories") ?? [];

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setValue(
        "workCategories",
        selectedCategories.filter((c) => c !== cat),
        { shouldValidate: true },
      );
    } else {
      setValue("workCategories", [...selectedCategories, cat], { shouldValidate: true });
    }
  };

  const onSubmit = async (data: CoopInquiryFormData) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitCoopInquiry({ data });
      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        style={{
          padding: "2.5rem",
          textAlign: "center",
          background: "#fff",
          borderRadius: "12px",
        }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "0.75rem", color: "#22c55e" }}>✓</div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontStyle: "italic",
            color: "var(--charcoal)",
            fontSize: "1.0625rem",
            margin: 0,
          }}
        >
          Thanks. We received your request and will review the details shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
    >
      {/* Contact Name */}
      <div>
        <label style={labelStyle}>Your Name</label>
        <input {...register("contactName")} style={inputStyle} placeholder="e.g. Sarah Chen" />
        {errors.contactName && <p style={errorStyle}>{errors.contactName.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label style={labelStyle}>Email Address</label>
        <input
          {...register("contactEmail")}
          type="email"
          style={inputStyle}
          placeholder="you@example.com"
        />
        {errors.contactEmail && <p style={errorStyle}>{errors.contactEmail.message}</p>}
      </div>

      {/* Building Address */}
      <div>
        <label style={labelStyle}>Building Address</label>
        <input
          {...register("buildingAddress")}
          style={inputStyle}
          placeholder="123 Main St, New York, NY 10001"
        />
        {errors.buildingAddress && <p style={errorStyle}>{errors.buildingAddress.message}</p>}
      </div>

      {/* Number of Units */}
      <div>
        <label style={labelStyle}>
          Approx. Number of Units{" "}
          <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span>
        </label>
        <input {...register("numberOfUnits")} style={inputStyle} placeholder="e.g. 24" />
      </div>

      {/* Role */}
      <div>
        <label style={labelStyle}>Your Role</label>
        <select
          {...register("role")}
          style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
          defaultValue=""
        >
          <option value="" disabled>
            Select your role
          </option>
          {roleList.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        {errors.role && <p style={errorStyle}>{errors.role.message}</p>}
      </div>

      {/* Work Categories */}
      <div>
        <label style={labelStyle}>Work You&rsquo;re Planning</label>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            marginTop: "0.375rem",
          }}
        >
          {workCategoryList.map((cat) => (
            <label
              key={cat}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: "0.9375rem",
                color: "var(--charcoal)",
              }}
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                style={{
                  accentColor: "#C04A22",
                  width: "16px",
                  height: "16px",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              />
              {cat}
            </label>
          ))}
        </div>
        {errors.workCategories && <p style={errorStyle}>{errors.workCategories.message}</p>}
      </div>

      {/* Additional Notes */}
      <div>
        <label style={labelStyle}>
          Additional Notes{" "}
          <span style={{ color: "var(--muted)", fontWeight: 400 }}>(optional)</span>
        </label>
        <textarea
          {...register("additionalNotes")}
          style={{ ...inputStyle, minHeight: "96px", resize: "vertical" }}
          placeholder="Any specific details about the work, timeline, or building conditions..."
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        style={{
          background: submitting ? "var(--muted)" : "var(--charcoal)",
          color: "var(--cream)",
          border: "none",
          borderRadius: "9999px",
          padding: "0.875rem 2rem",
          fontFamily: "var(--font-display)",
          fontSize: "1rem",
          fontWeight: 600,
          cursor: submitting ? "not-allowed" : "pointer",
          transition: "background 0.2s",
          letterSpacing: "0.01em",
        }}
      >
        {submitting ? "Sending…" : "Request a Co-op Pricing Sheet"}
      </button>

      {submitError && (
        <p style={{ ...errorStyle, textAlign: "center" }}>{submitError}</p>
      )}

      <p
        style={{
          fontSize: "0.75rem",
          color: "var(--muted)",
          textAlign: "center",
          fontFamily: "var(--font-body)",
          margin: 0,
        }}
      >
        We respond within two business days. Your details are only used to prepare your pricing
        sheet.
      </p>
    </form>
  );
}
