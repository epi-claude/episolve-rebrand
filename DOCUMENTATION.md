# Episolve Project Documentation

> **Last Updated:** January 2025  
> **Purpose:** Disaster recovery, compliance, and project handoff documentation

---

## Table of Contents

1. [Infrastructure & Platform](#1-infrastructure--platform)
2. [Frontend Architecture](#2-frontend-architecture)
3. [Backend Architecture](#3-backend-architecture)
4. [Database Schema](#4-database-schema)
5. [Authentication System](#5-authentication-system)
6. [External Integrations](#6-external-integrations)
7. [Security Measures](#7-security-measures)
8. [Design System](#8-design-system)
9. [Environment Variables](#9-environment-variables)
10. [Disaster Recovery Checklist](#10-disaster-recovery-checklist)
11. [Key Dependencies](#11-key-dependencies)

---

## 1. Infrastructure & Platform

### Hosting Platform

| Component | Details |
|-----------|---------|
| **Platform** | Lovable Cloud (Supabase-powered backend) |
| **Project ID** | `infidoobhmjzxlzjymuo` |
| **Preview URL** | https://id-preview--f4e5881b-2657-40d5-9304-530474580e48.lovable.app |
| **Published URL** | https://episolve-rebrand.lovable.app |
| **Custom Domain** | Configurable in Lovable settings |

### Build & Runtime

| Technology | Version/Details |
|------------|-----------------|
| **Framework** | React 18.3.1 + Vite |
| **Language** | TypeScript |
| **CSS** | Tailwind CSS with custom design tokens |
| **Package Manager** | Bun |

---

## 2. Frontend Architecture

### Core Stack

- **React 18.3.1** - UI library
- **React Router 6.30.1** - Client-side routing
- **TanStack React Query 5.83.0** - Server state management
- **Framer Motion 12.23.25** - Animations
- **Zod 3.25.76** - Schema validation

### UI Components

- **shadcn/ui** - Component library (Radix UI primitives)
- **Lucide React 0.462.0** - Icon library
- **Sonner** - Toast notifications
- **date-fns 3.6.0** - Date utilities

### Page Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Index` | Homepage |
| `/about` | `About` | About page |
| `/contact` | `Contact` | Contact & Booking forms |
| `/insights` | `Insights` | Blog/Insights listing |
| `/insights/:slug` | `InsightDetail` | Individual insight article |
| `/case-studies` | `CaseStudies` | Case studies page |
| `/solutions/risk-insurance` | `RiskInsurance` | Risk & Insurance solution |
| `/solutions/fractional-technology-office` | `FractionalTechnologyOffice` | FTO solution |
| `/solutions/intelligent-automation` | `IntelligentAutomation` | Automation solution |
| `/auth` | `Auth` | Login/Signup |
| `/reset-password` | `ResetPassword` | Password reset |
| `/admin` | `Admin` | Admin dashboard (protected) |

### Key Data Files

| File | Purpose |
|------|---------|
| `src/data/services.ts` | 8 service offerings (IT Consulting, Software Dev, AI, etc.) |
| `src/data/solutions.ts` | 3 featured solutions |
| `src/data/insights.ts` | Blog posts/articles |
| `src/data/team.ts` | Team member information |

### Project Structure

```
src/
├── components/
│   ├── admin/           # Admin dashboard components
│   ├── auth/            # Authentication components
│   ├── layout/          # Header, Footer, Layout
│   └── ui/              # shadcn/ui components
├── data/                # Static data (services, insights, etc.)
├── hooks/               # Custom React hooks
│   ├── useAuth.tsx      # Authentication context & hook
│   ├── useSpamProtection.ts  # Form spam protection
│   └── use-mobile.tsx   # Mobile detection
├── integrations/
│   └── supabase/        # Supabase client & types
├── lib/                 # Utilities
├── pages/               # Page components
└── assets/              # Images and static assets
```

---

## 3. Backend Architecture

### Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  React Frontend │────▶│  Supabase Client│────▶│  Supabase Auth  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  PostgreSQL DB  │
                        └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │ Edge Functions  │
                        └─────────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
       ┌───────────┐    ┌───────────┐    ┌───────────┐
       │ Resend API│    │GoHighLevel│    │GHL Calendar│
       └───────────┘    └───────────┘    └───────────┘
```

### Edge Functions (Serverless)

| Function | Purpose | Integrations |
|----------|---------|--------------|
| `send-contact-email` | Process contact form → emails | Resend API |
| `send-booking-email` | Process bookings → emails + CRM | Resend API, GHL |
| `subscribe-newsletter` | Newsletter signup → DB + welcome email | Resend API |
| `ghl-calendar-availability` | Fetch available slots from GHL calendar | GoHighLevel API |
| `ghl-contact-sync` | Sync contacts/bookings to GHL | GoHighLevel API |
| `admin-get-data` | Admin data retrieval (protected) | - |
| `admin-sync-bookings` | Sync bookings for admin | - |
| `admin-sync-contacts` | Sync contacts for admin | - |

### Shared Utilities

| File | Purpose |
|------|---------|
| `supabase/functions/_shared/spam-detection.ts` | Multi-signal spam detection (honeypot, timing, patterns) |
| `supabase/functions/_shared/rate-limiter.ts` | In-memory rate limiting (5 req/min/IP) |

---

## 4. Database Schema

### Tables

#### `profiles`
Stores user profile information.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | uuid | No | `gen_random_uuid()` |
| `user_id` | uuid | No | - |
| `email` | text | No | - |
| `full_name` | text | Yes | - |
| `created_at` | timestamptz | No | `now()` |
| `updated_at` | timestamptz | No | `now()` |

#### `user_roles`
Maps users to their roles (admin/user).

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | uuid | No | `gen_random_uuid()` |
| `user_id` | uuid | No | - |
| `role` | app_role | No | `'user'` |
| `created_at` | timestamptz | No | `now()` |

#### `contact_submissions`
Stores contact form submissions.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | uuid | No | `gen_random_uuid()` |
| `name` | text | No | - |
| `email` | text | No | - |
| `phone` | text | Yes | - |
| `company` | text | Yes | - |
| `service_interest` | text | Yes | - |
| `message` | text | No | - |
| `created_at` | timestamptz | No | `now()` |

#### `consultation_bookings`
Stores consultation booking requests.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | uuid | No | `gen_random_uuid()` |
| `name` | text | No | - |
| `email` | text | No | - |
| `phone` | text | Yes | - |
| `company` | text | Yes | - |
| `preferred_date` | date | Yes | - |
| `message` | text | Yes | - |
| `status` | text | No | `'pending'` |
| `created_at` | timestamptz | No | `now()` |

#### `newsletter_subscribers`
Stores newsletter subscriptions.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | uuid | No | `gen_random_uuid()` |
| `email` | text | No | - |
| `confirmed` | boolean | No | `false` |
| `subscribed_at` | timestamptz | No | `now()` |
| `unsubscribed_at` | timestamptz | Yes | - |

#### `admin_audit_log`
Tracks admin actions for compliance.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | uuid | No | `gen_random_uuid()` |
| `action` | text | No | - |
| `target_user_id` | uuid | No | - |
| `target_email` | text | No | - |
| `performed_by_user_id` | uuid | No | - |
| `performed_by_email` | text | No | - |
| `details` | jsonb | Yes | - |
| `created_at` | timestamptz | No | `now()` |

### Enums

#### `app_role`
```sql
CREATE TYPE app_role AS ENUM ('admin', 'user');
```

### RLS Policies Summary

| Table | Public Access | Authenticated Access |
|-------|---------------|---------------------|
| `contact_submissions` | INSERT only | Admins: SELECT |
| `consultation_bookings` | INSERT only | Admins: SELECT |
| `newsletter_subscribers` | INSERT only | Admins: SELECT |
| `profiles` | None | Own profile: SELECT, UPDATE; Admins: SELECT all |
| `user_roles` | None | Own roles: SELECT; Admins: ALL |
| `admin_audit_log` | None | Admins: SELECT only |

### Database Functions

| Function | Purpose |
|----------|---------|
| `has_role(user_id, role)` | Check if user has specific role |
| `get_user_role(user_id)` | Get user's role |
| `handle_new_user()` | Trigger: auto-create profile & assign 'user' role |
| `update_updated_at_column()` | Trigger: auto-update timestamp |
| `get_admin_users()` | List all admin users |
| `add_admin_user(email)` | Grant admin role + audit log |
| `remove_admin_user(user_id)` | Revoke admin role + audit log |
| `get_admin_audit_logs(limit)` | Retrieve audit logs |

---

## 5. Authentication System

### Authentication Flow

1. User signs up via `/auth` page
2. `handle_new_user()` trigger creates profile + assigns 'user' role
3. Admins can grant admin role via `add_admin_user()` function
4. Protected routes use `ProtectedRoute` component with `requireAdmin` prop

### Auth Configuration

- **Email auto-confirm**: Enabled (for development)
- **Password reset**: Email-based with redirect to `/reset-password`

### Key Files

- `src/hooks/useAuth.tsx` - Authentication context and hook
- `src/components/auth/ProtectedRoute.tsx` - Route protection component
- `src/pages/Auth.tsx` - Login/signup page
- `src/pages/ResetPassword.tsx` - Password reset page

---

## 6. External Integrations

### Resend (Email Service)

| Configuration | Value |
|---------------|-------|
| **Secret** | `RESEND_API_KEY` |
| **From Domain** | `notify.e-dmm.com` |
| **Admin Email** | `contact@episolve.com` |

#### Email Types Sent

1. **Contact Form Confirmation** - Sent to user after contact submission
2. **Contact Form Notification** - Sent to admin for new contacts
3. **Booking Confirmation** - Sent to user after booking
4. **Booking Notification** - Sent to admin for new bookings
5. **Newsletter Welcome** - Sent to new subscribers

### GoHighLevel (CRM)

| Secret | Purpose |
|--------|---------|
| `GHL_API_KEY` | API authentication |
| `GHL_LOCATION_ID` | Sub-account identifier |
| `GHL_CALENDAR_ID` | Calendar for bookings |
| `GHL_ASSIGNED_USER_ID` | Default appointment assignee |

#### GHL Integration Features

1. **Contact Sync** - Creates/updates contacts in GHL from form submissions
2. **Calendar Availability** - Fetches available time slots (10:00 AM - 3:00 PM, 30-min intervals)
3. **Appointment Creation** - Creates calendar events for bookings
4. **Tag Assignment** - Applies tags like `website-booking`, `strategic-audit`

### Integration Flow

```
User submits booking form
         │
         ▼
    Edge Function
    (send-booking-email)
         │
         ├──▶ Spam Check + Rate Limit
         │
         ├──▶ Send confirmation email (Resend)
         │
         ├──▶ Send admin notification (Resend)
         │
         └──▶ Sync to GHL (Contact + Calendar Event)
```

---

## 7. Security Measures

### Spam Protection (Multi-layer)

| Layer | Method |
|-------|--------|
| **Client** | Honeypot field, timing validation (3s minimum) |
| **Server** | Pattern matching, email validation, spam scoring |
| **Rate Limiting** | 5 requests/minute per IP per function |

### Spam Detection Patterns

The following patterns trigger spam scoring:

- BBCode links (`[url=...]`, `[link=...]`)
- HTML links (`<a href=...>`)
- Very long URLs (50+ characters)
- Common spam keywords (viagra, casino, lottery, etc.)
- Repeated characters (10+ consecutive)
- Long Cyrillic strings
- Disposable email domains (mailinator, guerrillamail, etc.)
- Names with numbers (e.g., "John Smith123")
- All-caps messages

### Spam Scoring

- Score of 50+ = Blocked (silent success returned to not tip off bots)
- Score is logged for monitoring

### Input Validation

- Zod schemas on all edge functions
- HTML escaping for email content
- Max length limits on all fields:
  - Name: 100 chars
  - Email: 254 chars
  - Phone: 20 chars
  - Company: 100 chars
  - Message: 2000 chars

### Rate Limiting Configuration

```typescript
const WINDOW_MS = 60 * 1000;  // 1 minute window
const MAX_REQUESTS = 5;        // Max 5 requests per window per IP
```

### RLS (Row Level Security)

All tables have RLS enabled with appropriate policies:
- Public forms can only INSERT
- SELECT is denied for public on submission tables
- Admin-only access for viewing submissions

---

## 8. Design System

### Brand Colors

| Color | HSL | Hex | Usage |
|-------|-----|-----|-------|
| Dark Navy | `222 50% 30%` | `#254071` | Primary (light mode) |
| Yellow Accent | `60 97% 71%` | `#FDFC6C` | CTAs, highlights |
| Medium Blue | `213 37% 47%` | `#4A74A8` | Secondary |
| Light Blue | `210 47% 70%` | `#8FB4D9` | Accents |
| Very Light Blue | `215 20% 92%` | `#E6EAEF` | Backgrounds |

### Typography

| Element | Font Family | Weight |
|---------|-------------|--------|
| Headings | Plus Jakarta Sans | 600-800 |
| Body | Inter | 300-500 |

### Theme Support

- **Light mode** and **Dark mode** with CSS variables
- Glass effects (`backdrop-filter: blur`)
- Gradients defined as CSS custom properties
- Glow effects for interactive elements

### CSS Custom Properties

Key tokens defined in `src/index.css`:

```css
--background
--foreground
--primary / --primary-foreground
--secondary / --secondary-foreground
--muted / --muted-foreground
--accent / --accent-foreground
--destructive / --destructive-foreground
--border
--input
--ring
--radius
```

### Gradient Classes

```css
.gradient-text     /* Primary gradient on text */
.glass             /* Glass morphism effect */
.hero-gradient     /* Hero section background */
.card-gradient     /* Card backgrounds */
.cta-gradient      /* CTA button gradient */
.dark-gradient     /* Dark section backgrounds */
```

---

## 9. Environment Variables

### Frontend (.env - Auto-generated by Lovable)

```env
VITE_SUPABASE_URL=https://infidoobhmjzxlzjymuo.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_SUPABASE_PROJECT_ID=infidoobhmjzxlzjymuo
```

> ⚠️ **Note:** The `.env` file is auto-generated and should not be edited manually.

### Edge Function Secrets (Encrypted in Lovable Cloud)

| Secret | Purpose | Required |
|--------|---------|----------|
| `RESEND_API_KEY` | Email sending via Resend | Yes |
| `GHL_API_KEY` | GoHighLevel API access | Yes |
| `GHL_LOCATION_ID` | GHL sub-account ID | Yes |
| `GHL_CALENDAR_ID` | GHL calendar ID | Yes |
| `GHL_ASSIGNED_USER_ID` | Default assignee for appointments | Optional |
| `SUPABASE_URL` | Supabase project URL | Auto-provided |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Auto-provided |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Auto-provided |
| `SUPABASE_DB_URL` | Direct database connection | Auto-provided |

---

## 10. Disaster Recovery Checklist

### To Rebuild This Project From Scratch

#### Step 1: Create New Lovable Project
1. Go to [lovable.dev](https://lovable.dev)
2. Create new project with React template
3. Enable Lovable Cloud for backend

#### Step 2: Restore Database
1. Run all migrations from `supabase/migrations/` folder
2. Verify all tables, functions, and RLS policies are created
3. Verify triggers are attached

#### Step 3: Configure Secrets
Add the following secrets in Lovable Cloud settings:
- `RESEND_API_KEY`
- `GHL_API_KEY`
- `GHL_LOCATION_ID`
- `GHL_CALENDAR_ID`
- `GHL_ASSIGNED_USER_ID` (optional)

#### Step 4: Deploy Edge Functions
Edge functions in `supabase/functions/` are auto-deployed on push.

#### Step 5: Configure Auth Settings
- Enable auto-confirm email signups (for development)
- Configure password reset redirect URL

#### Step 6: Set Up External Services

**Resend:**
1. Create account at [resend.com](https://resend.com)
2. Generate API key
3. Verify sending domain (`notify.e-dmm.com`)

**GoHighLevel:**
1. Get API key from GHL settings
2. Note your Location ID
3. Create calendar and get Calendar ID
4. (Optional) Get assigned user ID

#### Step 7: Assign Initial Admin
```sql
-- After a user signs up, grant them admin:
SELECT add_admin_user('admin@episolve.com');
```

### Critical Files to Backup

| Category | Files/Folders |
|----------|---------------|
| Frontend Code | `src/` |
| Edge Functions | `supabase/functions/` |
| Database Schema | `supabase/migrations/` |
| Configuration | `supabase/config.toml` |
| Design System | `src/index.css`, `tailwind.config.ts` |
| Static Data | `src/data/` |

### Files NOT to Backup (Auto-generated)

- `.env`
- `src/integrations/supabase/client.ts`
- `src/integrations/supabase/types.ts`
- `node_modules/`
- `bun.lockb`

---

## 11. Key Dependencies

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 18.3.1 | UI library |
| `react-dom` | 18.3.1 | React DOM renderer |
| `react-router-dom` | 6.30.1 | Client-side routing |
| `@supabase/supabase-js` | 2.89.0 | Database & auth client |
| `@tanstack/react-query` | 5.83.0 | Server state management |

### Form & Validation

| Package | Version | Purpose |
|---------|---------|---------|
| `react-hook-form` | 7.61.1 | Form handling |
| `@hookform/resolvers` | 3.10.0 | Zod integration for forms |
| `zod` | 3.25.76 | Schema validation |

### UI Components

| Package | Version | Purpose |
|---------|---------|---------|
| `@radix-ui/*` | Various | Primitive UI components |
| `lucide-react` | 0.462.0 | Icon library |
| `class-variance-authority` | 0.7.1 | Component variants |
| `tailwind-merge` | 2.6.0 | Tailwind class merging |
| `clsx` | 2.1.1 | Conditional classes |

### Animation & UX

| Package | Version | Purpose |
|---------|---------|---------|
| `framer-motion` | 12.23.25 | Animations |
| `sonner` | 1.7.4 | Toast notifications |
| `next-themes` | 0.3.0 | Theme management |

### Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| `date-fns` | 3.6.0 | Date utilities |
| `recharts` | 2.15.4 | Charts (admin dashboard) |

---

## Appendix: Quick Reference

### Common Commands

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build
```

### Useful Database Queries

```sql
-- View all admin users
SELECT * FROM get_admin_users();

-- View recent audit logs
SELECT * FROM get_admin_audit_logs(50);

-- Check user role
SELECT get_user_role('user-uuid-here');

-- Grant admin to user
SELECT add_admin_user('user@example.com');

-- Revoke admin from user
SELECT remove_admin_user('user-uuid-here');
```

### API Endpoints (Edge Functions)

| Endpoint | Method | Auth Required |
|----------|--------|---------------|
| `/functions/v1/send-contact-email` | POST | No |
| `/functions/v1/send-booking-email` | POST | No |
| `/functions/v1/subscribe-newsletter` | POST | No |
| `/functions/v1/ghl-calendar-availability` | POST | No |
| `/functions/v1/ghl-contact-sync` | POST | No |
| `/functions/v1/admin-get-data` | POST | Yes (Admin) |

---

*Document generated for Episolve project. Keep this document updated with any significant changes to the architecture or configuration.*
