import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// =====================================
// SUPABASE CONFIGURATION
// =====================================

const SUPABASE_URL = "https://pscgoxlsumstfpdzkkvy.supabase.co";

const SUPABASE_ANON_KEY =
"sb_publishable_ZWZBpQ8Pdp1Ewp2jKEtd-w_9p-OUjli";

// =====================================
// CREATE CLIENT
// =====================================

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    }
);

// =====================================
// STORAGE BUCKET
// =====================================

export const BUCKET_NAME = "club_media";

// =====================================
// EXPORT CLIENT
// =====================================

export default supabase;
