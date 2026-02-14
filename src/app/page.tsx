import Link from "next/link";

const FEATURES = [
  {
    icon: "⚡",
    title: "Carbon Calculation",
    description:
      "SCI-aligned formula estimates energy use and CO₂ emissions from every pull request.",
  },
  {
    icon: "🤖",
    title: "Automated Scorecards",
    description:
      "GitHub Actions post a Green Score comment on every PR — zero manual work.",
  },
  {
    icon: "📊",
    title: "Live Dashboard",
    description:
      "Track carbon savings over time and see which repos lead the green leaderboard.",
  },
  {
    icon: "🌍",
    title: "Regional Intensity",
    description:
      "CO2Signal API fetches real-time grid carbon intensity for your cloud region.",
  },
];

const STATS = [
  { value: "< 1 min", label: "Setup Time" },
  { value: "100%", label: "Free Tier" },
  { value: "SCI", label: "Standard" },
  { value: "∞", label: "Repos Supported" },
];

export default function HomePage() {
  return (
    <div className="bg-grid" style={{ minHeight: "100vh" }}>
      {/* ── Hero Section ──────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "100px 24px 80px",
          textAlign: "center",
        }}
      >
        {/* Gradient orb */}
        <div
          style={{
            position: "absolute",
            top: -200,
            left: "50%",
            transform: "translateX(-50%)",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(56,189,148,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="animate-fade-in-up"
          style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}
        >
          <span className="glow-badge" style={{ marginBottom: 24, display: "inline-flex" }}>
            🌱 Sustainability as Code
          </span>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginTop: 16,
            }}
          >
            Know the{" "}
            <span className="gradient-text">carbon cost</span>
            <br />
            of every commit
          </h1>

          <p
            style={{
              fontSize: "1.15rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              maxWidth: 540,
              margin: "24px auto 0",
            }}
          >
            Eco-Pulse calculates the estimated CO₂ footprint of your code
            changes and posts a Green Score on every pull request — fully
            automated via GitHub Actions.
          </p>

          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              marginTop: 40,
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/dashboard"
              style={{
                padding: "14px 32px",
                borderRadius: 999,
                background: "var(--gradient-brand)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.95rem",
                textDecoration: "none",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 20px rgba(56, 189, 148, 0.3)",
              }}
            >
              View Dashboard →
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "14px 32px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-secondary)",
                fontWeight: 500,
                fontSize: "0.95rem",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
            >
              GitHub Repo
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 24px 60px",
        }}
      >
        <div
          className="glass-card"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            textAlign: "center",
            padding: "28px 16px",
          }}
        >
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="stat-value gradient-text">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "0 24px 100px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "1.75rem",
            fontWeight: 700,
            marginBottom: 48,
          }}
        >
          How it works
        </h2>

        <div
          className="stagger"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="glass-card animate-fade-in-up"
              style={{
                padding: 28,
                opacity: 0,
              }}
            >
              <span
                style={{
                  fontSize: 36,
                  display: "block",
                  marginBottom: 14,
                }}
              >
                {feature.icon}
              </span>
              <h3
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────────── */}
      <section
        style={{
          textAlign: "center",
          padding: "60px 24px 100px",
        }}
      >
        <div
          className="glass-card animate-pulse-glow"
          style={{
            maxWidth: 600,
            margin: "0 auto",
            padding: "48px 32px",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            Ready to go green? 🌿
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: 28,
              fontSize: "0.95rem",
            }}
          >
            Add the Eco-Pulse GitHub Action to your repo in under a minute.
          </p>
          <Link
            href="/dashboard"
            style={{
              padding: "14px 36px",
              borderRadius: 999,
              background: "var(--gradient-brand)",
              color: "#fff",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(56, 189, 148, 0.3)",
            }}
          >
            Explore Dashboard →
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer
        style={{
          textAlign: "center",
          padding: "24px",
          borderTop: "1px solid var(--border-subtle)",
          color: "var(--text-muted)",
          fontSize: "0.75rem",
        }}
      >
        <p>
          🌱 Eco-Pulse · Sustainability as Code · Built with 💚 and Next.js
        </p>
      </footer>
    </div>
  );
}
