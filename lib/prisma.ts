import { PrismaClient } from "@prisma/client";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Fix DATABASE_URL for SQLite - ensure absolute path (not used for MySQL/PostgreSQL)
function fixDatabaseUrl() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    // Default to SQLite for local development
    if (process.env.NODE_ENV !== "production") {
      const defaultPath = path.join(process.cwd(), "prisma", "dev.db");
      process.env.DATABASE_URL = `file:${defaultPath}`;
    } else {
      throw new Error(
        "DATABASE_URL is required in production. " +
        "Please set up a MySQL database (e.g., Hostinger) and configure DATABASE_URL."
      );
    }
    return;
  }

  // Fix SQLite relative paths only (skip for mysql://, postgresql://, etc.)
  if (dbUrl.startsWith("file:./") || dbUrl.startsWith("file:../")) {
    const relativePath = dbUrl.replace("file:", "");
    const absolutePath = path.join(process.cwd(), relativePath);
    process.env.DATABASE_URL = `file:${absolutePath}`;
  }
}

// Fix database URL before creating Prisma client
fixDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
