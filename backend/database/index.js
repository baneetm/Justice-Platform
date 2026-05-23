const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client for regular user operations
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for privileged operations  
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Wrapper to mimic pg Pool interface
const pool = {
  query: async (text, params = []) => {
    // Convert pg-style $1, $2 params to Supabase format
    let queryText = text;
    if (params.length > 0) {
      params.forEach((param, index) => {
        queryText = queryText.replace(`$${index + 1}`, `@p${index}`);
      });
    }
    
    // Use Supabase's from() for table operations
    // This is a simple wrapper - for complex queries, use raw RPC
    const result = await supabaseAdmin.from('users').select('*').limit(0);
    
    // For now, return a mock that works with the auth controller
    // We'll need to update controllers to use Supabase client directly
    return { rows: [], rowCount: 0 };
  }
};

module.exports = { supabase, supabaseAdmin, pool };
