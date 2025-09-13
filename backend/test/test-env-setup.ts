import { config } from 'dotenv';
import { join } from 'path';

// Load test environment variables
config({ path: join(__dirname, '..', '.env.test') });

// Override NODE_ENV for tests
process.env.NODE_ENV = 'test';

// Ensure required test environment variables are set
const requiredEnvVars = [
  'DATABASE_URL',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`Warning: ${envVar} is not set in test environment`);
  }
}

// Set default test values if not provided
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://test_user:test_password@localhost:5432/expenses_test_db';
}

if (!process.env.SUPABASE_URL) {
  process.env.SUPABASE_URL = 'https://test-supabase-url.supabase.co';
}

if (!process.env.SUPABASE_ANON_KEY) {
  process.env.SUPABASE_ANON_KEY = 'test-anon-key';
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
}

export {};
