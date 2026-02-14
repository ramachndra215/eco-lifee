"use client";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import type { RepositoryFootprint } from "@/lib/types";

interface CarbonChartProps {
    data: RepositoryFootprint[];
}

export default function CarbonChart({ data }: CarbonChartProps) {
    const chartData = data.map((d) => ({
        date: new Date(d.timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        }),
        carbon: Number(d.carbon_impact),
        greenScore: d.green_score,
    }));

    if (chartData.length === 0) {
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
                    📊
                </span>
                <p style={{ fontSize: "1rem" }}>
                    No data yet. Push a PR to start tracking!
                </p>
            </div>
        );
    }

    return (
        <div className="glass-card" style={{ padding: "24px 20px 16px" }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20,
                    paddingLeft: 4,
                }}
            >
                <div>
                    <h3
                        style={{
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            margin: 0,
                        }}
                    >
                        Carbon Impact Over Time
                    </h3>
                    <p
                        style={{
                            fontSize: "0.8rem",
                            color: "var(--text-secondary)",
                            marginTop: 4,
                        }}
                    >
                        gCO₂e per commit
                    </p>
                </div>
                <span className="glow-badge">Live</span>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={chartData}
                    margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                    <defs>
                        <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#38bd94" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#38bd94" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(56, 189, 148, 0.06)"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="date"
                        stroke="var(--text-muted)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="var(--text-muted)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border-subtle)",
                            borderRadius: "var(--radius)",
                            boxShadow: "var(--shadow-card)",
                            fontSize: "0.8rem",
                        }}
                        labelStyle={{ color: "var(--text-secondary)", marginBottom: 4 }}
                        itemStyle={{ color: "var(--accent-green-light)" }}
                    />
                    <Area
                        type="monotone"
                        dataKey="carbon"
                        name="Carbon (gCO₂e)"
                        stroke="#38bd94"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorCarbon)"
                        dot={{ r: 4, fill: "#38bd94", strokeWidth: 0 }}
                        activeDot={{
                            r: 6,
                            fill: "#56e8b8",
                            stroke: "rgba(56, 189, 148, 0.4)",
                            strokeWidth: 3,
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
