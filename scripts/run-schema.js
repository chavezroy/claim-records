const { readFileSync } = require('fs');
const { join } = require('path');
const { Pool } = require('pg');

// Read .env.local file
function loadEnv() {
  try {
    const envContent = readFileSync('.env.local', 'utf-8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        process.env[key] = value;
      }
    });
  } catch (error) {
    console.error('Could not read .env.local file');
  }
}

loadEnv();

async function runSchema() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('DATABASE_URL not found in environment variables');
    console.error('Make sure .env.local exists and contains DATABASE_URL');
    process.exit(1);
  }

  console.log('Connecting to database...');
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false // For AWS RDS, this is typically needed
    }
  });

  try {
    const client = await pool.connect();
    console.log('Connected successfully!');

    // Read schema file
    const schemaPath = join(process.cwd(), 'lib', 'db', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    console.log('Running schema...');
    
    // Remove comment lines but preserve structure for dollar-quoted strings
    const lines = schema.split('\n');
    const cleanedLines = lines.map(line => {
      // Remove full-line comments
      if (line.trim().startsWith('--')) {
        return '';
      }
      // Remove inline comments (but be careful with dollar quotes)
      const commentIndex = line.indexOf('--');
      if (commentIndex >= 0 && !line.includes('$$')) {
        return line.substring(0, commentIndex);
      }
      return line;
    });
    
    // Split by semicolon, but preserve dollar-quoted strings
    let statements = [];
    let currentStatement = '';
    let inDollarQuote = false;
    let dollarTag = '';
    
    for (const line of cleanedLines) {
      currentStatement += line + '\n';
      
      // Check for dollar quote start/end
      const dollarMatches = line.match(/\$([^$]*)\$/g);
      if (dollarMatches) {
        for (const match of dollarMatches) {
          if (!inDollarQuote) {
            inDollarQuote = true;
            dollarTag = match;
          } else if (match === dollarTag) {
            inDollarQuote = false;
            dollarTag = '';
          }
        }
      }
      
      // If we hit a semicolon and we're not in a dollar quote, end the statement
      if (line.includes(';') && !inDollarQuote) {
        const trimmed = currentStatement.trim();
        if (trimmed.length > 0) {
          statements.push(trimmed);
        }
        currentStatement = '';
      }
    }
    
    // Add any remaining statement
    if (currentStatement.trim().length > 0) {
      statements.push(currentStatement.trim());
    }
    
    console.log(`Found ${statements.length} statements to execute...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        try {
          await client.query(statement);
          const firstWords = statement.trim().split(/\s+/).slice(0, 3).join(' ');
          console.log(`✓ [${i + 1}/${statements.length}] ${firstWords}...`);
        } catch (error) {
          // Ignore "already exists" errors
          if (error.code === '42P07' || error.code === '42710' || error.code === '42723') {
            console.log(`⚠ [${i + 1}/${statements.length}] Skipped (already exists)`);
          } else {
            console.error(`❌ Error in statement ${i + 1}:`, error.message);
            console.error('Statement preview:', statement.substring(0, 200));
            throw error;
          }
        }
      }
    }
    
    console.log('✅ Schema applied successfully!');
    console.log('All tables created.');
    client.release();
    await pool.end();
  } catch (error) {
    console.error('❌ Error running schema:', error.message);
    if (error.code === '42P07') {
      console.log('Note: Some tables may already exist. This is okay.');
    } else {
      process.exit(1);
    }
  }
}

runSchema();

