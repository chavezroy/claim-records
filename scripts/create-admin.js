const { readFileSync } = require('fs');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

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

async function createAdmin() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: node scripts/create-admin.js <email> <password> [name]');
    console.error('Example: node scripts/create-admin.js admin@claimrecords.com MyPassword123 "Admin User"');
    process.exit(1);
  }

  const [email, password, name] = args;

  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('rds.amazonaws.com') 
      ? { rejectUnauthorized: false } 
      : false,
  });

  try {
    const client = await pool.connect();
    console.log('Connected to database...');

    // Check if user already exists
    const existing = await client.query('SELECT id FROM users WHERE email = $1', [email]);

    if (existing.rows.length > 0) {
      console.error(`❌ User with email ${email} already exists`);
      client.release();
      await pool.end();
      process.exit(1);
    }

    // Hash password
    console.log('Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin user
    console.log('Creating admin user...');
    const result = await client.query(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1, $2, $3, 'admin')
       RETURNING id, email, name, role`,
      [email, passwordHash, name || null]
    );

    console.log('✅ Admin user created successfully!');
    console.log('User details:');
    console.log(JSON.stringify(result.rows[0], null, 2));
    console.log('\nYou can now log in at: http://localhost:3000/admin/login');

    client.release();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

createAdmin();

