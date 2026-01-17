# Database Backup Procedures

This document outlines procedures for backing up the Episolve database.

---

## Table of Contents

1. [Quick Backup Guide](#quick-backup-guide)
2. [Manual Export via SQL](#manual-export-via-sql)
3. [Automated Backup Script](#automated-backup-script)
4. [Backup Schedule](#backup-schedule)
5. [Restore Procedures](#restore-procedures)
6. [Backup Verification](#backup-verification)

---

## Quick Backup Guide

### Option 1: Request via Lovable Chat

The fastest way to get a database dump:

1. Open the Lovable project
2. Ask: "Please export a database dump to the backups folder"
3. Lovable will query all tables and save as JSON

### Option 2: Admin Dashboard Export

1. Log in as admin at `/admin`
2. View data in each tab (Contacts, Bookings, Newsletter)
3. Copy/export data as needed

### Option 3: Direct SQL Queries

Use the queries in this document to export specific tables.

---

## Manual Export via SQL

### Export All Tables

Run these queries in your database client or via Lovable:

```sql
-- Contact Submissions
SELECT * FROM contact_submissions ORDER BY created_at DESC;

-- Consultation Bookings  
SELECT * FROM consultation_bookings ORDER BY created_at DESC;

-- Newsletter Subscribers
SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC;

-- User Profiles
SELECT * FROM profiles ORDER BY created_at DESC;

-- User Roles
SELECT * FROM user_roles ORDER BY created_at DESC;

-- Admin Audit Log
SELECT * FROM admin_audit_log ORDER BY created_at DESC;
```

### Export with Date Filter

```sql
-- Last 30 days of contacts
SELECT * FROM contact_submissions 
WHERE created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

-- Last 30 days of bookings
SELECT * FROM consultation_bookings
WHERE created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;
```

### Export as CSV Format

```sql
-- Contact submissions as CSV-ready format
SELECT 
  id,
  name,
  email,
  phone,
  company,
  service_interest,
  message,
  to_char(created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at
FROM contact_submissions
ORDER BY created_at DESC;
```

---

## Automated Backup Script

### Edge Function for Scheduled Backups

Create a new edge function for automated backups:

**File: `supabase/functions/scheduled-backup/index.ts`**

```typescript
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const handler = async (req: Request): Promise<Response> => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const timestamp = new Date().toISOString().split('T')[0];
    
    // Fetch all tables
    const [contacts, bookings, subscribers, profiles, roles, auditLogs] = await Promise.all([
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("consultation_bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("newsletter_subscribers").select("*").order("subscribed_at", { ascending: false }),
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*").order("created_at", { ascending: false }),
      supabase.from("admin_audit_log").select("*").order("created_at", { ascending: false }),
    ]);

    const backup = {
      export_info: {
        exported_at: new Date().toISOString(),
        project: "Episolve",
      },
      contact_submissions: contacts.data || [],
      consultation_bookings: bookings.data || [],
      newsletter_subscribers: subscribers.data || [],
      profiles: profiles.data || [],
      user_roles: roles.data || [],
      admin_audit_log: auditLogs.data || [],
      summary: {
        contact_submissions: contacts.data?.length || 0,
        consultation_bookings: bookings.data?.length || 0,
        newsletter_subscribers: subscribers.data?.length || 0,
        profiles: profiles.data?.length || 0,
        user_roles: roles.data?.length || 0,
        admin_audit_log: auditLogs.data?.length || 0,
      },
    };

    // Here you could:
    // 1. Upload to Supabase Storage
    // 2. Send via email
    // 3. Upload to external storage (S3, etc.)

    return new Response(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

serve(handler);
```

### Schedule with Cron (in config.toml)

Add to `supabase/config.toml`:

```toml
[functions.scheduled-backup]
schedule = "0 0 * * *"  # Daily at midnight UTC
```

---

## Backup Schedule

### Recommended Schedule

| Backup Type | Frequency | Retention |
|-------------|-----------|-----------|
| Full database dump | Daily | 30 days |
| Transaction data | Weekly | 90 days |
| Critical data (contacts, bookings) | On change | Indefinite |
| User accounts | Weekly | 90 days |

### Backup Checklist

#### Daily
- [ ] Verify automated backup ran (check logs)
- [ ] Spot check record counts

#### Weekly
- [ ] Download and verify backup file
- [ ] Test restore on development environment
- [ ] Archive to external storage

#### Monthly
- [ ] Full backup verification
- [ ] Test complete restore procedure
- [ ] Update backup documentation if needed
- [ ] Review and clean old backups

---

## Restore Procedures

### Restore from JSON Backup

#### Step 1: Prepare Data

```typescript
// Parse the backup file
const backup = JSON.parse(backupFileContents);
```

#### Step 2: Clear Existing Data (if needed)

```sql
-- WARNING: This deletes all data!
-- Only use for full restore scenarios

TRUNCATE TABLE contact_submissions CASCADE;
TRUNCATE TABLE consultation_bookings CASCADE;
TRUNCATE TABLE newsletter_subscribers CASCADE;
-- Do NOT truncate profiles or user_roles without careful consideration
```

#### Step 3: Insert Data

```sql
-- Example: Restore contact submissions
INSERT INTO contact_submissions (id, name, email, phone, company, service_interest, message, created_at)
VALUES 
  ('uuid-here', 'Name', 'email@example.com', '123-456-7890', 'Company', 'service', 'message', '2026-01-15T00:00:00Z'),
  -- ... more rows
;
```

### Restore User Accounts

User accounts are stored in `auth.users` (managed by Supabase). To restore:

1. Users must re-register, OR
2. Contact Lovable support for auth table restoration

### Partial Restore

To restore specific records without affecting others:

```sql
-- Insert only if not exists
INSERT INTO contact_submissions (id, name, email, phone, company, service_interest, message, created_at)
SELECT * FROM (VALUES 
  ('uuid-here'::uuid, 'Name', 'email@example.com', '123', 'Company', 'service', 'message', '2026-01-15'::timestamptz)
) AS t(id, name, email, phone, company, service_interest, message, created_at)
WHERE NOT EXISTS (
  SELECT 1 FROM contact_submissions WHERE id = 'uuid-here'::uuid
);
```

---

## Backup Verification

### Verify Backup Integrity

```sql
-- Compare record counts
SELECT 'contact_submissions' as table_name, COUNT(*) as count FROM contact_submissions
UNION ALL
SELECT 'consultation_bookings', COUNT(*) FROM consultation_bookings
UNION ALL
SELECT 'newsletter_subscribers', COUNT(*) FROM newsletter_subscribers
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles
UNION ALL
SELECT 'user_roles', COUNT(*) FROM user_roles
UNION ALL
SELECT 'admin_audit_log', COUNT(*) FROM admin_audit_log;
```

### Verification Checklist

- [ ] Backup file is valid JSON
- [ ] All expected tables are present
- [ ] Record counts match production
- [ ] Dates are properly formatted
- [ ] No truncated data
- [ ] File size is reasonable (compare to previous backups)

---

## External Backup Storage

### Recommended Storage Locations

1. **Git Repository** (current approach)
   - Pros: Version controlled, easy access
   - Cons: Large files can bloat repo

2. **Supabase Storage**
   - Pros: Integrated, secure
   - Cons: Same system as production

3. **External Cloud Storage** (Recommended for production)
   - AWS S3
   - Google Cloud Storage
   - Azure Blob Storage
   - Backblaze B2

### Security Considerations

- [ ] Encrypt backup files at rest
- [ ] Use separate credentials for backup access
- [ ] Store backups in different geographic region
- [ ] Test restore from external storage regularly
- [ ] Limit backup access to authorized personnel

---

## Emergency Contacts

For backup-related emergencies:

| Issue | Contact |
|-------|---------|
| Database access issues | Lovable Support |
| Restore assistance | Development Team Lead |
| Security breach | Security Team |

---

## Backup File Naming Convention

```
database-dump-YYYY-MM-DD.json
database-dump-YYYY-MM-DD-HHmmss.json  (for multiple daily backups)
```

Examples:
- `database-dump-2026-01-17.json`
- `database-dump-2026-01-17-143022.json`

---

## Quick Reference Commands

### Via Lovable Chat

```
"Export a database dump"
"Backup all tables to JSON"
"Show me the current record counts"
"Create a backup of contacts and bookings"
```

### Record Count Check

```sql
SELECT 
  (SELECT COUNT(*) FROM contact_submissions) as contacts,
  (SELECT COUNT(*) FROM consultation_bookings) as bookings,
  (SELECT COUNT(*) FROM newsletter_subscribers) as subscribers,
  (SELECT COUNT(*) FROM profiles) as profiles;
```

---

*Last Updated: January 2026*
