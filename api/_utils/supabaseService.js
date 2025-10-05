const { createClient } = require('@supabase/supabase-js');


const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;


if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
console.warn('Supabase env missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}


const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
auth: { persistSession: false }
});


module.exports = { supabaseAdmin };
