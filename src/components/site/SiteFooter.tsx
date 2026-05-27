export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "#1C1814", padding: "3.5rem 1.5rem" }}>
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* Logo */}
        <div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "#F5EDE0",
            }}
          >
            Imagine <em style={{ fontStyle: "italic", fontWeight: 300 }}>Work</em>
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontStyle: "italic",
            fontSize: "0.9375rem",
            color: "rgba(245, 237, 224, 0.55)",
            margin: 0,
            maxWidth: "440px",
          }}
        >
          Renovation and capital work support for co-ops, condos, and property managers.
        </p>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "1.5rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <a
            href="#request-pricing-sheet"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              color: "rgba(245, 237, 224, 0.6)",
              textDecoration: "none",
              letterSpacing: "0.03em",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F5EDE0")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245, 237, 224, 0.6)")}
          >
            Contact us
          </a>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              color: "rgba(245, 237, 224, 0.35)",
              margin: 0,
              letterSpacing: "0.03em",
            }}
          >
            © {year} Imagine Work. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
