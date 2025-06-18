import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon for better connection handling
neonConfig.webSocketConstructor = ws;
neonConfig.useSecureWebSocket = true;
neonConfig.pipelineConnect = false;
neonConfig.pipelineTLS = false;
neonConfig.wsProxy = process.env.NEON_WS_PROXY;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 30000, // Increased timeout
  max: 3, // Reduced pool size for better stability
  idleTimeoutMillis: 60000, // Increased idle timeout
  maxUses: 7500, // Limit connection reuse
  allowExitOnIdle: false,
});

// Add connection error handling
pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

export const db = drizzle({ client: pool, schema });