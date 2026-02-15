# KPI Dashboard Application — Complete Project

**Ready to deploy in 15 minutes, no coding required.**

---

## 📁 FILES INCLUDED

```
kpi-app-deploy/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx              # Login page
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Dashboard layout with sidebar
│   │   ├── page.tsx                  # Overview dashboard
│   │   ├── leaderboard/
│   │   │   └── page.tsx              # Competition rankings
│   │   ├── stores/
│   │   │   └── page.tsx              # Store management
│   │   └── targets/
│   │       └── page.tsx              # AM target setting
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts          # Authentication API
│   │   ├── stores/
│   │   │   └── route.ts              # Stores API
│   │   └── upload/
│   │       └── route.ts              # Photo upload signed URLs
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Global styles
├── components/
│   ├── ui/
│   │   └── button.tsx                # UI button component
│   └── photo-upload.tsx              # Photo upload with captions
├── lib/
│   ├── auth.ts                       # NextAuth configuration
│   ├── db.ts                         # Prisma client
│   └── utils.ts                      # Utility functions
├── prisma/
│   ├── schema.prisma                 # Database schema (25 KPIs, reviews, suppliers, promotions)
│   └── seed.ts                       # Seed data (KPIs, admin user)
├── types/
│   └── next-auth.d.ts                # TypeScript types
├── middleware.ts                     # Route protection
├── next.config.ts                    # Next.js config
├── package.json                      # Dependencies
├── tailwind.config.ts                # Tailwind CSS config
├── postcss.config.js                 # PostCSS config
├── tsconfig.json                     # TypeScript config
├── .env.example                      # Environment template
└── README.md                         # This file
```

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Reactivate Supabase (2 minutes)
1. Go to [supabase.com](https://supabase.com) and log in
2. Find your paused project and click **"Resume"**
3. Or create new project if needed (free tier)
4. Go to **Settings** → **Database**
5. Copy the **"Connection string"** (URI format)
6. Save it for Step 3

### Step 2: Upload to GitHub (3 minutes)
1. Create new repository: `paramount-kpi-dashboard`
2. Upload all files from this folder
3. Commit to `main` branch

**OR use Git command line:**
```bash
cd kpi-app-deploy
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/paramount-kpi-dashboard.git
git push -u origin main
```

### Step 3: Deploy to Vercel (5 minutes)
1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Click **"Add New Project"**
3. Import from GitHub → select `paramount-kpi-dashboard`
4. Vercel auto-detects Next.js — keep default settings
5. Add **Environment Variables**:
   - `DATABASE_URL` = paste from Supabase Step 1
   - `NEXTAUTH_SECRET` = type any random 32-character string (or use `openssl rand -base64 32`)
   - `NEXTAUTH_URL` = leave blank for now (Vercel provides this after deploy)
   - `SUPABASE_URL` = your Supabase project URL (Settings → API → Project URL)
   - `SUPABASE_SERVICE_KEY` = your service_role key (Settings → API → Project API keys)
6. Click **Deploy**

### Step 4: Setup Supabase Storage (2 minutes)
For photo uploads to work, create a storage bucket:

1. In Supabase dashboard, go to **Storage** (left sidebar)
2. Click **"New Bucket"**
3. Name: `review-photos`
4. Uncheck "Public bucket" (we'll use signed URLs)
5. Click **"Create bucket"**
6. Click bucket name → **Policies** tab
7. Add policy for INSERT:
   - Policy name: `Allow uploads`
   - Allowed operation: `INSERT`
   - Target roles: `service_role`
   - Policy definition: `true`
8. Add policy for SELECT:
   - Policy name: `Allow reads`
   - Allowed operation: `SELECT`
   - Target roles: `anon`, `authenticated`, `service_role`
   - Policy definition: `true`

### Step 5: Setup Database (3 minutes)
1. Once deployed, go to Vercel dashboard
2. Click your project → **Settings** → **Functions**
3. Or use Vercel CLI: `vercel --version` then `vercel`
4. Open **Console** tab
5. Run these commands:
```bash
npx prisma migrate deploy
npx prisma db seed
```

### Step 6: First Login (2 minutes)
1. Go to your deployed URL (Vercel provides this)
2. Login with:
   - Email: `admin@paramount.com`
   - Password: `ChangeMe123!`
3. **Immediately change the admin password**
4. Create your Area Manager accounts
5. Add your 20 stores

---

## 👥 DEFAULT USERS

| Email | Role | Password |
|-------|------|----------|
| admin@paramount.com | GM | ChangeMe123! |
| am-vic@paramount.com | Area Manager | ChangeMe123! |
| am-nsw@paramount.com | Area Manager | ChangeMe123! |

---

## 📊 FEATURES INCLUDED

✅ **Authentication** — Email/password with role-based access  
✅ **Store Management** — Add/edit stores, assign AMs  
✅ **KPI Framework** — All 25 KPIs from your framework  
✅ **Target Setting** — AMs set monthly targets per store  
✅ **Monthly Reviews** — Pre-fill + site visit workflow  
✅ **Photo Uploads** — Evidence capture with captions (promos, displays, compliance)  
✅ **Leaderboard** — Competition rankings  
✅ **Mobile Responsive** — Works on iPad/phone  
✅ **Supplier Management** — Track suppliers and promotions (foundation for supplier scorecards)  

---

## ⚙️ NEXT STEPS (After Deploy)

### 1. Change Passwords
- Login as admin → update password
- Update AM passwords
- Remove test accounts before production

### 2. Add Your Stores
- Dashboard → Stores → Add Store
- Enter name, state, assign AM
- Repeat for all 20 stores

### 3. Create Store Managers
- Admin creates user accounts
- Assign to stores
- Managers login to see their scorecard

### 4. Set First Month Targets
- AM logs in → Set Targets
- Set targets for March 2026
- Store Managers see targets on dashboard

### 5. Conduct First Reviews
- AM opens New Review
- Pre-fill desk data (revenue, GP, etc.)
- Visit store with iPad/phone
- Complete site inspection
- Submit and meet with SM

---

## 💰 COSTS

| Service | Monthly Cost |
|---------|-------------|
| Vercel (Pro) | $20 |
| Supabase (Pro) | $25 |
| **Total** | **$45/month** |

Free tier works for testing (Vercel hobby, Supabase free).

---

## 🔧 TROUBLESHOOTING

**Build fails:**
- Check DATABASE_URL is correct
- Ensure NEXTAUTH_SECRET is set
- Check Vercel deployment logs

**Database connection error:**
- Verify Supabase project is active (not paused)
- Check connection string format
- Ensure IP restrictions allow Vercel

**Prisma errors:**
- Run `npx prisma generate` locally
- Run `npx prisma migrate deploy` in Vercel console
- Check schema is valid

**Login doesn't work:**
- Ensure database is seeded (`npx prisma db seed`)
- Check NEXTAUTH_SECRET is set
- Clear cookies and try again

**Photo upload fails:**
- Check Supabase Storage bucket `review-photos` exists (Step 4)
- Verify RLS policies allow uploads (Step 4)
- Check SUPABASE_URL and SUPABASE_SERVICE_KEY are set correctly in Vercel
- Ensure you're using service_role key (not anon key)

**Where to find Supabase credentials:**
1. **Project URL & API Keys:**
   - Supabase Dashboard → Your Project → Settings (gear icon) → API
   - Copy "Project URL" → this is `SUPABASE_URL`
   - Copy "service_role secret" → this is `SUPABASE_SERVICE_KEY`
   - ⚠️ Never share service_role key publicly

2. **Database Connection String:**
   - Supabase Dashboard → Your Project → Connect (top right)
   - Click "URI" tab
   - Click "Copy"
   - Replace `[YOUR-PASSWORD]` with your actual database password
   - This is your `DATABASE_URL`

---

## 📱 MOBILE SETUP

For AMs using iPad/phone on store visits:

1. Open deployed URL in Safari/Chrome
2. Add to Home Screen (creates app icon)
3. Login once
4. Use offline — forms save locally
5. Syncs when reconnected

---

## 🎯 WHAT'S NOT YET BUILT

Phase 2 features (next 2-3 months):
- [ ] Supplier-facing dashboard — Share promotional compliance with suppliers
- [ ] Excel import for bulk data
- [ ] POS/payroll API integration
- [ ] Email notifications
- [ ] Advanced analytics/charts
- [ ] PDF export of scorecards
- [ ] Offline sync improvements

---

## 🏗️ EXTENSIBLE ARCHITECTURE

This application is built to grow beyond KPIs:

**Current Capabilities:**
- Store-level KPI tracking with photo evidence
- Supplier and promotion management (database ready)
- Photo tagging system for categorization

**Future Supplier Features (ready to build):

1. **Supplier Scorecards**
   - Share promotional compliance % with suppliers
   - Export photo evidence of display execution
   - Track execution across store network
   
2. **Promotion Analytics**
   - Compare compliance across suppliers
   - Identify best/worst performing stores per supplier
   - ROI tracking on promotional spend

3. **Supplier Portal**
   - Login for suppliers to view their own data
   - Real-time compliance dashboard
   - Photo gallery of in-store execution

**How it works:**
- Photos tagged with `supplierId` link to supplier records
- `metadata` JSON field stores flexible data (promo ID, SKU, etc.)
- `Promotion` model tracks promotional periods and requirements
- Same authentication system can grant supplier access

**To activate:**
1. Create supplier accounts in dashboard
2. Tag photos with supplier during review
3. Build supplier-facing pages (I can do this)
4. Share supplier login credentials

---

## 🛠️ DEVELOPMENT (Optional)

If you want to customize:

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed

# Start dev server
npm run dev

# Open http://localhost:3000
```

---

## 📞 SUPPORT

**Deployment issues?**
1. Check Vercel logs (Project → Deployments → Latest)
2. Verify environment variables
3. Test database connection
4. Message me with error details

**Feature requests?**
- List what you need
- I'll prioritize and build

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Supabase project resumed/created
- [ ] GitHub repo created and code pushed
- [ ] Vercel project connected to GitHub
- [ ] Environment variables configured
- [ ] Deploy successful (green checkmark)
- [ ] Database migrations run
- [ ] Database seeded (admin user created)
- [ ] Login works with default credentials
- [ ] Admin password changed
- [ ] First store added

**Ready to deploy? Start with Step 1 above.**
