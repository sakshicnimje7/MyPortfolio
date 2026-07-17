# Sakshi Nimje — Voxel & Web Engineering Portfolio

A premium, interactive 3D and responsive portfolio showcasing backend expertise (SAP Cloud, Java Enterprise) and advanced frontend animations. Built with **Next.js 14 (App Router)**, **Tailwind CSS**, **Three.js / React Three Fiber**, **GSAP**, and **Prisma (with SQLite/Better-SQLite3)**.

---

## 🌟 Key Features

1. **3D Voxel Cat Scene (React Three Fiber & Three.js)**:
   - Dynamic ambient lighting shifts dynamically based on selected theme colors (light vs dark mode).
   - Auto-hides on mobile viewports (`< 640px`) and replaces with a 2D static pixel cat to save mobile battery and memory.

2. **Database-Backed Analytics**:
   - Automated routing pageview tracking using a custom React hook (`usePageView.ts`).
   - SQLite DB ingestion via custom Next.js API routes (`/api/analytics/pageview`).
   - Interactive Recharts bar graph inside the Admin Dashboard `/admin` visualizing total page views and route distributions over the last 30 days.

3. **Smooth Scroll & Floating Navigation**:
   - Powered by **Lenis** synced directly with **GSAP ScrollTrigger** timeline ticks.
   - Smooth scroll anchor transitions for `#work`, `#about`, `#lab`, and `#contact` links.
   - Glassmorphic floating nav pill with active section highlighting (utilizing an `IntersectionObserver` on the landing page) and scroll direction auto-hide (hides on scroll-down, reveals on scroll-up).

4. **Dynamic Dark Mode Toggle**:
   - Controlled via `next-themes` with custom SVG icons (no external icon package bloat).
   - In dark mode, color tokens transition smoothly (`--cream` to `#111410`, `--ink` to `#ededea`), the hero radial gradient switches to a subtle green glow, and the 3D scene's ambient light shifts to `#1c2a1c`.

5. **Responsive Pass & Layout Polish**:
   - Adaptive layouts scaling font metrics and layout grids between iPhone, iPad, and Ultra-Wide desktops.
   - Experience timelines collapse to a single left-aligned connector on mobile.

---

## 🛠️ Local Development Setup

Follow these steps to run the portfolio locally:

### 1. Prerequisites
- **Node.js**: v18.x or v20.x
- **npm**: v9.x or v10.x

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Initialization
This project uses SQLite and Prisma Config. Run the following commands to create the database tables, generate the client, and load the initial data:

```bash
# Push the schema changes and create the SQLite database (dev.db)
npx prisma db push

# Generate the custom client build outputs
npx prisma generate

# Seed the database with mock projects, blog posts, and achievements
npx tsx prisma/seed.ts
```

### 4. Run the Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Database Architecture

The application database is managed via Prisma in `prisma/schema.prisma`. It stores:

- **`Project`**: Highlighting enterprise contributions across SAP and Java stacks.
- **`BlogPost`**: Storing MDX articles rendering under the `/blog/[slug]` routes.
- **`Achievement`**: Custom certificates and awards (e.g. SAP Certified Associate, Infosys badges).
- **`PageView`**: Real-time logging of user navigations (stores pathnames and timestamps).

---

## 🚀 Deployment to Vercel

To prepare for production deployment, review these options:

### 1. Domain Configuration & www Redirects
The project includes a custom `vercel.json` in the root:
- Configures www-to-bare-domain redirection (e.g., from `www.sakshinimje.in` to `https://sakshinimje.in`).
- Sets up permanent caching headers for static images, SVGs, and font files (`Cache-Control: public, max-age=31536000, immutable`) to maximize SEO performance.

### 2. Production Database (PostgreSQL / Supabase)
SQLite is local and read-only on Vercel's ephemeral serverless nodes. For a production deployment, follow these migration steps to connect to a cloud database (like Supabase PostgreSQL):

#### A. Update the Prisma Schema
In `prisma/schema.prisma`, change the database provider to `postgresql`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

#### B. Update the Prisma Client Initialization
SQLite uses the `better-sqlite3` adapter in `lib/prisma.ts`. For PostgreSQL, modify `lib/prisma.ts` to initialize a standard `PrismaClient` without the SQLite adapter:
```typescript
/* eslint-disable no-var */
import { PrismaClient } from "../generated/client/client";

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient();
  }
  prisma = globalThis.prisma;
}

export default prisma;
```

#### C. Deploy to Vercel
1. Set up a Supabase project and copy the **Transaction Connection String**.
2. Go to your Vercel Project Settings and add `DATABASE_URL` as an Environment Variable.
3. Add the following build command in Vercel or `package.json` to push the database schema and generate the client on deployment:
   ```bash
   prisma generate && prisma db push
   ```
