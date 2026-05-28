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
import { sendPricingRequestEmail } from "@/lib/send-pricing-request-email";

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

const optionalMark: React.CSSProperties = {
  color: "var(--muted)",
  fontWeight: 400,
};

const requiredMark: React.CSSProperties = {
  color: "#C04A22",
  marginLeft: "2px",
};

export function CoopInquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

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

      // Show success immediately — email must never affect this
      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }

    // Fire notification email completely outside the form try/catch.
    // Any failure here is logged but never surfaces to the user.
    try {
      void sendPricingRequestEmail({
        data: {
          name: data.contactName,
          email: data.contactEmail,
          phone: data.phone,
          propertyName: data.propertyName,
          role: data.role,
          numberOfUnits: data.numberOfUnits,
          workCategories: data.workCategories,
          message: data.message,
        },
      }).catch((err: unknown) => {
        console.error("[CoopInquiryForm] Email send failed:", err);
      });
    } catch (err: unknown) {
      console.error("[CoopInquiryForm] Email call failed synchronously:", err);
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
      {/* Name* */}
      <div>
        <label style={labelStyle}>
          Name<span style={requiredMark}>*</span>
        </label>
        <input
          {...register("contactName")}
          style={inputStyle}
          placeholder="Your name"
        />
        {errors.contactName && <p style={errorStyle}>{errors.contactName.message}</p>}
      </div>

      {/* Email* */}
      <div>
        <label style={labelStyle}>
          Email<span style={requiredMark}>*</span>
        </label>
        <input
          {...register("contactEmail")}
          type="email"
          style={inputStyle}
          placeholder="you@example.com"
        />
        {errors.contactEmail && <p style={errorStyle}>{errors.contactEmail.message}</p>}
      </div>

      {/* Phone (optional) */}
      <div>
        <label style={labelStyle}>
          Phone <span style={optionalMark}>(optional)</span>
        </label>
        <input
          {...register("phone")}
          type="tel"
          style={inputStyle}
          placeholder="e.g. 416-555-0100"
        />
      </div>

      {/* Co-op / property name* */}
      <div>
        <label style={labelStyle}>
          Co-op / property name<span style={requiredMark}>*</span>
        </label>
        <input
          {...register("propertyName")}
          style={inputStyle}
          placeholder="e.g. 123 Main Street Co-op"
        />
        {errors.propertyName && <p style={errorStyle}>{errors.propertyName.message}</p>}
      </div>

      {/* Role — managed via useState so "Other" can reveal a free-text input */}
      <div>
        <label style={labelStyle}>Role</label>
        <select
          value={selectedRole}
          onChange={(e) => {
            const val = e.target.value;
            setSelectedRole(val);
            setValue("role", val === "" ? undefined : val, { shouldValidate: true });
          }}
          style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
        >
          <option value="" disabled>
            Select your role
          </option>
          {roleList.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {selectedRole === "Other" && (
          <input
            {...register("otherRoleText")}
            style={{ ...inputStyle, marginTop: "0.5rem" }}
            placeholder="Please describe your role"
          />
        )}
      </div>

      {/* Number of units (optional) */}
      <div>
        <label style={labelStyle}>
          Number of units <span style={optionalMark}>(optional)</span>
        </label>
        <input
          {...register("numberOfUnits")}
          type="number"
          min="1"
          style={inputStyle}
          placeholder="e.g. 24"
        />
      </div>

      {/* Work categories — 2-column grid */}

      {/* Work categories — 2-column grid */}
      <div>
        <label style={labelStyle}>Work categories needed</label>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            color: "var(--muted)",
            margin: "0 0 0.5rem",
          }}
        >
          Select any that apply.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.5rem 1rem",
          }}
        >
          {workCategoryList.map((cat) => (
            <label
              key={cat}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                color: "var(--charcoal)",
              }}
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                style={{
                  accentColor: "#C04A22",
                  width: "15px",
                  height: "15px",
                  cursor: "pointer",
                  flexShrink: 0,
                  marginTop: "3px",
                }}
              />
              {cat}
            </label>
          ))}
        </div>
        {errors.workCategories && (
          <p style={errorStyle}>{errors.workCategories.message}</p>
        )}
      </div>

      {/* Message (optional) */}
      <div>
        <label style={labelStyle}>
          Message <span style={optionalMark}>(optional)</span>
        </label>
        <textarea
          {...register("message")}
          style={{ ...inputStyle, minHeight: "96px", resize: "vertical" }}
          placeholder="Anything specific about your building, scope, or board process?"
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
