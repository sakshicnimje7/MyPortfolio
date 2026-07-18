# Agent Guidelines & Project Context — Sakshi Portfolio

This document provides AI coding agents with technical context, architectural guidelines, database schemas, and commands required to maintain and build features in this repository.

---

## 🌟 Tech Stack & Core Libraries

- **Framework**: Next.js 14 (App Router, React 18)
- **Styling**: Tailwind CSS & Custom CSS variables in `app/globals.css`
- **Database / ORM**: SQLite (`dev.db` locally) + Prisma ORM
- **Animations / Scroll**: GSAP (ScrollTrigger) & Lenis (Smooth Scroll)
- **3D Graphics**: React Three Fiber & Three.js (for the interactive Voxel Cat Mascot)
- **Data Visualization**: Recharts (inside the Admin Dashboard `/admin`)

---

## 📂 Core Directory Structure

```text
├── app/                      # Next.js App Router routes
│   ├── admin/                # Admin Dashboard (Analytics visualization)
│   ├── api/                  # Backend API routes (analytics, page views)
│   ├── blog/                 # Blog pages (renders MDX blog posts)
│   ├── globals.css           # CSS variables, theme config, tailwind utilities
│   ├── layout.tsx            # Global layout wrapper
│   └── page.tsx              # Landing page (Main client entry point)
├── components/               # React components
│   ├── 3d/                   # Three.js / React Three Fiber components
│   │   └── CatScene.tsx      # Interactive 3D Voxel Cat Mascot
│   ├── sections/             # Landings page sections
│   │   ├── Certifications.tsx# Achievements & Certifications grid
│   │   ├── Contact.tsx       # Contact form & social links
│   │   ├── Experience.tsx    # Professional career timelines (SAP / Java)
│   │   ├── Projects.tsx      # Ported portfolio project lists
│   │   └── ScrollReel.tsx    # Scroll-based textual reels
│   └── ui/                   # Reusable UI modules (Floating Nav, Theme toggle, etc.)
│       ├── FloatingNav.tsx   # Glassmorphic active section tracker nav bar
│       ├── AwwwardsNav.tsx   # Supplemental navigation layout
│       └── ThemeToggle.tsx   # Theme toggler with SVG icon animations
├── prisma/                   # Prisma schema & seeding files
│   ├── schema.prisma         # SQLite database schema definition
│   └── seed.ts               # Database seed scripts with mock portfolio records
├── public/                   # Static public assets (videos, static cat mascots)
└── agentos/                  # AgentOS CLI workspace state (ignore for general builds)
```

---

## 🔄 Recent Major Refactoring (Branch `ui-build`)

The portfolio design was refactored from a **discrete fullscreen slide deck (slides 0-5)** to a **natural vertical scrolling layout** with:
1. **Dynamic Hero Section**: Contains the interactive 3D Voxel Cat, dynamic responsive typography scaling (sizing bounds adjusted for mobile and desktop viewports), and direct call-to-actions linking to sections.
2. **Standard Section Anchors**: The page now scrolls naturally into standard container elements:
   - `#about` -> [ScrollReel](file:///d:/CAT/BILLI/sakshi-portfolio/components/sections/ScrollReel.tsx)
   - `#experience` -> [Experience](file:///d:/CAT/BILLI/sakshi-portfolio/components/sections/Experience.tsx)
   - `#work` -> [Projects](file:///d:/CAT/BILLI/sakshi-portfolio/components/sections/Projects.tsx)
   - `#certifications` -> [Certifications](file:///d:/CAT/BILLI/sakshi-portfolio/components/sections/Certifications.tsx)
   - `#contact` -> [Contact](file:///d:/CAT/BILLI/sakshi-portfolio/components/sections/Contact.tsx)
3. **Glassmorphic Floating Pill Navigation**: Located in [FloatingNav.tsx](file:///d:/CAT/BILLI/sakshi-portfolio/components/ui/FloatingNav.tsx). It uses an `IntersectionObserver` to detect and highlight active sections, and auto-hides on scroll-down, revealing on scroll-up.
4. **Lenis Smooth Scroll & GSAP**: The layout uses Lenis for natural scrolling and binds with GSAP transitions for animations.

---

## 🎨 Theme & Styling System

The application uses CSS variables defined in [globals.css](file:///d:/CAT/BILLI/sakshi-portfolio/app/globals.css) coupled with `next-themes`.

### Active Palettes
- **Light Theme**:
  - Background: Cream/Sand tone (`#f7f5ef` / `var(--cream)`)
  - Typography: Forest/Ink tone (`#111410` / `var(--ink)`)
  - Accents: Sage green (`#8fa68a`), Amber (`#dcae1d`)
- **Dark Theme** (`.dark` class on root):
  - Background: Ink/Dark tone (`#111410`)
  - Typography: Cream tone (`#f7f5ef`)
  - Accents: Soft forest green glow (`#1c2a1c`)

When modifying UI components, **always** use standard color tokens:
- Text: `text-[var(--ink)]` or `text-[var(--sage-mid)]`
- Backgrounds: `bg-[var(--cream)]` or glassmorphism values `bg-[#eae8df]/20 dark:bg-[#181c17]/20 backdrop-blur-md`

---

## 🛠️ CLI Operations & Commands

Use the following commands for development and local testing:

```bash
# Install dependencies
npm install

# Run next.js development server
npm run dev

# Generate Prisma Client & Sync SQLite DB
npx prisma db push
npx prisma generate

# Seed local database (SQLite)
npx tsx prisma/seed.ts

# Production build test
npm run build
```

---

## ⚠️ Guidelines & Constraints for AI Agents

1. **Voxel Cat Mascots**:
   - The 3D cat scene is power-intensive. It **must auto-hide on viewport widths < 640px** (`sm` break) and fallback to a 2D static version (`pixel_cat.png` or SVG) to save battery and layout layout metrics.
2. **Lint & Type Safety**:
   - Make sure no TypeScript files use implicit `any` where strictly typed. Keep all interface and type declarations inside local files or separate types folders.
3. **SEO & Accessibility**:
   - Every page route needs proper semantic titles and meta tags. Interactive elements (like custom buttons or selectors) must have descriptive `id` or `aria-label` tags for testability.
4. **Git Etiquette**:
   - Commit files in logical units. Do not commit unnecessary system files (e.g., `.next`, `.env.local`, SQLite DB files `dev.db`, `node_modules`).
