import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sql = fs.readFileSync(path.join(__dirname, 'supabase_schema.sql'), 'utf-8');

// Split into individual statements, filter blanks
const statements = sql
  .split(/;\s*\n/)
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

const client = new Client({
  host: 'aws-1-us-east-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.hqjjipnxmpeyssjemvyy',
  password: '84FNYH1G409M0lxi',
  ssl: { rejectUnauthorized: false },
});

async function run() {
  await client.connect();
  console.log('✅ Connected to Supabase Postgres\n');

  let passed = 0;
  let failed = 0;
  const errors = [];

  for (const stmt of statements) {
    const preview = stmt.slice(0, 80).replace(/\n/g, ' ');
    try {
      await client.query(stmt);
      process.stdout.write('.');
      passed++;
    } catch (err) {
      failed++;
      errors.push({ stmt: preview, error: err.message });
      process.stdout.write('x');
    }
  }

  console.log('\n');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);

  if (errors.length) {
    console.log('\nFailed statements:');
    for (const e of errors) {
      console.log(`  → ${e.stmt.slice(0, 60)}...`);
      console.log(`    Error: ${e.error}\n`);
    }
  }

  await client.end();
  console.log('\n🎉 Schema run complete!');
}

run().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
