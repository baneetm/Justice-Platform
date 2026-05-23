# Justice Platform - Setup Notes

## What was done:

### 1. Backend (Node/Express)
- Updated `.env` with Supabase credentials:
  - SUPABASE_URL: https://faefunmhrdngygutlcni.supabase.co
  - SUPABASE_ANON_KEY: (anon key)
  - SUPABASE_SERVICE_ROLE_KEY: (service role key)
- Installed `@supabase/supabase-js`
- Rewrote `database/index.js` to use Supabase client
- Rewrote controllers to use Supabase instead of PostgreSQL:
  - `authController.js` - authentication
  - `caseController.js` - case management
- Created missing routes: `users.js`, `admin.js`, `chat.js`
- Updated `middleware/auth.js` for Supabase

### 2. Database (Supabase)
- Created tables via SQL Editor:
  - users
  - cases
  - documents
  - chat_messages
  - audit_logs
- Added indexes for performance

### 3. Frontend (React + Vite)
- No changes needed - already configured with proxy to backend

## Running the app:

### Start Backend:
```bash
cd C:\Users\sudhi\Desktop\justice-platform\backend
npm start
```
Runs on: http://localhost:5000

### Start Frontend:
```bash
cd C:\Users\sudhi\Desktop\justice-platform\frontend
npm run dev
```
Runs on: http://localhost:5173

## To access:
Open Brave browser and go to: http://localhost:5173
