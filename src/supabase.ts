import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if(!supabaseKey || !supabaseUrl){
    throw new Error("Missing supabase values!")
}

export const supabase = createClient(supabaseUrl, supabaseKey,{
    auth:{
        persistSession: false, //browser redument
        autoRefreshToken: false,
    },
});