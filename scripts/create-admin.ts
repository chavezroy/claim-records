#!/usr/bin/env ts-node

/**
 * Script to create an admin user
 * Usage: npx ts-node scripts/create-admin.ts <email> <password> [name]
 */

import { query } from '../lib/db';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('Usage: npx ts-node scripts/create-admin.ts <email> <password> [name]');
    process.exit(1);
  }

  const [email, password, name] = args;

  try {
    // Check if user already exists
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);

    if (existing.rows.length > 0) {
      console.error(`User with email ${email} already exists`);
      process.exit(1);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin user
    const result = await query(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1, $2, $3, 'admin')
       RETURNING id, email, name, role`,
      [email, passwordHash, name || null]
    );

    console.log('Admin user created successfully:');
    console.log(JSON.stringify(result.rows[0], null, 2));

    await query('SELECT pg_terminate_backend(pg_backend_pid())', []);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();

