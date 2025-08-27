/**
 * Database configuration utility
 * Constructs DATABASE_URL from environment variables for better security
 */
export function getDatabaseUrl(): string {
  // Se DATABASE_URL já está definida (para compatibilidade com Render/outros)
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Construir DATABASE_URL a partir de componentes separados (mais seguro)
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT || '5432';
  const database = process.env.DB_NAME || 'postgres';
  const username = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const ssl = process.env.DB_SSL === 'true' ? '?sslmode=require' : '';

  if (!host || !username || !password) {
    throw new Error(
      'Database configuration missing. Either provide DATABASE_URL or DB_HOST, DB_USER, and DB_PASSWORD',
    );
  }

  return `postgresql://${username}:${password}@${host}:${port}/${database}${ssl}`;
}

export const databaseConfig = {
  url: getDatabaseUrl(),
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'postgres',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true',
};
