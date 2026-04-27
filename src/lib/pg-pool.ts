import { Pool } from 'pg';

// Direct PostgreSQL pool — bypasses PostgREST schema cache
// Used for inserts on tables that have columns added via ALTER TABLE
// (PostgREST cache doesn't pick up new columns until NOTIFY pgrst, 'reload schema' is run)
let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      host: 'aws-1-us-east-1.pooler.supabase.com',
      port: 5432,
      database: 'postgres',
      user: `postgres.${process.env.SUPABASE_URL?.match(/\/\/([^.]+)\./)?.[1] ?? ''}`,
      password: process.env.POSTGRES_PASSWORD,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}

export async function pgQuery<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  const pool = getPool();
  const { rows } = await pool.query(sql, params);
  return rows as T[];
}
