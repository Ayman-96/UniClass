import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mryhaesisallssyiqjhe.supabase.co";
const supabaseKey = "sb_publishable_CWgmRhiDng-UMmkS8rFH7g_683uV3BE";

export const supabase = createClient(supabaseUrl, supabaseKey);
