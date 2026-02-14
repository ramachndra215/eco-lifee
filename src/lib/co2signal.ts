/* ============================================================
 * Eco-Pulse — CO2Signal API Client
 * Fetches real-time carbon intensity for a given electricity grid.
 * Free tier: https://www.co2signal.com
 * ============================================================ */

import type { CarbonIntensityData } from "./types";

// Global average fallback (gCO2e/kWh) when API is unavailable
const FALLBACK_INTENSITY = 400;

// Map common cloud regions → ISO country/zone codes for CO2Signal
const REGION_MAP: Record<string, string> = {
    "us-east-1": "US-NY",
    "us-east-2": "US-OH",
    "us-west-1": "US-CAL-CISO",
    "us-west-2": "US-NW-PACW",
    "eu-west-1": "IE",
    "eu-west-2": "GB",
    "eu-central-1": "DE",
    "ap-south-1": "IN-WE",
    "ap-southeast-1": "SG",
    "ap-northeast-1": "JP-TK",
    "ca-central-1": "CA-ON",
    "sa-east-1": "BR-CS",
};

/**
 * Fetch the real‑time carbon intensity for a cloud region.
 * Falls back gracefully to a global average if the API key is
 * missing or the request fails.
 */
export async function getCarbonIntensity(
    region: string = "us-east-1"
): Promise<CarbonIntensityData> {
    const apiKey = process.env.CO2SIGNAL_API_KEY;
    const zone = REGION_MAP[region] ?? "US-NY";

    // If no API key is configured, return the fallback immediately
    if (!apiKey) {
        console.warn("[CO2Signal] No API key — using fallback intensity.");
        return {
            carbonIntensity: FALLBACK_INTENSITY,
            fossilFuelPercentage: 60,
            region,
        };
    }

    try {
        const res = await fetch(
            `https://api.co2signal.com/v1/latest?countryCode=${zone}`,
            {
                headers: { "auth-token": apiKey },
                next: { revalidate: 3600 }, // cache for 1 h in Next.js
            }
        );

        if (!res.ok) {
            throw new Error(`CO2Signal API responded with ${res.status}`);
        }

        const data = await res.json();

        return {
            carbonIntensity: data.data?.carbonIntensity ?? FALLBACK_INTENSITY,
            fossilFuelPercentage: data.data?.fossilFuelPercentage ?? 60,
            region,
        };
    } catch (error) {
        console.error("[CO2Signal] API error — using fallback:", error);
        return {
            carbonIntensity: FALLBACK_INTENSITY,
            fossilFuelPercentage: 60,
            region,
        };
    }
}
