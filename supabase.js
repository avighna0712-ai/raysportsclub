import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// =====================================
// SUPABASE CONFIGURATION
// =====================================

const SUPABASE_URL = "https://gznqtbcnsuibfqesxnhl.supabase.co";

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bnF0YmNuc3VpYmZxZXN4bmhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4ODk5MzQsImV4cCI6MjEwMDQ2NTkzNH0.CJEMlV_3cwSTjLNS-R8y3-UJSEuOlOL33I8q7fApH_k";

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
