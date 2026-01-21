/**
 * Database configuration helper
 * Supports MySQL (production, e.g. Hostinger), and SQLite (local development)
 */

export function getDatabaseConfig() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // MySQL: mysql://
  // SQLite: file:
  // For SQLite, path fixes are handled in prisma.ts
  if (dbUrl.startsWith("file:")) {
    return { url: dbUrl };
  }

  return { url: dbUrl };
}
