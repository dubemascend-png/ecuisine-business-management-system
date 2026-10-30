# eCuisine Business Management System

A responsive business workspace for eCuisine Foods, built with React, Vite and Supabase.

## Local development
- Install Node.js 20 or newer.
- Run `npm install`.
- Run `npm run dev`.

## Deployment
The GitHub Actions workflow builds and deploys the site to GitHub Pages after every push to `main`. In repository **Settings → Pages**, choose **GitHub Actions** as the deployment source.

## Authentication
The app includes account creation, password sign-in and password reset. Supabase email confirmation and SMTP settings control verification email delivery. Configure the deployed GitHub Pages URL in Supabase **Authentication → URL Configuration** before testing email links.

## Security
The browser uses only the Supabase publishable key. Never add a service-role or secret key to client code. Business data access must remain protected by database Row Level Security (RLS).