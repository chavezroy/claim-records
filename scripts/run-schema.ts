import { readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';

async function runSchema() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  console.log('Connecting to database...');
  const pool = new Pool({
    connectionString: databaseUrl,
  });

  try {
    const client = await pool.connect();
    console.log('Connected successfully!');

    // Read schema file
    const schemaPath = join(process.cwd(), 'lib', 'db', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    console.log('Running schema...');
    await client.query(schema);
    
    console.log('Schema applied successfully!');
    client.release();
    await pool.end();
  } catch (error) {
    console.error('Error running schema:', error);
    process.exit(1);
  }
}

runSchema();

