# Changelog

All notable changes to the Episolve project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- CAPTCHA verification for forms (optional enhancement)
- Analytics dashboard improvements
- Email template customization

---

## [1.3.0] - 2025-01-17

### Added
- **Rate Limiting**: Implemented sliding window rate limiter (5 requests/minute per IP)
  - Applied to `send-contact-email`, `send-booking-email`, `subscribe-newsletter`
  - Returns 429 status with `Retry-After` header when limit exceeded
  - Automatic cleanup of expired rate limit entries

### Changed
- Edge functions now include rate limiting checks before processing

### Security
- Protection against rapid-fire form submissions
- IP-based request throttling

---

## [1.2.0] - 2025-01-17

### Added
- **Multi-layer Spam Protection**
  - Client-side honeypot fields (invisible to users, catches bots)
  - Form timing validation (minimum 3 seconds to submit)
  - Server-side spam pattern detection
  - Spam scoring system (score ≥50 = blocked)
  
- **Spam Detection Patterns**
  - BBCode/HTML link detection
  - Long URL detection (50+ chars)
  - Common spam keyword filtering
  - Disposable email domain blocking
  - Repeated character detection
  - Cyrillic string detection
  - Suspicious name pattern detection

### Changed
- Contact and booking forms now include spam protection fields
- Edge functions silently block spam (return success to avoid tipping off bots)

### Security
- Forms resilient against automated spam submissions
- Spam scores logged for monitoring

---

## [1.1.0] - 2025-01

### Added
- **GoHighLevel Integration**
  - Calendar availability fetching (10:00 AM - 3:00 PM, 30-min slots)
  - Contact sync on form submissions
  - Automatic calendar event creation for bookings
  - Contact tagging (`website-booking`, `strategic-audit`, etc.)

- **Booking Slot Picker Component**
  - Visual calendar date selection
  - Real-time availability from GHL
  - Time slot selection UI

### Changed
- Booking form now shows real availability from GHL calendar
- Contacts automatically synced to CRM on submission

---

## [1.0.0] - 2025-01

### Added
- **Core Website**
  - Homepage with hero section, services, solutions, insights
  - About page with company information
  - Contact page with contact form and booking form
  - Insights/blog section with article pages
  - Case studies page
  - Solution pages (Risk & Insurance, FTO, Intelligent Automation)
  - 404 Not Found page

- **Authentication System**
  - User signup and login (`/auth`)
  - Password reset flow (`/reset-password`)
  - Role-based access control (admin/user)
  - Protected routes with `ProtectedRoute` component
  - Auto-profile creation on signup

- **Admin Dashboard**
  - View contact submissions
  - View consultation bookings
  - View newsletter subscribers
  - User management for admins
  - Audit logging for admin actions

- **Email Notifications** (via Resend)
  - Contact form confirmation emails
  - Admin notification for new contacts
  - Booking confirmation emails
  - Admin notification for new bookings
  - Newsletter welcome emails

- **Database Schema**
  - `profiles` table for user information
  - `user_roles` table with `app_role` enum
  - `contact_submissions` table
  - `consultation_bookings` table
  - `newsletter_subscribers` table
  - `admin_audit_log` table
  - Row Level Security on all tables

- **Database Functions**
  - `has_role()` - Check user role
  - `get_user_role()` - Get user's role
  - `handle_new_user()` - Trigger for auto profile/role creation
  - `add_admin_user()` - Grant admin with audit logging
  - `remove_admin_user()` - Revoke admin with audit logging
  - `get_admin_users()` - List all admins
  - `get_admin_audit_logs()` - Retrieve audit trail

- **Design System**
  - Episolve brand colors (Dark Navy, Yellow Accent, Blues)
  - Light and dark theme support
  - Custom CSS tokens and gradients
  - Glass morphism effects
  - Plus Jakarta Sans + Inter typography

- **UI Components**
  - Full shadcn/ui component library
  - Custom `EpiHighlight` component for brand styling
  - Responsive header with mobile menu
  - Footer with newsletter signup
  - Theme toggle (light/dark)

### Technical
- React 18.3.1 with TypeScript
- Vite build system
- Tailwind CSS with custom configuration
- Framer Motion animations
- React Query for server state
- Zod for validation
- Lovable Cloud (Supabase) backend

---

## Version History Summary

| Version | Date | Highlights |
|---------|------|------------|
| 1.3.0 | 2025-01-17 | Rate limiting |
| 1.2.0 | 2025-01-17 | Spam protection |
| 1.1.0 | 2025-01 | GoHighLevel integration |
| 1.0.0 | 2025-01 | Initial release |

---

## Migration Notes

### Upgrading to 1.3.0
No migration required. Rate limiting is automatically applied to edge functions.

### Upgrading to 1.2.0
No migration required. Spam protection is backward compatible.

### Upgrading to 1.1.0
Requires GHL secrets to be configured:
- `GHL_API_KEY`
- `GHL_LOCATION_ID`
- `GHL_CALENDAR_ID`
- `GHL_ASSIGNED_USER_ID` (optional)

---

## Contributors

- Episolve Development Team

---

[Unreleased]: https://github.com/episolve/website/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/episolve/website/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/episolve/website/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/episolve/website/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/episolve/website/releases/tag/v1.0.0
