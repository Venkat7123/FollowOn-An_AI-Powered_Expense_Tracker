import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_KEY;
const supabaseServiceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
    console.error("Missing Supabase environment variables. Please check your .env file.");
    console.error("URL present:", !!supabaseUrl);
    console.error("Anon key present:", !!supabaseAnonKey);
    console.error("Service role key present:", !!supabaseServiceRoleKey);
}

// Regular client for authenticated requests
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client with service role key for bypassing RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
