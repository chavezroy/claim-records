# AWS Amplify Database Connection Troubleshooting Guide

## Issue Summary

**Problem:** Environment variables (especially `DATABASE_URL`) were not available at runtime in AWS Amplify Hosting Compute, causing database connection failures and "Failed to fetch campaigns" errors.

**Root Cause:** AWS Amplify Hosting Compute uses serverless Lambda functions. Environment variables set in Amplify Console are available during **build time** but are **NOT automatically passed to the runtime** (Lambda execution environment).

**Final Fix:** Write environment variables to `.env.production` file during the build process using `amplify.yml`, which Next.js then loads at runtime.

---

## ✅ Environment Variables Verification (COMPLETE)

**VERIFIED IN AWS AMPLIFY CONSOLE - November 20, 2025:**

All required environment variables are confirmed set in AWS Amplify Console for "All branches":
- ✅ `NEXTAUTH_SECRET`: `ZCHyOQqY4w7Sei8ss23Xv2qiSiCShQkzvgQDfGNN7lePE=` (46 chars)
- ✅ `NEXTAUTH_URL`: `https://main.d13axw9ole04hk.amplifyapp.com`
- ✅ `DATABASE_URL`: Set with RDS connection string
- ✅ Other variables: `USE_MOCK_DATA`, `USE_MOCK_AUTH`, `NODE_ENV`, PayPal variables

**Note:** Despite being verified in Amplify Console, `NEXTAUTH_SECRET` is not available during build phase. This appears to be an AWS Amplify platform-specific issue with variable passing, not a configuration error. Troubleshooting focus should shift to alternative solutions or workarounds.

---

## Timeline of Issues and Fixes

### Issue 1: Environment Variables Not Available at Runtime

**Symptoms:**
- Build succeeds ✅
- Authentication works (fallback to mock auth) ✅
- Database queries fail ❌
- Runtime logs show:
  ```
  [DB] All env vars: { 
    USE_MOCK_DATA: undefined, 
    USE_MOCK_AUTH: undefined, 
    DATABASE_URL: 'Not set', 
    NODE_ENV: 'production'
  }
  ```

**Root Cause:**
- Environment variables set in Amplify Console are available at build time
- But Amplify Hosting Compute (serverless Lambda) doesn't automatically pass them to runtime
- Next.js needs environment variables in `.env.production` file to access them at runtime

**Debugging Steps:**
1. ✅ Verified variables were set correctly in Amplify Console
2. ✅ Confirmed variables were available during build (build logs showed them)
3. ❌ Discovered variables were NOT available at runtime (runtime logs showed `DATABASE_URL: 'Not set'`)
4. ✅ Added detailed logging to `lib/db/index.ts` and `lib/auth/config.ts` to track environment variable state

**Solution:**
Created `amplify.yml` to write environment variables to `.env.production` during build:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci --cache .npm --prefer-offline
    build:
      commands:
        # Write environment variables to .env.production for Amplify Hosting Compute runtime
        # Amplify Console provides variables at build-time, but they need to be in .env.production
        # for Next.js to bundle them into the Lambda/serverless runtime
        - echo "DATABASE_URL=$DATABASE_URL" >> .env.production
        - echo "USE_MOCK_DATA=$USE_MOCK_DATA" >> .env.production
        - echo "USE_MOCK_AUTH=$USE_MOCK_AUTH" >> .env.production
        - echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET" >> .env.production
        - echo "NEXTAUTH_URL=$NEXTAUTH_URL" >> .env.production
        - echo "NODE_ENV=$NODE_ENV" >> .env.production
        - echo "Environment variables written to .env.production"
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - .next/cache/**/*
      - .npm/**/*
```

**Verification:**
- Build logs show: `Environment variables written to .env.production`
- Build logs show: `- Environments: .env.production` (Next.js detected it)
- Runtime logs show: `DATABASE_URL: 'Set (XXX chars)'` ✅

---

### Issue 2: SSL/TLS Connection Errors

**Symptoms:**
- `error: no pg_hba.conf entry for host "...", user "...", database "...", no encryption`
- `Error: self-signed certificate in certificate chain`

**Root Cause:**
- AWS RDS requires SSL/TLS connections
- Node.js `postgres` package needs SSL configuration for RDS

**Fixes Applied:**

1. **Added SSL parameter to DATABASE_URL:**
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=no-verify
   ```

2. **Updated `lib/db/index.ts` to configure SSL:**
   ```typescript
   const isRDS = dbUrl.includes('rds.amazonaws.com');
   const hasSSLParam = dbUrl.includes('sslmode');
   
   const sslConfig = isRDS || hasSSLParam 
     ? { rejectUnauthorized: false } 
     : undefined;
   
   client = postgres(dbUrl, { 
     prepare: false,
     onnotice: () => {},
     ssl: sslConfig,
   });
   ```

**Note:** `sslmode=no-verify` is used because RDS uses self-signed certificates. For production, consider using proper certificate validation.

---

### Issue 3: Edge Runtime Timezone Warning

**Symptoms:**
- Runtime logs show: `[DB] Could not set timezone to UTC: Error: The edge runtime does not support Node.js 'net' module`

**Root Cause:**
- Some Next.js routes use Edge runtime (doesn't support Node.js 'net' module)
- Timezone setting was happening during module initialization

**Fix:**
- Made timezone setting lazy (only executes when connection is actually used)
- Edge runtime routes don't use database, so this warning is harmless
- Suppressed warning in production logs

---

## Complete Troubleshooting Checklist

### Step 1: Verify Environment Variables in Amplify Console

1. Go to **AWS Amplify Console** → Your App (`d13axw9ole04hk`)
2. Click **"App settings"** → **"Environment variables"**
3. Verify these are set for **"All branches"**:

| Variable | Verified Value (Source of Truth) | Notes |
|----------|----------------------------------|-------|
| `DATABASE_URL` | `postgresql://ooh_admin:***@ooh-db.cz0i6uy4krev.us-east-2.rds.amazonaws.com:5432/oohdam?sslmode=no-verify` | Must include `?sslmode=no-verify` |
| `USE_MOCK_DATA` | `false` | Should NOT be `true` |
| `USE_MOCK_AUTH` | `false` | Should NOT be `true` |
| `NEXTAUTH_SECRET` | `ZCHyOQqY4w7Sei8ss23Xv2qiSiCShQkzvgQDfGNN7lePE=` | ✅ Verified in Amplify Console (46 chars) |
| `NEXTAUTH_URL` | `https://main.d13axw9ole04hk.amplifyapp.com` | ✅ Verified in Amplify Console |
| `NODE_ENV` | `production` | Should be `production` |
| `PAYPAL_CLIENT_ID` | (set in Amplify Console) | For PayPal integration |
| `PAYPAL_CLIENT_SECRET` | (set in Amplify Console) | For PayPal integration |
| `PAYPAL_MODE` | `sandbox` or `live` | For PayPal integration |

### Step 2: Verify `amplify.yml` Configuration

Ensure `amplify.yml` exists in project root and includes environment variable writing:

```yaml
build:
  commands:
    - echo "DATABASE_URL=$DATABASE_URL" >> .env.production
    # ... other variables ...
    - npm run build
```

### Step 3: Check Build Logs

After deployment, check build logs for:
- ✅ `Environment variables written to .env.production`
- ✅ `- Environments: .env.production` (Next.js detected it)
- ✅ `[DB] Initializing connection: { isRDS: true, ... }`

### Step 4: Check Runtime Logs

Go to **Monitoring** → **Hosting compute logs** and look for:

**✅ Good Signs:**
```
[DB] All env vars: { 
  USE_MOCK_DATA: 'false', 
  USE_MOCK_AUTH: 'false', 
  DATABASE_URL: 'Set (XXX chars)', 
  NODE_ENV: 'production'
}
[DB] Initializing connection: { isRDS: true, ... }
[DB] Connection client created successfully
[AUTH] Attempting to query user: user@example.com
[AUTH] User query result: Found
```

**❌ Bad Signs:**
```
[DB] All env vars: { 
  USE_MOCK_DATA: undefined, 
  DATABASE_URL: 'Not set'
}
[DB] Mock data mode enabled - database connection skipped
[AUTH] Database connection not initialized
```

### Step 5: Test Database Connection

From your local machine, test the RDS connection:

```bash
# Test connection
psql "postgresql://ooh_admin:[PASSWORD]%21@ooh-db.cz0i6uy4krev.us-east-2.rds.amazonaws.com:5432/oohdam?sslmode=require" -c "SELECT 1;"

# Check if users are seeded
psql "postgresql://ooh_admin:[PASSWORD]%21@ooh-db.cz0i6uy4krev.us-east-2.rds.amazonaws.com:5432/oohdam?sslmode=require" -c "SELECT email, name, role FROM users;"
```

**Note:** Use `sslmode=require` for `psql` (not `no-verify` - that's Node.js specific)

---

## Key Learnings

1. **Amplify Hosting Compute separates build-time and runtime environments**
   - Variables available at build ≠ Variables available at runtime
   - Must explicitly write to `.env.production` during build

2. **Next.js loads `.env.production` at runtime**
   - Next.js automatically loads `.env.production` in production mode
   - This is how environment variables become available to serverless functions

3. **RDS requires SSL/TLS**
   - Always include `?sslmode=no-verify` in `DATABASE_URL` for RDS
   - Configure `ssl: { rejectUnauthorized: false }` in postgres client

4. **Edge Runtime limitations**
   - Edge runtime doesn't support Node.js 'net' module
   - Database connections only work in Node.js runtime
   - Timezone warnings are harmless for Edge routes

---

## Files Modified

1. **`amplify.yml`** - Writes environment variables to `.env.production` during build
2. **`lib/db/index.ts`** - Added SSL configuration and detailed logging
3. **`lib/auth/config.ts`** - Added detailed logging for debugging
4. **`app/actions/campaigns.ts`** - Added database connection validation

---

## References

- [AWS Amplify Environment Variables](https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html)
- [Amplify Hosting Compute](https://docs.aws.amazon.com/amplify/latest/userguide/server-side-rendering-amplify.html)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [AWS RDS SSL/TLS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html)

---

## Verified Environment Variables (Source of Truth) ✅

**VERIFIED IN AWS AMPLIFY CONSOLE - November 20, 2025:**

| Variable | Verified Value | Scope | Status |
|----------|---------------|-------|--------|
| `NEXTAUTH_SECRET` | `ZCHyOQqY4w7Sei8ss23Xv2qiSiCShQkzvgQDfGNN7lePE=` | All branches | ✅ **VERIFIED SET** (46 chars) |
| `NEXTAUTH_URL` | `https://main.d13axw9ole04hk.amplifyapp.com` | All branches | ✅ **VERIFIED SET** |

**VERIFICATION COMPLETE:** Both variables are confirmed set in AWS Amplify Console for "All branches" with correct values.

**Known Discrepancy:** Despite being set in Amplify Console, build logs show `NEXTAUTH_SECRET` is not available during build phase, while `NEXTAUTH_URL` is available. This appears to be an AWS Amplify-specific issue with how certain environment variables (possibly those ending with `=`) are passed to the build environment.

**Workaround Options:**
1. Set `NEXTAUTH_SECRET` specifically for the `main` branch (not just "All branches")
2. Use AWS Systems Manager Parameter Store for sensitive values
3. Use a different secret format (without trailing `=`)
4. Set the variable directly in `amplify.yml` as a temporary workaround (not recommended for production)

**Current Status:** Variables verified in Amplify Console. Issue appears to be Amplify platform-specific variable passing, not a configuration error.

---

## Quick Fix Reference

If database connection fails:

1. ✅ Verify `amplify.yml` writes variables to `.env.production`
2. ✅ Check build logs for "Environment variables written to .env.production"
3. ✅ Check runtime logs for `DATABASE_URL: 'Set (XXX chars)'`
4. ✅ Verify `DATABASE_URL` includes `?sslmode=no-verify`
5. ✅ Ensure RDS security group allows connections from Amplify
6. ✅ Test connection with `psql` command
7. ✅ Verify users are seeded: `SELECT email FROM users;`

If `NEXTAUTH_SECRET` is not available at runtime:

1. ✅ Verify variable is set in Amplify Console (see verified values above)
2. ✅ Check build logs for `✓ NEXTAUTH_SECRET written (length: 46)`
3. ✅ Verify `.env.production` contents in build logs show `NEXTAUTH_SECRET=***`
4. ✅ Check runtime logs for `[AUTH] Configuration:` to see if secret is loaded
5. ✅ Ensure variable is set for the correct branch (main vs feature branches)

