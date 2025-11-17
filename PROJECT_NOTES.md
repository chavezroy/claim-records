# Claim Records - Project Notes

## Last Updated: November 16, 2025

## Current Status

### ✅ Completed
- Dynamic content implementation (Phases 2-9)
- Database schema created and applied to AWS RDS PostgreSQL
- Admin dashboard with authentication
- API routes for all entities (posts, artists, products, videos, orders, etc.)
- Frontend pages connected to database
- Sample data seeded
- AWS Amplify deployment configured for `feature/dynamic-content` branch
- Health check endpoint created at `/api/health`
- Shopping cart empty state with sad face icon added

### ⚠️ Critical Issue - Environment Variables Not Loading

**Problem:** Environment variables are not being loaded at runtime in AWS Amplify.

**Evidence from `/api/health` endpoint:**
```json
{
  "status": "ok",
  "environment": {
    "nodeEnv": "production",
    "hasDatabaseUrl": false,  // ❌ Should be true
    "hasNextAuthSecret": false,  // ❌ Should be true
    "hasNextAuthUrl": false  // ❌ Should be true
  },
  "database": {
    "connected": false,
    "error": null
  }
}
```

**Impact:**
- Pages that require database access (`/artists`, `/shop`, `/news`, `/`) show server-side errors
- Static pages like `/about` work fine
- Database connection cannot be established

**Required Environment Variables:**
1. `DATABASE_URL` = `postgresql://postgres:YOUR_PASSWORD@claimrecords-db.cz0i6uy4krev.us-east-2.rds.amazonaws.com:5432/claimrecords`
2. `NEXTAUTH_SECRET` = `avClp+2eD1svYD511dCvnH0bGF5y6x3L4W3FazyjjgQ=`
3. `NEXTAUTH_URL` = `https://feature-dynamic-content.d13axw9ole04hk.amplifyapp.com`

**Next Steps to Fix:**

1. **Verify Environment Variables in AWS Amplify:**
   - Go to AWS Amplify Console → Your app → `feature/dynamic-content` branch
   - Navigate to "App settings" → "Environment variables"
   - **IMPORTANT:** Make sure you're setting variables for the `feature/dynamic-content` branch, not just the app level
   - Verify all three variables are listed with exact names (case-sensitive):
     - `DATABASE_URL`
     - `NEXTAUTH_SECRET`
     - `NEXTAUTH_URL`
   - If missing, add them:
     - Click "Add variable" or "Manage variables"
     - Add each variable with its exact value (see below)
     - **Save changes** (this is critical)
   
2. **Required Values:**
   - `DATABASE_URL` = `postgresql://postgres:YOUR_ACTUAL_PASSWORD@claimrecords-db.cz0i6uy4krev.us-east-2.rds.amazonaws.com:5432/claimrecords`
     - Replace `YOUR_ACTUAL_PASSWORD` with your actual RDS database password
   - `NEXTAUTH_SECRET` = `avClp+2eD1svYD511dCvnH0bGF5y6x3L4W3FazyjjgQ=`
   - `NEXTAUTH_URL` = `https://feature-dynamic-content.d13axw9ole04hk.amplifyapp.com`

3. **Trigger New Deployment:**
   - After saving environment variables, go to the branch overview
   - Click "Redeploy this version" or make a small commit and push to trigger auto-deploy
   - Wait for deployment to complete

4. **Verify Fix:**
   - Check `/api/health` endpoint: `https://feature-dynamic-content.d13axw9ole04hk.amplifyapp.com/api/health`
   - Should show `hasDatabaseUrl: true`, `hasNextAuthSecret: true`, `hasNextAuthUrl: true`
   - Should show `database.connected: true` if RDS security group is configured correctly

5. **If Still Not Working:**
   - Check the enhanced health endpoint output for `relevantEnvKeys` - this shows what env vars are actually available
   - Verify variables are set at the branch level, not just app level
   - Check CloudWatch logs for detailed error messages

### 🔍 Additional Checks Needed

1. **RDS Security Group Configuration**
   - Verify RDS security group allows inbound connections on port 5432
   - AWS Console → RDS → Databases → `claimrecords-db` → Connectivity & security → VPC security groups
   - Should have a rule: PostgreSQL, Port 5432, Source: `0.0.0.0/0` (or restricted to AWS IP ranges)

2. **CloudWatch Logs**
   - Check runtime logs for detailed error messages
   - AWS Console → CloudWatch → Log groups → `/aws/amplify/d13axw9ole04hk/feature/dynamic-content`
   - Look for database connection errors, timeout errors, or SSL/TLS issues

## Deployment Information

- **Branch:** `feature/dynamic-content`
- **App ID:** `d13axw9ole04hk`
- **Deployment URL:** `https://feature-dynamic-content.d13axw9ole04hk.amplifyapp.com`
- **Database:** AWS RDS PostgreSQL
  - Host: `claimrecords-db.cz0i6uy4krev.us-east-2.rds.amazonaws.com`
  - Port: `5432`
  - Database: `claimrecords`
  - Username: `postgres` (verify in RDS console)

## Recent Changes

### Latest Commits
- `0263ed8` - Add sad face icon to shopping cart empty state
- `5d507e2` - Add diagnostic logging and health check endpoint for troubleshooting
- `cfdc20c` - Add drop shadow to hero-grid container on artists page

### Files Modified Recently
- `app/cart/page.tsx` - Added sad face icon to empty state
- `lib/db/index.ts` - Added diagnostic logging, increased connection timeout to 10s
- `app/api/health/route.ts` - Created health check endpoint with enhanced diagnostics
- `app/artists/page.tsx` - Added error handling for database queries
- `components/artists/ArtistGridClient.tsx` - Added drop shadow to hero-grid
- `amplify.yml` - Created Amplify build configuration file

## Testing Checklist

When returning to this project:

- [ ] Verify environment variables are set in AWS Amplify
- [ ] Check `/api/health` endpoint shows all environment variables as `true`
- [ ] Test database-dependent pages:
  - [ ] `/` (homepage)
  - [ ] `/artists`
  - [ ] `/shop`
  - [ ] `/news`
- [ ] Verify RDS security group allows connections
- [ ] Check CloudWatch logs for any runtime errors
- [ ] Test admin login at `/admin/login`
- [ ] Verify shopping cart empty state displays sad face icon

## Known Issues

1. **Environment Variables Not Loading** (CRITICAL)
   - Status: Identified, needs fix
   - Impact: Database-dependent pages fail
   - Solution: Verify and set environment variables in AWS Amplify

2. **Health Endpoint 404** (RESOLVED)
   - Status: Fixed - endpoint now accessible
   - Note: Was a deployment timing issue

## Next Steps

1. **Immediate Priority:**
   - Fix environment variables in AWS Amplify
   - Verify database connection works
   - Test all database-dependent pages

2. **Future Tasks:**
   - Phase 10: Payment Integration (Stripe/PayPal) - Deferred until end
   - Add more sample data if needed
   - Performance optimization
   - Additional features as needed

## Useful Commands

```bash
# Check current branch
git branch

# View recent commits
git log --oneline -10

# Check environment variables locally (if needed)
cat .env.local

# Test database connection locally
npm run dev
# Then visit http://localhost:3000/api/health
```

## Resources

- **AWS Amplify Console:** https://console.aws.amazon.com/amplify
- **AWS RDS Console:** https://console.aws.amazon.com/rds
- **CloudWatch Logs:** https://console.aws.amazon.com/cloudwatch
- **Health Check Endpoint:** https://feature-dynamic-content.d13axw9ole04hk.amplifyapp.com/api/health

## Notes

- The `main` branch contains the static site
- The `feature/dynamic-content` branch contains all dynamic functionality
- Database schema is in `lib/db/schema.sql`
- Sample data seeding script: `scripts/seed-data.js`
- Admin user creation script: `scripts/create-admin.js`

