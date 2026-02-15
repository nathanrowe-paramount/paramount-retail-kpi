# KPI Dashboard — Project Scaffold
## Ready-to-Deploy Next.js Application

---

## QUICK START (Non-Technical Deployment)

### Step 1: Reactivate Supabase (5 minutes)
1. Log into Supabase dashboard
2. Click "Resume" on your paused project (or create new)
3. Go to Settings → Database → copy "Connection string" (URI format)
4. Save this somewhere — you'll paste it in Step 3

### Step 2: Create GitHub Repo & Push Code
1. Create new GitHub repo: `paramount-kpi-dashboard`
2. Extract all files from this folder into the repo
3. Commit and push to main branch

### Step 3: Deploy to Vercel (5 minutes)
1. Go to [vercel.com](https://vercel.com) → Sign up (free)
2. Click "Add New Project" → Import from GitHub
3. Select your `paramount-kpi-dashboard` repo
4. Vercel will auto-detect Next.js — keep defaults
5. Add Environment Variables:
   - `DATABASE_URL` = (paste from Supabase step 1)
   - `NEXTAUTH_SECRET` = (type: `openssl rand -base64 32` or any random string)
   - `NEXTAUTH_URL` = (Vercel will provide this after first deploy, then update)
6. Click Deploy

### Step 4: Setup Database
1. In Vercel dashboard, go to your project → Settings → Console
2. Run: `npx prisma migrate deploy`
3. Run: `npx prisma db seed` (creates initial KPIs and admin user)

### Step 5: First Login
- Email: `admin@paramount.com`
- Password: `ChangeMe123!` (change immediately after login)

**Total setup time: 15 minutes. No coding required.**

---

## PROJECT STRUCTURE

```
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   ├── (auth)/               # Login pages
│   ├── (dashboard)/          # Protected dashboard
│   │   ├── layout.tsx        # Sidebar + navigation
│   │   ├── page.tsx          # GM overview
│   │   ├── stores/           # Store management
│   │   ├── kpis/             # KPI configuration
│   │   ├── targets/          # Target setting
│   │   ├── reviews/          # Monthly reviews
│   │   └── leaderboard/      # Competition view
│   └── layout.tsx            # Root layout
├── components/               # React components
├── lib/                      # Utilities & config
├── prisma/                   # Database schema
├── public/                   # Static assets
├── types/                    # TypeScript types
├── middleware.ts             # Auth middleware
├── next.config.js            # Next.js config
├── package.json              # Dependencies
└── README.md                 # This file
```

---

## WHAT I BUILT

### 1. Database Schema (Prisma)
- Complete schema matching your KPI framework
- Role-based users (GM, Ops Manager, AM, SM)
- Stores, KPIs, Targets, Reviews, Photos
- Ready to run migrations

### 2. Authentication (NextAuth)
- Email/password login
- Role-based access control
- Protected routes via middleware
- Session management

### 3. Dashboard Layout
- Responsive sidebar navigation
- Mobile-friendly (works on iPad/phone)
- Role-based menu items (GM sees everything, SM sees own store)

### 4. Core Pages
- **GM Overview:** Network heatmap, store performance grid
- **Store Management:** Add/edit stores, assign managers
- **KPI Configuration:** Edit KPIs, weights, categories
- **Target Setting:** AM interface to set monthly targets
- **Review Workflow:** Pre-fill form + site visit form
- **Leaderboard:** Competition view with rankings

### 5. Mobile Site Visit Form
- Works on phone/iPad
- Photo upload capability
- Offline support (saves locally, syncs when online)
- GPS stamp option

### 6. Auto-Calculation
- Overall score based on weighted KPIs
- Grade assignment (Exceeds/Meets/Below)
- Trend indicators

---

## FEATURES INCLUDED

✅ User management (GM creates AMs, AMs see their stores)  
✅ Store management (VIC/NSW split)  
✅ KPI configuration (your 6 categories, 25 KPIs)  
✅ Target setting (AM sets monthly targets)  
✅ Monthly review workflow (pre-fill + site visit)  
✅ Photo uploads (compliance evidence)  
✅ Dashboards (GM network view, AM store view, SM scorecard)  
✅ Leaderboard (competition rankings)  
✅ Export to PDF  
✅ Mobile-responsive (PWA-ready)  

**Not yet built (Phase 2):**
- Excel import for bulk data
- API integrations (POS, payroll)
- Automated notifications
- Advanced analytics

---

## ENVIRONMENT VARIABLES

Create `.env.local` file (already included in template):

```env
# Database (from Supabase)
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# Auth (generate random strings)
NEXTAUTH_SECRET="your-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"  # Vercel will override this

# Storage (from Supabase)
SUPABASE_URL="https://[project-ref].supabase.co"
SUPABASE_SERVICE_KEY="[service-role-key]"
```

---

## MAINTENANCE

**Adding new stores:**
- GM logs in → Stores → Add Store
- Assign to Area Manager
- Done

**Setting monthly targets:**
- AM logs in → Targets
- Select month, bulk-edit targets per store
- Or edit individual store targets

**Conducting reviews:**
- AM logs in → Reviews → New Review
- Pre-fill desk data
- Go to store, open on phone/iPad
- Complete site visit form, take photos
- Submit, meet with SM

**Viewing performance:**
- GM: Dashboard shows all 20 stores
- AM: Dashboard shows their 10 stores
- SM: Dashboard shows their scorecard + leaderboard ranking

---

## SUPPORT

If deployment issues:
1. Check Vercel deployment logs (click on failed build)
2. Verify DATABASE_URL is correct (test connection)
3. Ensure NEXTAUTH_SECRET is set
4. Run `npx prisma migrate deploy` in Vercel console

**Need help:** Message me with error screenshots

---

## DEVELOPMENT (Optional)

If you want to customize later:

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# Run database migrations
npx prisma migrate dev

# Seed initial data
npx prisma db seed

# Start development server
npm run dev

# Open http://localhost:3000
```

---

## SECURITY NOTES

- Change default admin password immediately
- Use strong NEXTAUTH_SECRET (32+ random characters)
- Keep Supabase service key private
- Enable RLS (Row Level Security) in Supabase for extra protection

---

**Ready to deploy? Follow the 5 steps at the top of this file.**
