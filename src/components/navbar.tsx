"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav
            style={{
                position: "sticky",
                top: 0,
                zIndex: 50,
                backdropFilter: "blur(16px)",
                background: "rgba(5, 10, 20, 0.8)",
                borderBottom: "1px solid var(--border-subtle)",
            }}
        >
            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: "0 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: 64,
                }}
            >
                {/* Logo */}
                <Link
                    href="/"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        textDecoration: "none",
                    }}
                >
                    <span style={{ fontSize: 28 }}>🌱</span>
                    <span
                        className="gradient-text"
                        style={{
                            fontSize: "1.25rem",
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Eco-Pulse
                    </span>
                </Link>

                {/* Links */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    padding: "8px 18px",
                                    borderRadius: 999,
                                    fontSize: "0.875rem",
                                    fontWeight: 500,
                                    textDecoration: "none",
                                    transition: "all 0.2s",
                                    background: isActive
                                        ? "rgba(56, 189, 148, 0.12)"
                                        : "transparent",
                                    color: isActive
                                        ? "var(--accent-green-light)"
                                        : "var(--text-secondary)",
                                    border: isActive
                                        ? "1px solid rgba(56, 189, 148, 0.2)"
                                        : "1px solid transparent",
                                }}
                            >
                                {link.label}
                            </Link>
                        );
                    })}

                    {/* GitHub link */}
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 36,
                            height: 36,
                            borderRadius: 999,
                            background: "rgba(255,255,255,0.05)",
                            color: "var(--text-secondary)",
                            textDecoration: "none",
                            transition: "all 0.2s",
                            marginLeft: 8,
                        }}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                    </a>
                </div>
            </div>
        </nav>
    );
}
