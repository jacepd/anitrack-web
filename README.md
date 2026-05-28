# 🎌 AniTrack Web

A full-featured anime tracking web app built with **Next.js 14**, **Supabase**, and the **Jikan API**.

## ✨ Features
- 🔍 Search 20,000+ anime (Jikan/MyAnimeList API)
- 📋 Track anime — Watching, Completed, Plan to Watch, On Hold, Dropped
- 👥 Friend activity feed
- ⭐ Ratings & reviews
- 📝 Shared watchlists
- 🌙 Dark anime-themed UI

## 🚀 Quick Start

### 1. Clone & install
```bash
git clone https://github.com/YOUR_USERNAME/anitrack-web.git
cd anitrack-web
npm install
```

### 2. Set up Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/migrations/001_initial_schema.sql` in the SQL editor
3. Copy your URL and anon key

### 3. Add environment variables
```bash
cp .env.example .env.local
# Fill in your Supabase URL and anon key
```

### 4. Run locally
```bash
npm run dev
# Open http://localhost:3000
```

## 🌐 Deploy to Vercel (free)
```bash
npm install -g vercel
vercel
# Follow prompts — add your env vars when asked
```

Or connect your GitHub repo at [vercel.com](https://vercel.com) for automatic deploys on every push.

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Backend | Supabase (auth + database) |
| Anime Data | Jikan API v4 (free, no key) |
| State | Zustand |
| Deployment | Vercel |
| CI/CD | GitHub Actions |
