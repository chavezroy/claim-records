import { NextResponse } from 'next/server';
import { healthCheck } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check environment variables
    const hasDatabaseUrl = !!process.env.DATABASE_URL;
    const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET;
    const hasNextAuthUrl = !!process.env.NEXTAUTH_URL;
    
    // Try database connection
    let dbConnected = false;
    let dbError = null;
    try {
      dbConnected = await healthCheck();
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

