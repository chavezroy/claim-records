# Database Setup Guide

## Prerequisites

- PostgreSQL database (AWS RDS or local)
- Database connection string

## Setup Steps

1. **Create Database**

   ```sql
   CREATE DATABASE claimrecords;
   ```

2. **Run Schema**

   Connect to your database and run the schema file:

   ```bash
   psql -h your-host -U your-user -d claimrecords -f lib/db/schema.sql
   ```

   Or using the connection string:

   ```bash
   psql $DATABASE_URL -f lib/db/schema.sql
   ```

3. **Set Environment Variable**

   Add to your `.env.local` file:

   ```
   DATABASE_URL=postgresql://user:password@host:5432/claimrecords
   ```

## Schema Overview

The database includes the following main tables:

- **users** - Admin and public user accounts
- **artists** - Artist profiles
- **products** - Physical and digital products
- **posts** - News, updates, articles
- **videos** - Video content
- **orders** - Order management
- **order_items** - Order line items
- **digital_downloads** - Digital product delivery
- **comments** - Public comments
- **ratings** - Rating system
- **votes** - Voting system
- **media** - Media library
- **cart_sessions** - Persistent cart storage

## Connection

The database connection is managed through `lib/db/index.ts`:

```typescript
import { query, transaction } from '@/lib/db';

// Simple query
const result = await query('SELECT * FROM artists WHERE id = $1', [artistId]);

// Transaction
await transaction(async (client) => {
  await client.query('INSERT INTO ...');
  await client.query('UPDATE ...');
});
```

## Migrations

For now, schema changes should be applied directly to the database. Consider using a migration tool like Prisma or a custom migration system in the future.

