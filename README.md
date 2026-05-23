<div align="center">
<img width="1200" height="475" alt="Developer Atlas Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# Developer Atlas V.2

**A full-stack developer portfolio powered by React, Firebase, and Google Gemini AI.**

[![Deploy](https://img.shields.io/badge/Live-GitHub%20Pages-brightgreen)](https://Emmanr-eng.github.io/developer-atlas-v-2/)
[![License](https://img.shields.io/badge/license-private-red)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)

</div>

---

## Overview

Developer Atlas V.2 is a personal developer portfolio and content platform. It combines a polished public-facing site with a Firebase-backed admin panel for managing blog posts, projects, and contact inquiries — all enhanced with Google Gemini AI.

### Sections

| Section | Description |
|---|---|
| **Home** | Hero / introduction |
| **Portfolio** | Showcase of projects |
| **Lab** | Experimental work & demos |
| **Timeline** | Career / project history |
| **Blog** | Articles with draft & published states |
| **Contact** | Inquiry form backed by Firestore |
| **Admin** | Protected dashboard (admin-only) |

---

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build tool:** Vite 6
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion (via `motion`)
- **Routing:** React Router v7
- **Backend / DB:** Firebase (Firestore + Auth)
- **AI:** Google Gemini (`@google/genai`)
- **Deployment:** GitHub Pages (`gh-pages`)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- A Firebase project with Firestore and Authentication enabled
- A [Google Gemini API key](https://aistudio.google.com/)

### Installation

```bash
git clone https://github.com/Emmanr-eng/developer-atlas-V.2.git
cd developer-atlas-V.2
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `APP_URL` | The URL where the app is hosted |

> Firebase config is loaded from `firebase-applet-config.json`. Update it with your own project credentials.

### Run Locally

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run preview:local` | Preview build on `0.0.0.0:4173` with Vite server |
| `npm run lint` | Type-check with TypeScript |
| `npm run deploy` | Build and deploy to GitHub Pages |
| `npm run clean` | Remove `dist/` and `server.js` |

### White Screen / MIME Type Module Error

If the browser reports a MIME error for module scripts, it usually means the app tried to load either:

- Source files like `src/main.tsx` from a plain static server, or
- A missing built asset path that got rewritten to HTML.

Use the project with Vite commands only:

```bash
npm run dev
```

or for production output:

```bash
npm run build
npm run preview:local
```

---

## Firebase Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Firestore** and **Authentication** (Email/Password).
3. Copy your Firebase config into `firebase-applet-config.json`.
4. Deploy Firestore security rules:

```bash
firebase deploy --only firestore:rules
```

### Firestore Collections

| Collection | Access |
|---|---|
| `users` | Auth-gated; admin can list all |
| `projects` | Public read; owner/admin write |
| `posts` | Published posts are public; drafts admin-only |
| `inquiries` | Anyone can create; admin-only read/update/delete |

---

## Deployment

The app deploys to GitHub Pages via `gh-pages`:

```bash
npm run deploy
```

Ensure the `homepage` field in `package.json` matches your GitHub Pages URL.

---

## Project Structure

```
src/
├── components/      # Shared UI components (Layout, etc.)
├── hooks/           # Custom React hooks (useAuth, useTheme)
├── lib/             # Firebase and utility helpers
├── pages/           # Route-level page components
│   ├── Home.tsx
│   ├── Portfolio.tsx
│   ├── Lab.tsx
│   ├── Timeline.tsx
│   ├── Blog.tsx
│   ├── Contact.tsx
│   ├── PostDetail.tsx
│   ├── Admin.tsx
│   └── MainAtlas.tsx
├── App.tsx
└── main.tsx
```

---

## License

Private repository — all rights reserved.
