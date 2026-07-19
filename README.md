# AI Interview Coach

A production-oriented interview practice platform for students and job seekers. It supports written and voice practice, role-specific AI questions, per-answer coaching, final performance reports, analytics, profiles, and administration foundations.

## Live application

Production: https://ai-interview-coach-sigma-bay.vercel.app

## Technology

- Next.js 15 App Router and React 19
- TypeScript and Tailwind CSS 4
- Supabase Authentication and PostgreSQL
- Server-side OpenAI REST integration
- Vercel deployment

## Features

- Email/password registration, verification, login, logout, password recovery, session middleware, protected routes, onboarding, and profiles
- Technical, behavioral, and general interview configuration
- Student through senior experience levels, difficulty, question count, written and voice modes
- Secure server-side question generation and answer evaluation with retry/error states and rate limiting
- Browser microphone recording, speech recognition when available, audio playback, transcript editing, and written fallback
- Final score, strengths, improvements, answer review, and printable/PDF-ready report
- Dashboard, interview history, progress analytics, recommended practice, settings, and admin UI
- Supabase SQL migration with RLS policies
- Error, loading, empty, responsive, print, accessibility, and SEO foundations

## Local setup

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Create a Supabase project and add its public URL and anon key.
5. Run `supabase/migrations/001_initial_schema.sql` in Supabase SQL Editor.
6. Add `OPENAI_API_KEY` only as a server environment variable.
7. Run `npm run dev` and open `http://localhost:3000`.

## Environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

## Validation

```bash
npm run lint
npm run type-check
npm test
npm run build
```

## Security

Secrets are never committed. OpenAI calls execute only in Route Handlers. Supabase RLS restricts user-owned records. Authentication middleware protects private routes. API handlers validate payload size and apply basic in-memory request limits; production deployments should replace this with a distributed rate limiter such as Upstash Redis.

## Deployment

The production application is deployed on Vercel from the `main` branch. `NEXT_PUBLIC_SITE_URL` must match the production URL, and Supabase Authentication must include `https://ai-interview-coach-sigma-bay.vercel.app/auth/callback` as an allowed redirect URL.