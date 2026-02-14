/* ============================================================
 * Eco-Pulse — PR Analysis Script
 * Executed by the GitHub Action to:
 *   1. Fetch changed files from the PR
 *   2. Estimate resource usage via heuristics
 *   3. Calculate carbon impact
 *   4. Post a scorecard comment on the PR
 *   5. Save the result to Supabase
 * ============================================================ */

import { Octokit } from "@octokit/rest";

// ── Import project modules (using relative paths for tsx) ──
import { calculateImpact } from "../src/lib/carbon-engine";
import { estimateResources } from "../src/lib/heuristics";
import type { FileChange } from "../src/lib/types";

// Use dynamic import for supabase to handle missing env vars gracefully
let supabase: Awaited<typeof import("../src/lib/supabase")>["supabase"] | null = null;

// ── Environment ────────────────────────────────────────────

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const PR_NUMBER = parseInt(process.env.PR_NUMBER ?? "0", 10);
const REPO_FULL_NAME = process.env.REPO_FULL_NAME ?? "";
const BRANCH_NAME = process.env.BRANCH_NAME ?? "";
const COMMIT_SHA = process.env.COMMIT_SHA ?? "";
const REGION = process.env.CLOUD_REGION ?? "us-east-1";

const [owner, repo] = REPO_FULL_NAME.split("/");

// ── Main ───────────────────────────────────────────────────

async function main() {
    console.log(`\n🌱 Eco-Pulse — Analyzing PR #${PR_NUMBER} on ${REPO_FULL_NAME}\n`);

    // 1. Init GitHub client
    const octokit = new Octokit({ auth: GITHUB_TOKEN });

    // 2. Fetch changed files
    const { data: files } = await octokit.pulls.listFiles({
        owner,
        repo,
        pull_number: PR_NUMBER,
        per_page: 100,
    });

    const fileChanges: FileChange[] = files.map((f) => ({
        filename: f.filename,
        additions: f.additions,
        deletions: f.deletions,
        changes: f.changes,
        status: f.status,
    }));

    console.log(`📄 Files changed: ${fileChanges.length}`);

    // 3. Estimate resources from heuristics
    const { cpuSeconds, memoryMB, totalLinesChanged } =
        estimateResources(fileChanges);

    console.log(`📏 Lines changed: ${totalLinesChanged}`);
    console.log(`⏱  Est. CPU seconds: ${cpuSeconds.toFixed(2)}`);
    console.log(`🧠 Est. Memory (MB): ${memoryMB.toFixed(0)}`);

    // 4. Calculate carbon impact
    const impact = await calculateImpact(cpuSeconds, memoryMB, REGION);

    console.log(`\n⚡ Energy: ${impact.energyKwh} kWh`);
    console.log(`🏭 Carbon: ${impact.carbonGrams} gCO2e`);
    console.log(`🌿 Green Score: ${impact.greenScore}/100`);

    // 5. Build the scorecard comment
    const scoreEmoji = getScoreEmoji(impact.greenScore);
    const scoreBadge = getScoreBadge(impact.greenScore);

    const comment = `
## 🌱 Eco-Pulse Carbon Scorecard ${scoreEmoji}

| Metric | Value |
|--------|-------|
| **Green Score** | ${scoreBadge} **${impact.greenScore}**/100 |
| **Carbon Footprint** | \`${impact.carbonGrams} gCO2e\` |
| **Energy Consumed** | \`${impact.energyKwh} kWh\` |
| **Carbon Intensity** | \`${impact.carbonIntensity} gCO2e/kWh\` (${impact.region}) |
| **Lines Changed** | \`${totalLinesChanged}\` |
| **Files Changed** | \`${fileChanges.length}\` |
| **Est. CPU Time** | \`${cpuSeconds.toFixed(2)}s\` |

${getScoreMessage(impact.greenScore)}

<details>
<summary>📁 File Breakdown</summary>

| File | +/- | Status |
|------|-----|--------|
${fileChanges
            .slice(0, 20)
            .map(
                (f) =>
                    `| \`${f.filename}\` | +${f.additions} / -${f.deletions} | ${f.status} |`
            )
            .join("\n")}
${fileChanges.length > 20 ? `\n_...and ${fileChanges.length - 20} more files_` : ""}

</details>

---
<sub>🌍 Powered by <b>Eco-Pulse</b> — Sustainability as Code | Region: ${impact.region}</sub>
`;

    // 6. Post comment on PR
    await octokit.issues.createComment({
        owner,
        repo,
        issue_number: PR_NUMBER,
        body: comment.trim(),
    });

    console.log("\n✅ Scorecard comment posted on PR.");

    // 7. Save to Supabase (best-effort)
    try {
        const supabaseMod = await import("../src/lib/supabase");
        supabase = supabaseMod.supabase;

        const { error } = await supabase.from("repository_footprints").insert({
            repo_name: REPO_FULL_NAME,
            branch: BRANCH_NAME,
            carbon_impact: impact.carbonGrams,
            commit_hash: COMMIT_SHA,
            lines_changed: totalLinesChanged,
            estimated_cpu_seconds: cpuSeconds,
            region: REGION,
            green_score: impact.greenScore,
        });

        if (error) {
            console.warn("⚠️  Supabase insert failed:", error.message);
        } else {
            console.log("💾 Result saved to Supabase.");
        }
    } catch {
        console.warn("⚠️  Supabase not configured — skipping save.");
    }
}

// ── Helpers ────────────────────────────────────────────────

function getScoreEmoji(score: number): string {
    if (score >= 90) return "🟢";
    if (score >= 70) return "🟡";
    if (score >= 50) return "🟠";
    return "🔴";
}

function getScoreBadge(score: number): string {
    if (score >= 90) return "🌳";
    if (score >= 70) return "🌿";
    if (score >= 50) return "🌱";
    return "🏭";
}

function getScoreMessage(score: number): string {
    if (score >= 90)
        return "> 🌳 **Excellent!** This PR has a minimal carbon footprint. Great green coding!";
    if (score >= 70)
        return "> 🌿 **Good.** This PR is relatively eco-friendly. Small improvements possible.";
    if (score >= 50)
        return "> 🌱 **Moderate.** Consider optimising large file changes or reducing build complexity.";
    return "> 🏭 **High Impact.** This PR has a significant carbon footprint. Consider splitting into smaller changes.";
}

// ── Execute ────────────────────────────────────────────────

main().catch((err) => {
    console.error("❌ Eco-Pulse analysis failed:", err);
    process.exit(1);
});
