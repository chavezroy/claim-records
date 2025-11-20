import { Pool, QueryResult, QueryResultRow } from 'pg';

// Database connection pool
let pool: Pool | null = null;

// Log environment variable state for debugging
function logEnvVars() {
  const dbUrl = process.env.DATABASE_URL;
  const useMockData = process.env.USE_MOCK_DATA;
  const useMockAuth = process.env.USE_MOCK_AUTH;
  const nodeEnv = process.env.NODE_ENV;
  
  console.log('[DB] All env vars:', {
    USE_MOCK_DATA: useMockData || 'undefined',
    USE_MOCK_AUTH: useMockAuth || 'undefined',
    DATABASE_URL: dbUrl ? `Set (${dbUrl.length} chars)` : 'Not set',
    NODE_ENV: nodeEnv || 'undefined',
  });
}

export function getPool(): Pool {
  if (!pool) {
    logEnvVars();
    
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      console.error('[DB] DATABASE_URL is missing. Available env vars:', Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('NEXT')));
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    // Check if RDS or has SSL parameter
    const isRDS = connectionString.includes('rds.amazonaws.com');
    const hasSSLParam = connectionString.includes('sslmode');
    
    // Log connection info (without password) for debugging
    const connectionInfo = connectionString.replace(/:[^:@]+@/, ':****@');
    console.log('[DB] Initializing connection:', {
      isRDS,
      hasSSLParam,
      connectionInfo: connectionInfo.substring(0, 100) + '...',
    });

    const sslConfig = isRDS || hasSSLParam 
      ? { rejectUnauthorized: false } 
      : undefined;

    pool = new Pool({
      connectionString,
      ssl: sslConfig,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 30000, // Return an error after 30 seconds if connection cannot be established
    });

    // Handle pool errors
    pool.on('error', (err) => {
      console.error('[DB] Unexpected error on idle client', err);
      process.exit(-1);
    });
    
    console.log('[DB] Connection client created successfully');
  }

  return pool;
}

// Query helper function
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const pool = getPool();
  const start = Date.now();
  try {
    const res = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    console.log('[DB] Executed query', { text: text.substring(0, 100), duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('[DB] Database query error', { text: text.substring(0, 100), error });
    throw error;
  }
}

// Transaction helper
export async function transaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const pool = getPool();
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Close pool (useful for testing or graceful shutdown)
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// Health check - returns { connected: boolean, error?: string }
export async function healthCheck(): Promise<{ connected: boolean; error?: string }> {
  try {
    const result = await query('SELECT 1');
    console.log('[DB] Health check passed');
    return { connected: result.rowCount === 1 };
  } catch (error: any) {
    console.error('[DB] Health check failed', error);
    return { connected: false, error: error.message || String(error) };
  }
}

