/* ============================================================
 * Eco-Pulse — LOC-Based Heuristics
 * Estimates CPU seconds & memory usage from a code diff.
 * ============================================================ */

import type { FileChange } from "./types";

/**
 * Weight multipliers by file extension.
 * Higher = more compute-intensive to build/test/deploy.
 */
const EXTENSION_WEIGHTS: Record<string, number> = {
    // Compiled / heavy workloads
    ts: 1.0,
    tsx: 1.0,
    js: 0.9,
    jsx: 0.9,
    py: 0.8,
    rs: 1.2,
    go: 1.1,
    java: 1.1,
    cpp: 1.3,
    c: 1.2,

    // Lighter workloads
    css: 0.3,
    scss: 0.3,
    html: 0.2,
    json: 0.1,
    yaml: 0.1,
    yml: 0.1,
    md: 0.05,
    txt: 0.05,
    svg: 0.05,
};

/** Baseline: 1 LOC ≈ 0.005 CPU-seconds of CI build time. */
const CPU_SECONDS_PER_LOC = 0.005;

/** Baseline: 1 LOC ≈ 0.02 MB memory during build. */
const MEMORY_MB_PER_LOC = 0.02;

/** Extract a file's extension (lowercase, no dot). */
function getExtension(filename: string): string {
    const parts = filename.split(".");
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

/**
 * Estimate the compute resources required by a set of file changes.
 *
 * @returns `{ cpuSeconds, memoryMB }` – approximate CI resource usage.
 */
export function estimateResources(files: FileChange[]): {
    cpuSeconds: number;
    memoryMB: number;
    totalLinesChanged: number;
} {
    let weightedLines = 0;
    let totalLines = 0;

    for (const file of files) {
        const ext = getExtension(file.filename);
        const weight = EXTENSION_WEIGHTS[ext] ?? 0.5; // unknown ext → mid-weight
        const lines = file.additions + file.deletions;
        weightedLines += lines * weight;
        totalLines += lines;
    }

    return {
        cpuSeconds: Math.max(1, weightedLines * CPU_SECONDS_PER_LOC),
        memoryMB: Math.max(64, weightedLines * MEMORY_MB_PER_LOC),
        totalLinesChanged: totalLines,
    };
}
