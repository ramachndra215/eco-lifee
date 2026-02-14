/* ============================================================
 * Eco-Pulse — Shared TypeScript Types
 * ============================================================ */

/** Row shape for the `repository_footprints` Supabase table. */
export interface RepositoryFootprint {
    id: string;
    repo_name: string;
    branch: string;
    carbon_impact: number;   // grams CO2 equivalent
    commit_hash: string;
    timestamp: string;        // ISO 8601
    lines_changed: number;
    estimated_cpu_seconds: number;
    region: string;
    green_score: number;      // 0–100, higher = greener
}

/** Result returned by the carbon engine calculation. */
export interface CarbonImpactResult {
    carbonGrams: number;      // gCO2e
    energyKwh: number;        // kWh consumed
    carbonIntensity: number;  // gCO2e per kWh (regional)
    greenScore: number;       // 0–100
    region: string;
}

/** Data returned from the CO2Signal API. */
export interface CarbonIntensityData {
    carbonIntensity: number;  // gCO2e per kWh
    fossilFuelPercentage: number;
    region: string;
}

/** Shape for a file change in a PR diff. */
export interface FileChange {
    filename: string;
    additions: number;
    deletions: number;
    changes: number;
    status: string;           // "added" | "modified" | "removed" | "renamed"
}

/** Leaderboard entry for dashboard. */
export interface LeaderboardEntry {
    repo_name: string;
    total_carbon: number;
    avg_green_score: number;
    commit_count: number;
}
