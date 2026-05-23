$body = @{
    query = @"
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"@
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://faefunmhrdngygutlcni.supabase.co/rest/v1/rpc/exec_sql" -Method Post -Headers @{
    "apikey" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhZWZ1bm1ocmRuZ3lndXRsY25pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU4MTc1OCwiZXhwIjoyMDg3MTU3NzU4fQ._Fyii3W8C_oETkTcW_8BYE_qglIkb2wCvGTassSMNSs"
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhZWZ1bm1ocmRuZ3lndXRsY25pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU4MTc1OCwiZXhwIjoyMDg3MTU3NzU4fQ._Fyii3W8C_oETkTcW_8BYE_qglIkb2wCvGTassSMNSs"
    "Content-Type" = "application/json"
} -Body $body
