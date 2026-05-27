export function SiteHeader() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "#F5EDE0",
        borderBottom: "0.5px solid #D4C4B0",
        padding: "0 1.5rem",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Logo */}
        <a
          href="/co-op-capital-work-program"
          style={{ display: "flex", alignItems: "center", gap: "0.375rem", textDecoration: "none" }}
        >
          <span style={{ color: "#C04A22", fontSize: "1rem", lineHeight: 1 }}>●</span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "#1C1814",
            }}
          >
            Imagine Work
          </span>
        </a>

        {/* Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
          <a
            href="#pricing-reference"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "#7A6A58",
              textDecoration: "none",
              letterSpacing: "0.03em",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#1C1814")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7A6A58")}
          >
            Pricing
          </a>
          <a
            href="#pricing-reference"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "#7A6A58",
              textDecoration: "none",
              letterSpacing: "0.03em",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#1C1814")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7A6A58")}
          >
            Scope
          </a>
          <a
            href="#request-pricing-sheet"
            style={{
              display: "inline-flex",
              alignItems: "center",
              background: "#1C1814",
              color: "#F5EDE0",
              borderRadius: "9999px",
              padding: "0.5rem 1.125rem",
              fontFamily: "var(--font-display)",
              fontSize: "0.875rem",
              fontWeight: 600,
              textDecoration: "none",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Get a pricing sheet
          </a>
        </nav>
      </div>
    </header>
  );
}
