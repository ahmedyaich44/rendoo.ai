# Rendoo.ai - Candidate Assignment (Next.js + Supabase)

This project is my implementation of the **Rendoo Candidate Assignment (Clone + Improvement)** using **Next.js App Router** and **Supabase**.

## Assignment Goal

Build a mobile-first activity booking experience inspired by the provided Rendoo design, then improve UX and complete the core product flow:
- authentication
- activities discovery
- booking
- reservation management

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **React 19**
- **Tailwind CSS 4**
- **Supabase** (Auth + Postgres + RLS + RPC)

## Live Demo

- **Production URL:** `https://rendoo-ai-coral.vercel.app/`

## What I Added / Implemented

### 1. Authentication
- Email/password signup & signin
- Google OAuth signin/signup
- Auth callback handling (`/auth/callback`)
- Forgot/reset password pages
- Email verification flow
- Protected navigation behavior (redirect to signin when needed)

### 2. Profiles Integration
- Auto-create/update `profiles` row after authentication
- Google metadata support (name, avatar URL)

### 3. Activities Experience
- Home page connected to DB published activities
- Category filtering
- Search input with empty-state handling
- Activity cards with image/category styling
- Activity details page (`/activities/[id]`)

### 4. Booking Flow
- Quick-book bottom sheet from activity card
- Slot loading from `activity_slots`
- Date filtering for slots (calendar input)
- Booking action via Supabase RPC
- In-app loading/error states

### 5. Reservations ("Groupes")
- User reservations page (`/groupes`)
- Reservation cards with activity + slot info
- In-app cancel reservation confirmation modal (custom UI, no browser confirm)
- Cancel action via RPC and immediate UI status update

### 6. Reliability / Architecture Improvements
- API route for activities (`/api/activities`) to improve client reliability
- Middleware session update integration
- Shared types (`src/types`)
- Data service layer (`src/lib/services/activities.ts`)
- Hydration/network debugging and cleanup for mobile LAN testing

## Project Structure

```txt
src/
  app/
    api/
      activities/
      supabase/status/
    auth/callback/
    activities/[id]/
    signin/
    signup/
    forgot-password/
    reset-password/
    verify-email/
    groupes/
  components/
  lib/
    services/
    supabase/
  types/
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Notes:
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is for frontend use.
- Never expose `service_role` in the frontend.

## Supabase Auth Configuration

In Supabase dashboard:
- Set **Site URL**:
  - `https://rendoo-ai-coral.vercel.app`
- Add redirect URLs:
  - `https://rendoo-ai-coral.vercel.app/auth/callback`
  - `http://localhost:3000/auth/callback` (optional, local dev only)

## Run Locally

```bash
npm install
npm run dev
```

For phone testing on local network:

```bash
npm run dev -- --hostname 192.168.x.x --port 3000
```

Then open `http://192.168.x.x:3000` on your phone.

## Build & Quality Checks

```bash
npm run lint
npm run build
```

## Deployment Checklist

1. Configure production env vars in hosting platform.
2. Update Supabase Auth Site URL and redirect URLs to production domain.
3. Verify RLS policies for `activities`, `activity_slots`, `bookings`, `profiles`.
4. Deploy (`npm run build` must pass).

## Repository Workflow

Recommended submission branch:
- `rendoo_assignment`

Then open PR to `main`.

