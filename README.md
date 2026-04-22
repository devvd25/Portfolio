# DevClay Portfolio

Modern developer portfolio with claymorphism-inspired UI, secure admin dashboard, MongoDB CRUD APIs, and Vercel-ready deployment.

## Tech Stack

- Next.js App Router
- Tailwind CSS v4
- Framer Motion
- MongoDB + Mongoose
- Auth via secure HttpOnly cookie + JWT
- Cloudinary upload integration

## Features

- Portfolio sections: Hero, About, Skills, Projects, Contact
- Smooth animations and responsive design
- Dark/light mode toggle
- Admin dashboard (Vietnamese UI)
- Secure admin login
- CRUD projects
- Update profile information
- Upload images to Cloudinary

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env.local
```

3. Fill required variables in `.env.local`.

4. Run development server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Admin Access

- Login URL: `/admin/login`
- Default credentials come from:
	- `ADMIN_EMAIL`
	- `ADMIN_PASSWORD`

On first successful DB connection, the admin account is auto-seeded if missing.

## Deploy to Vercel

1. Push code to GitHub.
2. Import repository in Vercel.
3. Add all env variables from `.env.example` in Vercel Project Settings.
4. Deploy.

## Notes

- If `MONGODB_URI` is missing, portfolio falls back to local seed data for public view.
- Admin write actions require MongoDB.
- Image upload requires Cloudinary env variables.
