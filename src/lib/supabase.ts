/* ============================================================
 * Eco-Pulse — Supabase Client
 * ============================================================ */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseKey) {
    console.warn(
        "[Eco-Pulse] Missing Supabase env vars. " +
        "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
