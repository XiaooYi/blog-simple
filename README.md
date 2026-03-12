# 极简全栈博客 (Minimal Full-Stack Blog)

A minimalist full-stack blog built with Next.js 15, TypeScript, Tailwind CSS, and Prisma.

## Features

- 📝 Article list with pagination
- 📖 Article detail pages with Markdown rendering
- 🔐 Admin panel with authentication (protected routes)
- 🗂️ Category and tag management
- ✍️ Markdown editor for writing posts

## Getting Started

### 1. Clone and install dependencies

```bash
git clone https://github.com/XiaooYi/blog-simple.git
cd blog-simple
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-here"  # generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
ADMIN_USER="admin"
ADMIN_PASSWORD="your-password"
```

### 3. Set up the database

```bash
npx prisma migrate dev
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the blog.  
Admin panel is at [http://localhost:3000/admin](http://localhost:3000/admin).

## Deploy on Vercel

### Step 1: Push your code to GitHub

Make sure your code is pushed to your GitHub repository.

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **"Add New → Project"**.
3. Import your GitHub repository `XiaooYi/blog-simple`.
4. Vercel will auto-detect Next.js — keep the default settings.

### Step 3: Set environment variables in Vercel

In the Vercel project settings under **"Environment Variables"**, add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | `file:./prisma/dev.db` |
| `NEXTAUTH_SECRET` | A random base64 string (run `openssl rand -base64 32` to generate) |
| `NEXTAUTH_URL` | Your Vercel deployment URL, e.g. `https://blog-simple.vercel.app` |
| `ADMIN_USER` | `admin` (or your preferred username) |
| `ADMIN_PASSWORD` | A secure password |

> **Note on SQLite and Vercel:** Vercel's serverless functions run in an ephemeral environment. The SQLite database file will be read-only after deployment. This means the blog content is fixed to whatever was in `prisma/dev.db` at build time. To support dynamic content (creating/editing posts after deployment), you should switch to a hosted database like [Neon (PostgreSQL)](https://neon.tech) or [PlanetScale (MySQL)](https://planetscale.com) and update the Prisma schema's `provider` from `sqlite` to `postgresql`.

### Step 4: Deploy

Click **"Deploy"**. Vercel will run `npm run build` (which includes `prisma generate`) automatically.

### Using a Hosted Database (Recommended for Production)

For a fully functional production blog, switch from SQLite to a cloud database:

1. Create a free PostgreSQL database at [Neon](https://neon.tech) or a MySQL database at [PlanetScale](https://planetscale.com).
2. Update `prisma/schema.prisma` to use your chosen provider:
   ```prisma
   datasource db {
     provider = "postgresql"  # or "mysql" for PlanetScale
     url      = env("DATABASE_URL")
   }
   ```
3. Set `DATABASE_URL` in Vercel to your Neon connection string.
4. Run `npx prisma migrate deploy` once to initialize the schema.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org) (App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com)
- **Database:** Prisma + SQLite (easily switchable to PostgreSQL)
- **Auth:** [NextAuth.js](https://next-auth.js.org)
- **Markdown:** react-markdown + remark-gfm

