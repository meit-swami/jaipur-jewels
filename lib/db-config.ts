/**
 * Database configuration helper
 * Supports both SQLite (local development) and PostgreSQL (Vercel production)
 */

export function getDatabaseConfig() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // Check if it's a PostgreSQL connection (starts with postgresql:// or postgres://)
  const isPostgres = dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://");
  
  // For SQLite, ensure absolute path
  if (!isPostgres && dbUrl.startsWith("file:")) {
    // Already handled in prisma.ts
    return { url: dbUrl };
  }

  return { url: dbUrl };
}
