require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const tables = ['chat_messages', 'documents', 'audit_logs', 'cases', 'users'];
const zeroUuid = '00000000-0000-0000-0000-000000000000';

async function countTable(table) {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
  if (error) throw new Error(`${table} count failed: ${error.message}`);
  return count || 0;
}

async function deleteTable(table) {
  const { error, count } = await supabase.from(table).delete({ count: 'exact' }).neq('id', zeroUuid);
  if (error) throw new Error(`${table} delete failed: ${error.message}`);
  return count || 0;
}

(async () => {
  console.log('Before cleanup:');
  for (const table of tables) {
    console.log(`${table}: ${await countTable(table)}`);
  }

  console.log('\nDeleting all demo/login data...');
  for (const table of tables) {
    console.log(`${table}: deleted ${await deleteTable(table)}`);
  }

  console.log('\nAfter cleanup:');
  for (const table of tables) {
    console.log(`${table}: ${await countTable(table)}`);
  }
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
