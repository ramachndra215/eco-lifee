"use client";

import type { LeaderboardEntry } from "@/lib/types";

interface LeaderboardProps {
    entries: LeaderboardEntry[];
}

const MEDALS = ["🥇", "🥈", "🥉"];

function getScoreColor(score: number): string {
    if (score >= 90) return "var(--accent-green-light)";
    if (score >= 70) return "var(--accent-emerald)";
    if (score >= 50) return "var(--accent-amber)";
    return "var(--accent-red)";
}

export default function Leaderboard({ entries }: LeaderboardProps) {
    if (entries.length === 0) {
        return (
            <div
                className="glass-card"
                style={{
                    padding: 40,
                    textAlign: "center",
                    color: "var(--text-muted)",
                }}
            >
                <span style={{ fontSize: 48, display: "block", marginBottom: 12 }}>
                    🏆
                </span>
                <p style={{ fontSize: "1rem" }}>
                    Leaderboard is empty. Analyze some PRs!
                </p>
            </div>
        );
    }

    return (
        <div className="glass-card" style={{ overflow: "hidden" }}>
            <div
                style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid var(--border-subtle)",
                }}
            >
                <h3
                    style={{
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        margin: 0,
                    }}
                >
                    🏆 Greenest Repositories
                </h3>
                <p
                    style={{
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)",
                        marginTop: 4,
                    }}
                >
                    Ranked by average Green Score
                </p>
            </div>

            <div style={{ overflowX: "auto" }}>
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "0.85rem",
                    }}
                >
                    <thead>
                        <tr
                            style={{
                                borderBottom: "1px solid var(--border-subtle)",
                            }}
                        >
                            {["Rank", "Repository", "Avg Score", "Total CO₂", "Commits"].map(
                                (header) => (
                                    <th
                                        key={header}
                                        style={{
                                            padding: "12px 16px",
                                            textAlign: "left",
                                            color: "var(--text-muted)",
                                            fontWeight: 600,
                                            fontSize: "0.7rem",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.08em",
                                        }}
                                    >
                                        {header}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry, i) => (
                            <tr
                                key={entry.repo_name}
                                style={{
                                    borderBottom: "1px solid var(--border-subtle)",
                                    transition: "background 0.2s",
                                }}
                                onMouseEnter={(e) =>
                                (e.currentTarget.style.background =
                                    "rgba(56, 189, 148, 0.04)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = "transparent")
                                }
                            >
                                <td
                                    style={{
                                        padding: "14px 16px",
                                        fontSize: "1.1rem",
                                        width: 60,
                                    }}
                                >
                                    {MEDALS[i] ?? `#${i + 1}`}
                                </td>
                                <td
                                    style={{
                                        padding: "14px 16px",
                                        fontWeight: 500,
                                        color: "var(--text-primary)",
                                    }}
                                >
                                    <code
                                        style={{
                                            padding: "3px 8px",
                                            borderRadius: 6,
                                            background: "rgba(255,255,255,0.05)",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        {entry.repo_name}
                                    </code>
                                </td>
                                <td style={{ padding: "14px 16px" }}>
                                    <span
                                        style={{
                                            fontWeight: 700,
                                            color: getScoreColor(entry.avg_green_score),
                                        }}
                                    >
                                        {Math.round(entry.avg_green_score)}
                                    </span>
                                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                                        /100
                                    </span>
                                </td>
                                <td
                                    style={{
                                        padding: "14px 16px",
                                        color: "var(--text-secondary)",
                                        fontFamily: "var(--font-mono)",
                                        fontSize: "0.8rem",
                                    }}
                                >
                                    {entry.total_carbon.toFixed(2)} g
                                </td>
                                <td
                                    style={{
                                        padding: "14px 16px",
                                        color: "var(--text-secondary)",
                                    }}
                                >
                                    {entry.commit_count}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
