# SCA Opportunities Tracker

**Birmingham City University · Student Computing Association**

A platform for BCU computing students to discover and track tech opportunities — internships, placements, graduate roles, spring weeks, and events.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL via Prisma ORM
- **Animations**: Framer Motion
- **Deployment**: Vercel + Railway/Supabase

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/YOUR_ORG/sca-tracker.git
cd sca-tracker
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in `.env`:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/sca_tracker"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Set up the database

Make sure PostgreSQL is running, then:

```bash
npm run db:push
npm run db:seed
```

This creates all tables and seeds sample data including:
- 6 companies (Google, Microsoft, Amazon, Meta, Deloitte, JPMorgan)
- 6 opportunities across all types
- 8 upcoming events
- Sample comments
- Default admin user: `admin@bcu.ac.uk` / `admin123`

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Homepage
│   ├── opportunities/
│   │   ├── page.tsx              # Opportunities listing
│   │   └── [id]/page.tsx         # Opportunity detail
│   ├── events/page.tsx           # Events listing
│   ├── admin/
│   │   ├── layout.tsx            # Admin layout with sidebar
│   │   └── page.tsx              # Admin dashboard
│   └── api/
│       ├── opportunities/route.ts
│       ├── events/route.ts
│       ├── comments/route.ts
│       └── feedback/route.ts
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── StatsBar.tsx
│   ├── opportunities/
│   │   ├── OpportunityCard.tsx
│   │   └── OpportunitiesClient.tsx
│   ├── comments/
│   │   └── CommentsSection.tsx
│   ├── events/
│   │   └── RegisterButton.tsx
│   ├── admin/
│   │   └── AdminSidebar.tsx
│   └── ui/
│       ├── SCALogo.tsx
│       └── Toaster.tsx
├── lib/
│   ├── prisma.ts
│   └── utils.ts
└── types/index.ts
```

---

## Deployment

### Vercel (Frontend)

1. Push to GitHub
2. Import to [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Railway (Database)

1. Create a PostgreSQL service on [railway.app](https://railway.app)
2. Copy the `DATABASE_URL` into Vercel env vars
3. Run `npx prisma db push` against the Railway database

---

## Adding Opportunities

Log into `/admin` with `admin@bcu.ac.uk` / `admin123` (change this in production!) and use the dashboard to manage opportunities, companies, events, and comment moderation.

---

## Contributing

Built and maintained by the **BCU Student Computing Association**. To contribute, open a PR or raise an issue on GitHub.
