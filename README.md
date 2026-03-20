# 🚀 TaskFlow

<p align="center">
  A modern, full-stack task management application with a focus on speed, security, and a premium user experience.
</p>

---

## 🧾 About

**TaskFlow** is a powerful productivity tool built with **Next.js 16 (App Router)** and **Supabase**. It features real-time data syncing, secure social authentication, and a high-performance, dark-themed interface.

---

## 📦 Features

- **Full-Stack Architecture**: Powered by Next.js Server Components and API Routes.
- **Secure Authentication**: Integrated GitHub and Google OAuth via Supabase.
- **Real-Time Database**: Instant task updates and project organization.
- **Resilient Auth Sync**: Custom-built fallback for fragment-based session recovery.
- **Premium UI**: Modern, responsive design with custom glassmorphism effects.

---

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Backend/Auth**: [Supabase](https://supabase.com/) (@supabase/ssr)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/) & [Google Material Symbols](https://fonts.google.com/icons)
- **Deployment**: [Vercel](https://vercel.app/)

---

## 🧠 Implementation Journey & Troubleshooting

Building TaskFlow involved overcoming several modern web development challenges. Here’s a summary of the problems we faced and how we solved them:

### 1. Framework Compatibility (Next.js 15/16)
- **Problem**: We encountered build failures on Vercel because `cookies()` from `next/headers` is now asynchronous in newer Next.js versions.
- **Fix**: Refactored the entire backend (API routes and Auth callback) to properly `await cookies()`, ensuring compatibility with the latest Next.js standards.

### 2. Modernizing Supabase Auth
- **Problem**: The project originally used deprecated auth-helpers, which caused build warnings and stability issues.
- **Fix**: Successfully migrated to the modern `@supabase/ssr` package. This required building a custom `supabase-server.ts` helper to manage authenticated server-side sessions.

### 3. The "localhost" Redirect Bug
- **Problem**: Social login redirects often defaulted back to `localhost:3000` even in production.
- **Fix**: Identified that the **Site URL** in Supabase Dashboard needed to be manually updated to the Vercel production URL. We also improved the code to use `window.location.origin` dynamically.

### 4. Resilient Session Recovery (The Fragment Fix)
- **Problem**: Sometimes Supabase returns auth tokens in a URL fragment (`#access_token=...`) which the server can't see, leading to 404s or failed logins.
- **Fix**: Developed a global `AuthSync` component that sits in the root layout. It explicitly parses the URL fragment as a fail-safe, ensuring users are instantly logged in and redirected to the dashboard even if the standard callback fails.

---

## 📈 Getting Started

### 1. Environment Variables
Create a `.env.local` file with your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_SITE_URL=your_production_url
```

### 2. Install & Run
```bash
npm install
npm run dev
```

---

## ⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub!

---

## 📜 License

Distributed under the MIT License.