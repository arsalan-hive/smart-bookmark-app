**Smart Bookmar App**

Live vercel link : https://smart-bookmark-app-nine-gules.vercel.app/

A small bookmark manager built with Next.js (App Router), Supabase (Auth, Database, Realtime), Tailwind for UI, and deployed to Vercel.
This README documents what I built, how to run it locally, and most importantly the problems I ran into and how I solved them.

**What this project does**
- Sign in using Google OAuth (no email/password).
- Add bookmarks (title + URL) scoped to the logged-in user.
- Bookmarks are private per user (Row Level Security).
- Real-time sync across tabs (add/delete).
- Delete bookmarks.
- Deployed to a live URL on Vercel.

**Quick start (local)**

Clone the repo:
git clone https://github.com/arsalan-hive/smart-bookmark-app.git

cd smart-bookmark-app

Install:

npm install

Create .env.local with the following environment variables:

NEXT_PUBLIC_SUPABASE_URL=https://<your_superbase_ref>.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY= <your_anon_key>

NEXT_PUBLIC_APP_URL=http://localhost:3000

Run:

npm run dev

Set up the Google OAuth client in the Google Cloud Console and enable Google provider in the Supabase dashboard (see “Deployment & OAuth notes” below).

Files :
- app/page.tsx 
- components/GoogleSignIn.tsx
- components/AuthStatus.tsx 
- components/AddBookmark.tsx
- components/BookmarkList.tsx 
- lib/supabaseClient.ts
- README.md
  
**Deployment & OAuth notes**
Deploy to Vercel by connecting your Git repo and setting environment variables.
In the Supabase dashboard:
- Add http://localhost:3000 and your Vercel URL to Redirect URLs.
- Enable the Google provider and paste the client ID/secret from Google Cloud Console.
- In the Google Console, add https://<your_superbase_ref>.supabase.co/auth/v1/callback as the Authorized redirect URI.

**Problems I ran into (questions I asked while building):**

1.How do I configure redirect URIs for Google OAuth?

ans :Google must redirect to the Supabase callback, not directly to your app. The correct redirect URI is:
https://<your-supabase-ref>.supabase.co/auth/v1/callback
Add that in the Google Cloud Console (Authorized redirect URIs). In Supabase -> Auth -> URL Configuration, add your app URLs (http://localhost:3000 for dev, and your Vercel URL for production). The common mistake is pasting the localhost callback into Google that fails.

2.I can log in, but bookmarks aren’t showing ,is it a policy issue?

ans : Yes, Row Level Security (RLS) must be enabled and you must add policies for SELECT/INSERT/DELETE. For this app the safe policies are:
INSERT policy - WITH CHECK (user_id = auth.uid())
SELECT policy - USING (user_id = auth.uid())
DELETE policy - USING (user_id = auth.uid())
Note: RLS must be enabled on the table or Supabase will deny access in many client scenarios.

3.Realtime used to work, but after tightening SELECT policy to 'authenticated' inserts don’t show in the creating tab,why?

ans : Supabase Realtime can be affected by policy timing: if your realtime subscription is created before the client is fully authenticated, the socket may be unauthenticated and you won’t receive events back to the same client. The correct solution is to wait for session hydration before subscribing. In code, call supabase.auth.getSession() and only subscribe after a valid session exists.

4.I create a bookmark in Tab A an Tab B sees it immediately but Tab A does not until refresh. Why?

ans : Supabase realtime sometimes doesn’t echo back the insert to the same socket. The robust approach is to:
Update the local React state immediately after a successful insert (optimistic or confirmational update).
Keep realtime for cross-tab sync.

5.Should I require .com or auto-add https:// for URLs?

ans :Do not require .com. Better UX is to auto-prepend https:// when protocol is missing and then validate using new URL(cleanUrl). This covers localhost, .app domains, IPs, etc. This approach is implemented in AddBookmark.

6. How do I prevent empty titles/URLs from being saved?

ans : It involves two steps -

a)Frontend: trim inputs and validate before sending.

b)Backend (Supabase): mark the columns NOT NULL and add CHECK constraints to reject blank text.

