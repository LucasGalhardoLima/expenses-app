/**
 * Database configuration utility
 * Constructs DATABASE_URL from environment variables for better security
 */
export function getDatabaseUrl(): string {
  // Se DATABASE_URL já está definida (para compatibilidade com Render/outros)
  if (process.env.DATABASE_URL) {
    // Otimizar URL do Supabase para melhor performance
    let url = process.env.DATABASE_URL;
    
    // Se for Supabase, adicionar parâmetros de otimização
    if (url.includes('supabase.com')) {
      // Para Render, forçar porta 6543 (Transaction Mode) que é mais estável
      if (process.env.RENDER || process.env.RENDER_SERVICE_ID) {
        console.log(
          '🔧 Render environment detected, optimizing for Transaction Mode...',
        );
        url = url.replace(':5432', ':6543'); // Session Mode → Transaction Mode
      }
      
      const hasParams = url.includes('?');
      const separator = hasParams ? '&' : '?';
      
      // Parâmetros otimizados para Supabase
      const optimizations = [
        'pgbouncer=true', // Use pgbouncer para pooling
        'connection_limit=3', // Limite de conexões
        'pool_timeout=10', // Timeout do pool
        'connect_timeout=30', // Timeout de conexão
        'application_name=expenses-app', // Nome da aplicação
      ].join('&');
      
      const optimizedUrl = `${url}${separator}${optimizations}`;
      console.log(
        '🗄️ Database URL optimized for Supabase:',
        optimizedUrl.replace(/:[^:@]*@/, ':***@'),
      );
      return optimizedUrl;
    }
    
    return url;
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
