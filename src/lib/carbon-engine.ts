/* ============================================================
 * Eco-Pulse — Carbon Engine (core calculation)
 *
 * SCI-aligned formula:
 *   Energy (kWh) = (cpuSeconds × PUE × TDP) / 3600 / 1000
 *   Carbon (gCO2e) = Energy (kWh) × Carbon Intensity (gCO2e/kWh)
 *
 * References:
 *   - Green Software Foundation SCI Specification
 *   - https://sci-guide.greensoftware.foundation
 * ============================================================ */

import type { CarbonImpactResult } from "./types";
import { getCarbonIntensity } from "./co2signal";

// ── Configurable Defaults ──────────────────────────────────

/** Power Usage Effectiveness — data center overhead (1.0 = perfect). */
const DEFAULT_PUE = 1.2;

/** Thermal Design Power in watts for a typical cloud vCPU. */
const DEFAULT_TDP_WATTS = 250;

/** Memory power draw in watts per GB. */
const MEMORY_WATTS_PER_GB = 0.3725;

// ── Public API ─────────────────────────────────────────────

/**
 * Calculate the estimated carbon impact of a compute workload.
 *
 * @param cpuSeconds  – CPU time consumed (e.g. CI build duration)
 * @param memoryMB    – Peak memory usage in megabytes
 * @param region      – Cloud region identifier (default: `us-east-1`)
 * @returns A `CarbonImpactResult` with gCO2e, kWh, intensity & green score.
 */
export async function calculateImpact(
    cpuSeconds: number,
    memoryMB: number,
    region: string = "us-east-1"
): Promise<CarbonImpactResult> {
    // 1. Fetch regional carbon intensity
    const { carbonIntensity } = await getCarbonIntensity(region);

    // 2. CPU energy (kWh)
    const cpuEnergyKwh =
        (cpuSeconds * DEFAULT_PUE * DEFAULT_TDP_WATTS) / 3_600 / 1_000;

    // 3. Memory energy (kWh)
    const memoryGB = memoryMB / 1_024;
    const memoryHours = cpuSeconds / 3_600; // same duration as CPU
    const memoryEnergyKwh =
        memoryGB * MEMORY_WATTS_PER_GB * memoryHours * DEFAULT_PUE / 1_000;

    // 4. Total energy
    const totalEnergyKwh = cpuEnergyKwh + memoryEnergyKwh;

    // 5. Carbon emissions
    const carbonGrams = totalEnergyKwh * carbonIntensity;

    // 6. Green Score (0–100): lower carbon → higher score
    //    Heuristic: MVP considers < 0.5 g perfect (100), > 50 g = 0
    const greenScore = Math.max(
        0,
        Math.min(100, Math.round(100 - (carbonGrams / 50) * 100))
    );

    return {
        carbonGrams: parseFloat(carbonGrams.toFixed(4)),
        energyKwh: parseFloat(totalEnergyKwh.toFixed(6)),
        carbonIntensity,
        greenScore,
        region,
    };
}
