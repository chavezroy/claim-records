import { NextResponse } from 'next/server';
import { healthCheck } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check environment variables
    const hasDatabaseUrl = !!process.env.DATABASE_URL;
    const nextAuthSecret = process.env.NEXTAUTH_SECRET;
    const hasNextAuthSecret = !!nextAuthSecret && nextAuthSecret.trim() !== '';
    const hasNextAuthUrl = !!process.env.NEXTAUTH_URL;
    
    // Get all environment variable keys (for debugging)
    const allEnvKeys = Object.keys(process.env).sort();
    const relevantEnvKeys = allEnvKeys.filter(k => 
      k.includes('DATABASE') || 
      k.includes('NEXT') || 
      k.includes('AUTH') ||
      k.includes('AMPLIFY')
    );
    
    // Check DATABASE_URL format if present
    let databaseUrlInfo = null;
    if (hasDatabaseUrl) {
      const dbUrl = process.env.DATABASE_URL;
      if (dbUrl) {
        try {
          const url = new URL(dbUrl.replace(/^postgresql:\/\//, 'http://'));
          databaseUrlInfo = {
            host: url.hostname,
            port: url.port || '5432',
            database: url.pathname.replace('/', ''),
            hasPassword: !!url.password,
          };
        } catch (e) {
          databaseUrlInfo = { error: 'Invalid URL format' };
        }
      }
    }
    
    // Try database connection
    let dbConnected = false;
    let dbError = null;
    try {
      const dbHealth = await healthCheck();
      dbConnected = dbHealth.connected;
      dbError = dbHealth.error || null;
    } catch (error: any) {
      dbError = error.message;
    }
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDatabaseUrl,
        hasNextAuthSecret,
        hasNextAuthUrl,
        databaseUrlInfo,
        relevantEnvKeys, // List of relevant env var keys (without values for security)
        totalEnvKeys: allEnvKeys.length,
      },
      database: {
        connected: dbConnected,
        error: dbError,
      },
    }, { status: dbConnected ? 200 : 503 });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

