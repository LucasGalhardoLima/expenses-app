# Supabase + Prisma Setup Instructions

## Step 1: Create Prisma User in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to your project: `nxmgvduggjrjzxxhurjz`
3. Go to **SQL Editor** in the left sidebar
4. Copy and paste the following SQL script and run it:

```sql
-- Create custom user for Prisma
CREATE USER "prisma" WITH PASSWORD 'expenses_prisma_2024!' BYPASSRLS CREATEDB;

-- Extend prisma's privileges to postgres (necessary to view changes in Dashboard)
GRANT "prisma" TO "postgres";

-- Grant it necessary permissions over the relevant schemas (public)
GRANT USAGE ON SCHEMA public TO prisma;
GRANT CREATE ON SCHEMA public TO prisma;
GRANT ALL ON ALL TABLES IN SCHEMA public TO prisma;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO prisma;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO prisma;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO prisma;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO prisma;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO prisma;
```

## Step 2: Verify Connection String Format

The connection string should follow this format:
```
postgres://prisma.[PROJECT-REF]:[PRISMA-PASSWORD]@[DB-REGION].pooler.supabase.com:5432/postgres
```

For your project:
- PROJECT-REF: `nxmgvduggjrjzxxhurjz`
- PRISMA-PASSWORD: `expenses_prisma_2024!`
- DB-REGION: `aws-0-us-west-1` (please verify this in your Supabase dashboard)

## Step 3: Test the Connection

After running the SQL script, you can test the connection:

```bash
cd backend
npx prisma db push
```

## Step 4: Seed the Database

Once connected successfully:

```bash
npm run db:seed
```

## Step 5: Start the Application

```bash
# Backend (in one terminal)
npm run start:dev

# Frontend (in another terminal)  
cd ../frontend
npm start
```

## Troubleshooting

If you get "Tenant or user not found" error:
1. Make sure you ran the SQL script in your Supabase SQL Editor
2. Verify the region in your connection string matches your project
3. Check that the project reference is correct

You can find the correct connection details in:
Supabase Dashboard → Settings → Database → Connection pooling
