import brickBg from "@/assets/bg_option3_brick.png";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundImage: `url(${brickBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      {/* Semi-transparent overlay to keep text readable over the brick texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.45)",
          pointerEvents: "none",
        }}
      />

      {/* Content sits above the overlay */}
      <div
        style={{
          position: "relative",
          padding: "3.5rem 1.5rem",
        }}
      >
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
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Mark */}
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                background: "#C04A22",
                fontFamily: "var(--font-mono)",
                fontWeight: 500,
                fontSize: "11px",
                color: "#fff",
                letterSpacing: "-0.5px",
                flexShrink: 0,
              }}
            >
              IW
            </span>
            {/* Wordmark */}
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
              color: "rgba(245, 237, 224, 0.75)",
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
              borderTop: "1px solid rgba(255, 255, 255, 0.12)",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <a
              href="#request-pricing-sheet"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "rgba(245, 237, 224, 0.7)",
                textDecoration: "none",
                letterSpacing: "0.03em",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#F5EDE0")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245, 237, 224, 0.7)")}
            >
              Contact us
            </a>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                color: "rgba(245, 237, 224, 0.45)",
                margin: 0,
                letterSpacing: "0.03em",
              }}
            >
              © {year} Imagine Work. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
