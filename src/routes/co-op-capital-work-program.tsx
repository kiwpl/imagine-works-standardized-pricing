import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CoopInquiryForm } from "@/components/coop/CoopInquiryForm";

export const Route = createFileRoute("/co-op-capital-work-program")({
  head: () => ({
    meta: [
      { title: "Standardized Co-op Work Pricing | Imagine Work" },
      {
        name: "description",
        content:
          "Clear pricing ranges for common co-op renovation, repair, and capital work. A practical reference for budgeting unit turnovers, common-area work, and capital projects.",
      },
    ],
  }),
  component: CoopPage,
});

// ─── Pricing table data ────────────────────────────────────────────────────────

interface PricingRowData {
  icon: string;
  workType: string;
  scope: string;
  range: string;
  notes: string;
}

const pricingData: PricingRowData[] = [
  {
    icon: "🚿",
    workType: "Bathroom Refresh",
    scope: "Vanity, toilet, fixtures, mirror, accessories, paint, minor repairs",
    range: "$5,500–$9,500",
    notes: "Best for cosmetic updates without layout changes",
  },
  {
    icon: "🚿",
    workType: "Standard Bathroom Renovation",
    scope: "Demo, tub/shower, tile, vanity, toilet, fixtures, fan, paint",
    range: "$10,500–$19,000",
    notes: "Final price depends on waterproofing, tile, and site conditions",
  },
  {
    icon: "🍳",
    workType: "Kitchen Refresh",
    scope:
      "Cabinet repairs or selective replacement, countertop, sink, faucet, paint, minor flooring",
    range: "$6,500–$12,000",
    notes: "Best for practical updates without major layout changes",
  },
  {
    icon: "🍳",
    workType: "Standard Kitchen Renovation",
    scope: "Cabinets, countertop, sink, faucet, backsplash, flooring, paint",
    range: "$13,000–$21,000",
    notes: "Appliances, plumbing, and electrical changes priced separately",
  },
  {
    icon: "🏠",
    workType: "Unit Turnover — Light",
    scope: "Paint touch-ups, minor repairs, detailing, basic fixture replacement",
    range: "$1,500–$3,500",
    notes: "For units in generally good condition",
  },
  {
    icon: "🏠",
    workType: "Unit Turnover — Standard",
    scope: "Full paint, patching, fixture replacement, flooring touch-ups, minor corrections",
    range: "$5,000–$9,700",
    notes: "Common for move-outs before new occupancy",
  },
  {
    icon: "🏠",
    workType: "Unit Turnover — Heavy",
    scope: "Multiple repairs, paint, flooring, kitchen/bath touch-ups, damage correction",
    range: "$9,000–$18,000",
    notes: "For units needing more substantial work",
  },
  {
    icon: "🪵",
    workType: "Flooring Replacement",
    scope: "Remove existing flooring, install new flooring, trim/transition work",
    range: "$7–$13 / sq. ft.",
    notes: "Material, subfloor, and disposal affect price",
  },
  {
    icon: "🖌️",
    workType: "Wall and Ceiling Painting",
    scope: "Prep, patching, primer where needed, paint walls/ceilings",
    range: "$450–$850 / room",
    notes: "Common areas priced after walkthrough",
  },
  {
    icon: "🪜",
    workType: "Staircase Repair / Replacement",
    scope: "Repair, refinishing, tread/riser replacement, railing coordination",
    range: "Priced by scope",
    notes: "Site review required",
  },
  {
    icon: "🏢",
    workType: "Common Area Repairs",
    scope: "Drywall, doors, trim, patching, painting, minor interior repairs",
    range: "From $1,500",
    notes: "Can be bundled with other work",
  },
  {
    icon: "⚡",
    workType: "Electrical / EV Charger Work",
    scope: "Electrical upgrades, EV charger installation, licensed team coordination",
    range: "Priced by scope",
    notes: "Site assessment required",
  },
];

// ─── Pricing row with expandable image upload ──────────────────────────────────

function PricingTableRow({ row, index }: { row: PricingRowData; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <>
      <tr
        style={{
          borderBottom: "1px solid var(--border)",
          background: index % 2 === 0 ? "transparent" : "rgba(245, 237, 224, 0.3)",
        }}
      >
        {/* Work Type */}
        <td style={{ padding: "1rem 1.25rem", verticalAlign: "top" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "28px",
                height: "28px",
                background: "#C04A22",
                borderRadius: "6px",
                fontSize: "0.875rem",
                flexShrink: 0,
                marginTop: "2px",
              }}
            >
              {row.icon}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                color: "var(--charcoal)",
                fontSize: "0.9375rem",
              }}
            >
              {row.workType}
            </span>
          </div>
        </td>

        {/* Scope */}
        <td
          style={{
            padding: "1rem 1.25rem",
            verticalAlign: "top",
            fontFamily: "var(--font-body)",
            color: "var(--muted)",
            fontSize: "0.875rem",
            maxWidth: "240px",
          }}
        >
          {row.scope}
        </td>

        {/* Pricing Range */}
        <td style={{ padding: "1rem 1.25rem", verticalAlign: "top", whiteSpace: "nowrap" }}>
          <span
            style={{
              display: "inline-block",
              background: "#F5EDE0",
              border: "1px solid #D4C4B0",
              borderRadius: "9999px",
              padding: "0.25rem 0.875rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.8125rem",
              color: "var(--charcoal)",
              fontWeight: 500,
            }}
          >
            {row.range}
          </span>
        </td>

        {/* Notes */}
        <td
          style={{
            padding: "1rem 1.25rem",
            verticalAlign: "top",
            fontFamily: "var(--font-body)",
            color: "var(--muted)",
            fontSize: "0.875rem",
            maxWidth: "200px",
          }}
        >
          {row.notes}
        </td>

        {/* Toggle */}
        <td style={{ padding: "1rem 1.25rem", verticalAlign: "middle", textAlign: "center" }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: "1px solid var(--border)",
              background: expanded ? "#1C1814" : "transparent",
              color: expanded ? "#F5EDE0" : "var(--charcoal)",
              cursor: "pointer",
              fontSize: "1.125rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              fontFamily: "monospace",
              lineHeight: 1,
            }}
            aria-label={expanded ? "Collapse" : "Expand reference image"}
          >
            {expanded ? "−" : "+"}
          </button>
        </td>
      </tr>

      {/* Expanded image panel */}
      {expanded && (
        <tr style={{ background: "rgba(237, 224, 208, 0.4)" }}>
          <td colSpan={5} style={{ padding: "1.25rem 1.5rem" }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: "0.75rem",
                margin: "0 0 0.75rem",
              }}
            >
              Reference Image
            </p>

            {image ? (
              <div style={{ position: "relative", display: "inline-block" }}>
                <img
                  src={image}
                  alt="Reference"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "320px",
                    borderRadius: "8px",
                    display: "block",
                  }}
                />
                <button
                  onClick={() => {
                    setImage(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  style={{
                    position: "absolute",
                    top: "0.5rem",
                    right: "0.5rem",
                    background: "rgba(28, 24, 20, 0.7)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.15s",
                  }}
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
                style={{
                  border: "2px dashed var(--border)",
                  borderRadius: "8px",
                  padding: "2rem",
                  textAlign: "center",
                  cursor: "pointer",
                  background: "rgba(245, 237, 224, 0.5)",
                  maxWidth: "420px",
                }}
              >
                <Upload
                  size={24}
                  style={{ color: "var(--muted)", margin: "0 auto 0.5rem", display: "block" }}
                />
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--charcoal)",
                    fontSize: "0.9375rem",
                    margin: "0 0 0.25rem",
                  }}
                >
                  Drop an image or click to browse
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6875rem",
                    color: "var(--muted)",
                    margin: 0,
                    letterSpacing: "0.08em",
                  }}
                >
                  JPG · PNG · WEBP
                </p>
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Static section data ───────────────────────────────────────────────────────

const heroPills = [
  { icon: "🏠", label: "Unit turnovers" },
  { icon: "🚿", label: "Bathrooms" },
  { icon: "🍳", label: "Kitchens" },
  { icon: "🚪", label: "Hallways" },
  { icon: "🪜", label: "Stairwells" },
  { icon: "🪵", label: "Flooring" },
  { icon: "🖌️", label: "Painting" },
  { icon: "⚡", label: "Electrical / EV" },
];

const whatCanChange = [
  "Hidden water damage",
  "Plumbing or electrical deficiencies",
  "Material upgrades",
  "After-hours work",
  "Permit or inspection requirements",
  "Rotten subfloors or framing",
  "Asbestos or hazardous material concerns",
  "Occupied vs. vacant units",
  "Access or parking constraints",
];

const whatIsIncluded = [
  "Labour",
  "Basic disposal",
  "Project coordination",
  "Cleanup after work",
  "Standard materials",
  "Site protection",
  "Photo documentation where needed",
];

const hiddenConditionSteps = [
  {
    step: "01",
    title: "Document the issue",
    description: "Photos, notes, and a clear write-up of what was found on site.",
  },
  {
    step: "02",
    title: "Price the add-on",
    description:
      "Itemized cost for the additional work, kept in the same format as your pricing sheet.",
  },
  {
    step: "03",
    title: "Get approval before proceeding",
    description: "No extra work starts until the manager or board signs off.",
  },
];

const trustItems = [
  {
    icon: "🏢",
    title: "Built for multi-unit buildings",
    description:
      "Pricing is structured for co-ops, condos, and rental portfolios — not custom homes.",
  },
  {
    icon: "📋",
    title: "Shared with your team",
    description: "We send a clear pricing sheet your board and manager can review together.",
  },
  {
    icon: "⏱️",
    title: "Reply within 1–2 business days",
    description: "We'll confirm which ranges apply and what we still need to know.",
  },
  {
    icon: "✓",
    title: "No obligation",
    description: "Requesting a sheet does not commit your building to any work.",
  },
];

// ─── Shared style helpers ──────────────────────────────────────────────────────

const sectionLabel: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.6875rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#C04A22",
  marginBottom: "0.75rem",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

function CoopPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <SiteHeader />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section
        style={{
          backgroundImage: "url('/src/assets/bg_option5_blueprint.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          padding: "6rem 1.5rem 5rem",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {/* Badge */}
          <div style={{ marginBottom: "1.5rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "9999px",
                padding: "0.375rem 1rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                letterSpacing: "0.04em",
                color: "rgba(245,237,224,0.8)",
              }}
            >
              <span style={{ color: "#C04A22" }}>●</span>
              For Co-op Managers &amp; Boards
            </span>
          </div>

          {/* H1 */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              fontWeight: 600,
              lineHeight: 1.1,
              color: "#fff",
              margin: "0 0 1.25rem",
            }}
          >
            Standardized Co-op Work{" "}
            <em style={{ color: "#C04A22", fontStyle: "italic" }}>Pricing.</em>
          </h1>

          {/* Subhead */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontStyle: "italic",
              fontSize: "1.25rem",
              color: "rgba(245,237,224,0.85)",
              margin: "0 0 1rem",
              maxWidth: "600px",
            }}
          >
            Clear pricing ranges for common co-op renovation, repair, and capital work.
          </p>

          {/* Body */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "rgba(245,237,224,0.6)",
              margin: "0 0 2.5rem",
              maxWidth: "560px",
            }}
          >
            A practical reference for budgeting unit turnovers, common-area work, and capital
            projects across multi-unit buildings.
          </p>

          {/* CTAs */}
          <div
            style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap", marginBottom: "3rem" }}
          >
            <a
              href="#request-pricing-sheet"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                background: "#F5EDE0",
                color: "#1C1814",
                borderRadius: "9999px",
                padding: "0.75rem 1.5rem",
                fontFamily: "var(--font-display)",
                fontSize: "0.9375rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Request a Co-op Pricing Sheet →
            </a>
            <a
              href="#pricing-reference"
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "transparent",
                color: "rgba(245,237,224,0.85)",
                border: "1px solid rgba(245,237,224,0.25)",
                borderRadius: "9999px",
                padding: "0.75rem 1.5rem",
                fontFamily: "var(--font-display)",
                fontSize: "0.9375rem",
                fontWeight: 300,
                textDecoration: "none",
              }}
            >
              See pricing ranges
            </a>
          </div>

          {/* Pills 4×2 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "0.625rem",
              maxWidth: "680px",
            }}
          >
            {heroPills.map((pill) => (
              <div
                key={pill.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  padding: "0.625rem 0.875rem",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "22px",
                    height: "22px",
                    background: "#C04A22",
                    borderRadius: "5px",
                    fontSize: "0.75rem",
                    flexShrink: 0,
                  }}
                >
                  {pill.icon}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    color: "rgba(245,237,224,0.85)",
                    fontStyle: "italic",
                  }}
                >
                  {pill.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING TABLE ────────────────────────────────────────────────────── */}
      <section id="pricing-reference" style={{ background: "var(--cream)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={sectionLabel}>Pricing Reference</p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 600,
              color: "var(--charcoal)",
              margin: "0 0 2.5rem",
            }}
          >
            Common co-op work <em style={{ fontStyle: "italic", fontWeight: 300 }}>pricing ranges</em>
          </h2>

          <div
            style={{
              overflowX: "auto",
              borderRadius: "12px",
              border: "1px solid var(--border)",
              background: "#fff",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--border)",
                    background: "var(--sand)",
                  }}
                >
                  {["Work Type", "Typical Scope", "Pricing Range", "Notes", ""].map((col, i) => (
                    <th
                      key={i}
                      style={{
                        padding: "0.875rem 1.25rem",
                        textAlign: "left",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.6875rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--muted)",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pricingData.map((row, i) => (
                  <PricingTableRow key={i} row={row} index={i} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Footnote */}
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontStyle: "italic",
              fontSize: "0.8125rem",
              color: "var(--muted)",
              textAlign: "center",
              margin: "1.5rem auto 0",
              maxWidth: "700px",
            }}
          >
            Pricing shown is for budgeting purposes only. Final pricing depends on site conditions,
            scope, materials, access, and whether the unit is occupied or vacant. Hidden conditions
            are priced separately once identified and documented.
          </p>
        </div>
      </section>

      {/* ── WHAT CAN CHANGE / WHAT'S INCLUDED ───────────────────────────────── */}
      <section style={{ background: "var(--sand)", padding: "5rem 1.5rem" }}>
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          {/* Card 1 */}
          <div
            style={{
              background: "#FAF5EE",
              borderRadius: "14px",
              padding: "2rem 1.75rem",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  background: "#C04A22",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              >
                🔧
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "var(--charcoal)",
                  margin: 0,
                }}
              >
                What can change the price
              </h3>
            </div>
            <ul
              style={{
                margin: 0,
                padding: "0 0 0 1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {whatCanChange.map((item) => (
                <li
                  key={item}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    color: "var(--charcoal)",
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Card 2 */}
          <div
            style={{
              background: "#FAF5EE",
              borderRadius: "14px",
              padding: "2rem 1.75rem",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "32px",
                  height: "32px",
                  background: "#C04A22",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              >
                🕐
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "var(--charcoal)",
                  margin: 0,
                }}
              >
                What our pricing usually includes
              </h3>
            </div>
            <ul
              style={{
                margin: 0,
                padding: "0 0 0 1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {whatIsIncluded.map((item) => (
                <li
                  key={item}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    color: "var(--charcoal)",
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── HIDDEN CONDITIONS ────────────────────────────────────────────────── */}
      <section style={{ background: "var(--cream)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p style={sectionLabel}>Hidden Conditions</p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 600,
              color: "var(--charcoal)",
              margin: "0 0 1rem",
            }}
          >
            Surprises are handled the same way every time
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.0625rem",
              color: "var(--muted)",
              margin: "0 0 3rem",
              maxWidth: "560px",
            }}
          >
            Older co-op buildings can reveal issues once walls or floors are opened up. When that
            happens, we follow a simple, documented process so nothing moves forward without
            approval.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.25rem",
            }}
          >
            {hiddenConditionSteps.map((s) => (
              <div
                key={s.step}
                style={{
                  background: "#fff",
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "1.75rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Oversized italic step number */}
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "5rem",
                    fontStyle: "italic",
                    fontWeight: 300,
                    color: "rgba(192, 74, 34, 0.1)",
                    position: "absolute",
                    top: "-0.75rem",
                    right: "0.75rem",
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {s.step}
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.625rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#C04A22",
                    marginBottom: "0.5rem",
                    margin: "0 0 0.5rem",
                  }}
                >
                  STEP {s.step}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: "var(--charcoal)",
                    margin: "0 0 0.625rem",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9375rem",
                    color: "var(--muted)",
                    margin: 0,
                  }}
                >
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM SECTION ─────────────────────────────────────────────────────── */}
      <section id="request-pricing-sheet" style={{ background: "var(--sand)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <p style={sectionLabel}>Get Started</p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 600,
              color: "var(--charcoal)",
              margin: "0 0 0.75rem",
            }}
          >
            Request a Co-op Pricing Sheet
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.0625rem",
              color: "var(--muted)",
              margin: "0 0 3rem",
              maxWidth: "500px",
            }}
          >
            Send us your co-op details and the type of work you are planning. We&rsquo;ll help
            confirm which pricing ranges apply.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
              alignItems: "start",
            }}
          >
            {/* Trust card */}
            <div
              style={{
                background: "#FAF5EE",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "2rem",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1875rem",
                  fontWeight: 600,
                  color: "var(--charcoal)",
                  margin: "0 0 0.75rem",
                }}
              >
                We&rsquo;ll help confirm which pricing ranges apply to your building.
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9375rem",
                  color: "var(--muted)",
                  margin: "0 0 1.75rem",
                }}
              >
                Building-specific pricing may be shared through a private manager portal for easy
                access and future reference.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {trustItems.map((item) => (
                  <div key={item.title} style={{ display: "flex", gap: "0.875rem" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "32px",
                        height: "32px",
                        background: "#C04A22",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        flexShrink: 0,
                        marginTop: "0.125rem",
                      }}
                    >
                      {item.icon}
                    </span>
                    <div>
                      <p
                        style={{
                          fontFamily: "var(--font-display)",
                          fontWeight: 600,
                          fontSize: "0.9375rem",
                          color: "var(--charcoal)",
                          margin: "0 0 0.125rem",
                        }}
                      >
                        {item.title}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.875rem",
                          color: "var(--muted)",
                          margin: 0,
                        }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form card */}
            <div
              style={{
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "2rem",
              }}
            >
              <CoopInquiryForm />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
