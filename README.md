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

## Available scripts

- `npm run dev` — start the local development server with Turbopack.
- `npm run build` — create an optimized production build.
- `npm run start` — serve the production build locally after running `npm run build`.
- `npm run lint` — run ESLint across the project.
- `npm run type-check` — check TypeScript types without emitting files.
- `npm test` — run the Node.js test suite.

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

## Search visibility setup

Canonical website: `https://ai-interview-coach-sigma-bay.vercel.app/`

- Sitemap: `https://ai-interview-coach-sigma-bay.vercel.app/sitemap.xml`
- Robots file: `https://ai-interview-coach-sigma-bay.vercel.app/robots.txt`
- Public organic landing page: `/`
- Authentication, account, dashboard, interview, and API routes are excluded from search indexing.

To connect Google Search Console:

1. Add the canonical production URL as a URL-prefix property.
2. Verify ownership. For HTML-tag verification, add Google's verification value to the root metadata in `src/app/layout.tsx`, deploy it, and then complete verification in Search Console.
3. Submit `sitemap.xml` from the **Sitemaps** report.
4. Inspect the homepage URL, run the live test, and use **Request Indexing** after the production deployment succeeds.
5. Monitor Page Indexing and Core Web Vitals. Do not request indexing for authentication or private account routes.

Search Console access and ownership verification are manual owner actions. Before broader public promotion, publish privacy and terms pages that accurately describe Supabase account data, AI processing, microphone/voice behavior, retention, and deletion procedures; these policies require verified business and legal details.
