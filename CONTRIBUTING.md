# Contributing to Episolve

Thank you for contributing to the Episolve project! This document provides guidelines and best practices for team members.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Standards](#code-standards)
4. [Commit Conventions](#commit-conventions)
5. [Branch Strategy](#branch-strategy)
6. [Pull Request Process](#pull-request-process)
7. [Testing Guidelines](#testing-guidelines)
8. [Database Changes](#database-changes)
9. [Edge Functions](#edge-functions)
10. [Design System](#design-system)
11. [Security Guidelines](#security-guidelines)

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- Git
- Access to the Lovable project

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd episolve

# Install dependencies
bun install

# Start development server
bun run dev
```

### Project Resources

| Resource | Location |
|----------|----------|
| Full Documentation | [DOCUMENTATION.md](./DOCUMENTATION.md) |
| Changelog | [CHANGELOG.md](./CHANGELOG.md) |
| Lovable Project | [Open in Lovable](https://lovable.dev/projects/f4e5881b-2657-40d5-9304-530474580e48) |

---

## Development Workflow

### Using Lovable (Recommended for UI changes)

1. Open the [Lovable Project](https://lovable.dev/projects/f4e5881b-2657-40d5-9304-530474580e48)
2. Make changes via prompts or visual editor
3. Changes are automatically committed to the repository

### Using Local Development

1. Pull latest changes: `git pull origin main`
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes and test locally
4. Commit with conventional commit message
5. Push and create a pull request

### Development Commands

```bash
# Start dev server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Lint code
bun run lint
```

---

## Code Standards

### TypeScript

- Use TypeScript for all new files
- Define explicit types for function parameters and return values
- Avoid `any` type; use `unknown` if type is truly unknown
- Use interfaces for object shapes, types for unions/primitives

```typescript
// ✅ Good
interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
}

function getUser(id: string): Promise<UserProfile | null> {
  // ...
}

// ❌ Avoid
function getUser(id: any): any {
  // ...
}
```

### React Components

- Use functional components with hooks
- One component per file (except small helper components)
- Use named exports for components
- Keep components focused and small (<200 lines preferred)

```typescript
// ✅ Good
export function UserCard({ user }: UserCardProps) {
  return (
    <div className="p-4 rounded-lg bg-card">
      <h3>{user.name}</h3>
    </div>
  );
}

// ❌ Avoid default exports for components
export default function UserCard() { ... }
```

### File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `UserCard.tsx` |
| Hooks | camelCase with `use` prefix | `useAuth.tsx` |
| Utilities | camelCase | `formatDate.ts` |
| Types | PascalCase | `types.ts` |
| Data files | camelCase | `services.ts` |

### Folder Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components (don't modify)
│   ├── layout/          # Layout components
│   ├── admin/           # Admin-specific components
│   └── [feature]/       # Feature-specific components
├── hooks/               # Custom React hooks
├── pages/               # Page components (one per route)
├── data/                # Static data files
├── lib/                 # Utility functions
└── integrations/        # External service integrations
```

---

## Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style (formatting, semicolons, etc.) |
| `refactor` | Code refactoring |
| `perf` | Performance improvements |
| `test` | Adding/updating tests |
| `chore` | Maintenance tasks |
| `security` | Security improvements |

### Examples

```bash
feat(contact): add honeypot spam protection
fix(booking): correct timezone conversion for GHL
docs: update README with new setup instructions
refactor(auth): simplify role checking logic
security: add rate limiting to edge functions
```

### Scope Examples

- `auth` - Authentication related
- `contact` - Contact form
- `booking` - Booking system
- `admin` - Admin dashboard
- `email` - Email functionality
- `ghl` - GoHighLevel integration
- `ui` - UI components
- `db` - Database changes

---

## Branch Strategy

### Main Branches

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `develop` | Integration branch (if used) |

### Feature Branches

```
feature/<feature-name>     # New features
fix/<bug-description>      # Bug fixes
docs/<what-changed>        # Documentation
refactor/<what-changed>    # Refactoring
security/<what-changed>    # Security updates
```

### Examples

```bash
feature/newsletter-double-optin
fix/booking-timezone-offset
docs/api-documentation
security/csrf-protection
```

---

## Pull Request Process

### Before Creating a PR

1. ✅ Code builds without errors: `bun run build`
2. ✅ Code passes linting: `bun run lint`
3. ✅ Tested locally in browser
4. ✅ No console errors or warnings
5. ✅ Commits follow conventional format

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested the changes

## Screenshots (if UI changes)
Add screenshots here

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed the code
- [ ] Added/updated documentation if needed
- [ ] No new warnings introduced
```

### Review Process

1. Create PR with descriptive title and description
2. Request review from team member
3. Address feedback and make changes
4. Once approved, squash and merge

---

## Testing Guidelines

### Manual Testing Checklist

Before submitting changes, verify:

- [ ] Feature works in Chrome, Firefox, Safari
- [ ] Responsive design works on mobile/tablet
- [ ] Dark mode displays correctly
- [ ] Form validation works
- [ ] Error states are handled
- [ ] Loading states are shown

### Testing Forms

1. Submit with valid data → Should succeed
2. Submit with invalid data → Should show validation errors
3. Submit empty form → Should show required field errors
4. Submit very quickly → Should be rate limited
5. Check spam protection is working

### Testing Edge Functions

Use the Lovable Cloud logs to verify:

```
Settings → Cloud → View Logs
```

Or test directly:

```bash
curl -X POST https://infidoobhmjzxlzjymuo.supabase.co/functions/v1/function-name \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

---

## Database Changes

### ⚠️ Important Rules

1. **Never modify production data directly**
2. **Always use migrations** for schema changes
3. **Test migrations** in development first
4. **Back up data** before destructive changes

### Creating Migrations

Use Lovable to create database migrations:

1. Describe the change in chat
2. Lovable will generate the SQL migration
3. Review the migration carefully
4. Approve to execute

### Migration Best Practices

```sql
-- ✅ Good: Add column with default
ALTER TABLE users ADD COLUMN status text DEFAULT 'active';

-- ✅ Good: Create index for performance
CREATE INDEX idx_bookings_email ON consultation_bookings(email);

-- ⚠️ Careful: Dropping columns (data loss)
ALTER TABLE users DROP COLUMN old_field;

-- ✅ Good: Always enable RLS on new tables
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;
```

### RLS Policy Guidelines

- Always enable RLS on tables with user data
- Public forms: INSERT only, no SELECT
- User data: Users can only access their own rows
- Admin data: Require admin role check

---

## Edge Functions

### Location

```
supabase/functions/
├── _shared/              # Shared utilities
│   ├── spam-detection.ts
│   └── rate-limiter.ts
├── send-contact-email/
│   └── index.ts
├── send-booking-email/
│   └── index.ts
└── ...
```

### Creating New Functions

1. Create folder: `supabase/functions/function-name/`
2. Create `index.ts` with handler
3. Functions auto-deploy on push

### Template

```typescript
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Your logic here
    
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
```

### Required Practices

- ✅ Always include CORS headers
- ✅ Validate input with Zod
- ✅ Add rate limiting for public endpoints
- ✅ Add spam protection for forms
- ✅ Log errors for debugging
- ✅ Return appropriate status codes

---

## Design System

### Using Design Tokens

Always use Tailwind classes with CSS variables:

```tsx
// ✅ Good - uses design tokens
<div className="bg-background text-foreground">
<button className="bg-primary text-primary-foreground">

// ❌ Bad - hardcoded colors
<div className="bg-white text-black">
<button className="bg-blue-500 text-white">
```

### Available Tokens

| Token | Usage |
|-------|-------|
| `background` / `foreground` | Page background and text |
| `card` / `card-foreground` | Card surfaces |
| `primary` / `primary-foreground` | Primary buttons, links |
| `secondary` / `secondary-foreground` | Secondary elements |
| `muted` / `muted-foreground` | Subtle backgrounds, helper text |
| `accent` / `accent-foreground` | Highlights, CTAs |
| `destructive` | Error states, delete buttons |
| `border` | Border colors |

### Adding New Components

1. Check if shadcn/ui has the component first
2. If creating custom, follow existing patterns
3. Support both light and dark themes
4. Use design tokens, not hardcoded colors

---

## Security Guidelines

### Never Do

- ❌ Commit API keys or secrets
- ❌ Log sensitive user data
- ❌ Trust client-side validation alone
- ❌ Use `dangerouslySetInnerHTML` without sanitization
- ❌ Disable RLS policies

### Always Do

- ✅ Validate all inputs server-side
- ✅ Use parameterized queries
- ✅ Escape HTML in user content
- ✅ Enable RLS on all tables
- ✅ Check authentication/authorization
- ✅ Use HTTPS for all external calls

### Secrets Management

Secrets are stored in Lovable Cloud settings, never in code:

```typescript
// ✅ Good - get from environment
const apiKey = Deno.env.get("API_KEY");

// ❌ Never do this
const apiKey = "sk_live_abc123...";
```

### Reporting Security Issues

If you discover a security vulnerability:

1. Do NOT create a public issue
2. Contact the team lead directly
3. Provide details of the vulnerability
4. Allow time for a fix before disclosure

---

## Questions?

- Check [DOCUMENTATION.md](./DOCUMENTATION.md) for detailed technical docs
- Ask in the team chat
- Create an issue for discussion

---

Thank you for contributing! 🎉
