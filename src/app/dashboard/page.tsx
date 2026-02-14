"use client";

import { useEffect, useState } from "react";
import CarbonChart from "@/components/carbon-chart";
import Leaderboard from "@/components/leaderboard";
import type { RepositoryFootprint, LeaderboardEntry } from "@/lib/types";

/* ── Seed data for demo (used when Supabase isn't configured) ── */

const SEED_FOOTPRINTS: RepositoryFootprint[] = [
    { id: "1", repo_name: "eco-pulse/web", branch: "main", carbon_impact: 2.34, commit_hash: "a1b2c3d", timestamp: "2026-02-01T10:00:00Z", lines_changed: 120, estimated_cpu_seconds: 15, region: "us-east-1", green_score: 95 },
    { id: "2", repo_name: "eco-pulse/web", branch: "feat/dashboard", carbon_impact: 5.12, commit_hash: "e4f5g6h", timestamp: "2026-02-03T14:30:00Z", lines_changed: 340, estimated_cpu_seconds: 42, region: "us-east-1", green_score: 90 },
    { id: "3", repo_name: "eco-pulse/api", branch: "main", carbon_impact: 8.76, commit_hash: "i7j8k9l", timestamp: "2026-02-05T09:15:00Z", lines_changed: 580, estimated_cpu_seconds: 68, region: "eu-west-1", green_score: 83 },
    { id: "4", repo_name: "eco-pulse/web", branch: "fix/perf", carbon_impact: 1.05, commit_hash: "m0n1o2p", timestamp: "2026-02-07T16:45:00Z", lines_changed: 45, estimated_cpu_seconds: 8, region: "us-east-1", green_score: 98 },
    { id: "5", repo_name: "eco-pulse/cli", branch: "main", carbon_impact: 12.40, commit_hash: "q3r4s5t", timestamp: "2026-02-08T11:00:00Z", lines_changed: 890, estimated_cpu_seconds: 95, region: "ap-south-1", green_score: 75 },
    { id: "6", repo_name: "eco-pulse/api", branch: "feat/auth", carbon_impact: 3.22, commit_hash: "u6v7w8x", timestamp: "2026-02-09T08:20:00Z", lines_changed: 200, estimated_cpu_seconds: 28, region: "eu-west-1", green_score: 94 },
    { id: "7", repo_name: "eco-pulse/web", branch: "main", carbon_impact: 6.88, commit_hash: "y9z0a1b", timestamp: "2026-02-10T13:10:00Z", lines_changed: 410, estimated_cpu_seconds: 51, region: "us-east-1", green_score: 86 },
    { id: "8", repo_name: "eco-pulse/cli", branch: "feat/scan", carbon_impact: 4.55, commit_hash: "c2d3e4f", timestamp: "2026-02-12T15:30:00Z", lines_changed: 260, estimated_cpu_seconds: 33, region: "ap-south-1", green_score: 91 },
];

function buildLeaderboard(data: RepositoryFootprint[]): LeaderboardEntry[] {
    const map = new Map<string, { total: number; scores: number[]; count: number }>();

    for (const row of data) {
        const existing = map.get(row.repo_name) ?? { total: 0, scores: [], count: 0 };
        existing.total += Number(row.carbon_impact);
        existing.scores.push(row.green_score);
        existing.count += 1;
        map.set(row.repo_name, existing);
    }

    return Array.from(map.entries())
        .map(([repo_name, val]) => ({
            repo_name,
            total_carbon: val.total,
            avg_green_score:
                val.scores.reduce((a, b) => a + b, 0) / val.scores.length,
            commit_count: val.count,
        }))
        .sort((a, b) => b.avg_green_score - a.avg_green_score);
}

/* ── Stat Card ─────────────────────────────────────────── */

function StatCard({
    icon,
    value,
    label,
    color,
}: {
    icon: string;
    value: string;
    label: string;
    color?: string;
}) {
    return (
        <div className="glass-card" style={{ padding: "24px 20px" }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                }}
            >
                <span
                    style={{
                        fontSize: 24,
                        width: 42,
                        height: 42,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 10,
                        background: "rgba(56, 189, 148, 0.1)",
                    }}
                >
                    {icon}
                </span>
                <span className="stat-label" style={{ margin: 0 }}>
                    {label}
                </span>
            </div>
            <div className="stat-value" style={{ color: color ?? "var(--text-primary)" }}>
                {value}
            </div>
        </div>
    );
}

/* ── Dashboard Page ────────────────────────────────────── */

export default function DashboardPage() {
    const [footprints, setFootprints] = useState<RepositoryFootprint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                // Try loading from Supabase
                const { supabase } = await import("@/lib/supabase");
                const { data, error } = await supabase
                    .from("repository_footprints")
                    .select("*")
                    .order("timestamp", { ascending: true })
                    .limit(100);

                if (!error && data && data.length > 0) {
                    setFootprints(data as RepositoryFootprint[]);
                } else {
                    // Fall back to seed data
                    setFootprints(SEED_FOOTPRINTS);
                }
            } catch {
                // Supabase not configured — use seed data
                setFootprints(SEED_FOOTPRINTS);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const leaderboard = buildLeaderboard(footprints);

    const totalCarbon = footprints.reduce(
        (sum, f) => sum + Number(f.carbon_impact),
        0
    );
    const avgScore =
        footprints.length > 0
            ? Math.round(
                footprints.reduce((s, f) => s + f.green_score, 0) /
                footprints.length
            )
            : 0;

    function getScoreColorClass(score: number) {
        if (score >= 90) return "score-excellent";
        if (score >= 70) return "score-good";
        if (score >= 50) return "score-moderate";
        return "score-poor";
    }

    return (
        <div
            className="bg-grid"
            style={{ minHeight: "100vh", padding: "40px 24px 80px" }}
        >
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                {/* Header */}
                <div style={{ marginBottom: 36 }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            marginBottom: 8,
                        }}
                    >
                        <h1
                            style={{
                                fontSize: "1.75rem",
                                fontWeight: 700,
                                margin: 0,
                            }}
                        >
                            Dashboard
                        </h1>
                        <span className="glow-badge">
                            {loading ? "Loading…" : `${footprints.length} commits`}
                        </span>
                    </div>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                        Track the carbon footprint of your software development lifecycle.
                    </p>
                </div>

                {/* Stat Cards */}
                <div
                    className="stagger"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: 16,
                        marginBottom: 32,
                    }}
                >
                    <StatCard
                        icon="🏭"
                        label="Total CO₂"
                        value={`${totalCarbon.toFixed(1)}g`}
                        color="var(--accent-amber)"
                    />
                    <StatCard
                        icon="🌿"
                        label="Avg Green Score"
                        value={`${avgScore}`}
                        color={`var(--accent-${avgScore >= 80 ? "green-light" : avgScore >= 60 ? "emerald" : "amber"})`}
                    />
                    <StatCard
                        icon="📄"
                        label="PRs Analyzed"
                        value={`${footprints.length}`}
                    />
                    <StatCard
                        icon="📦"
                        label="Repositories"
                        value={`${leaderboard.length}`}
                    />
                </div>

                {/* Chart */}
                <div style={{ marginBottom: 32 }}>
                    <CarbonChart data={footprints} />
                </div>

                {/* Leaderboard */}
                <Leaderboard entries={leaderboard} />

                {/* Seed notice */}
                <div
                    style={{
                        marginTop: 32,
                        textAlign: "center",
                        padding: 20,
                        borderRadius: "var(--radius)",
                        background: "rgba(56, 189, 148, 0.05)",
                        border: "1px dashed var(--border-subtle)",
                        color: "var(--text-muted)",
                        fontSize: "0.8rem",
                    }}
                >
                    💡 Showing {footprints === SEED_FOOTPRINTS ? "demo seed" : "live"}{" "}
                    data.{" "}
                    {footprints === SEED_FOOTPRINTS &&
                        "Connect Supabase and push PRs to see real results."}
                </div>
            </div>
        </div>
    );
}
