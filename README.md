# Skill Path

Skill Path is an AI-powered discovery and growth platform that helps people understand their interests, explore hobbies and career paths, connect with mentors and communities, and build personalized learning roadmaps.

## Overview

The app combines:
- interest discovery and recommendation flows
- personalized roadmap generation
- challenge tracking and progress exploration
- mentor and community discovery
- AI-guided support and adaptive recommendations

This project is built with React + TypeScript and Vite, with AI-powered features integrated through Gemini.

## Features

- Discovery flow to identify interests and strengths
- Explore interests and recommended learning paths
- Roadmap creation and management
- Challenge and learning activity views
- Mentor and community browsing
- Memory and AI guide tools
- Supabase-ready configuration for app data and integration

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Motion
- Gemini AI via `@google/genai`
- Supabase-ready integration

## Project Structure

```text
.
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── assets/
│   ├── components/
│   ├── data/
│   ├── services/
│   ├── supabase/
│   ├── types/
│   └── views/
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ or newer
- npm

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

The app is configured to run on port 3000 via Vite.

### Production build

```bash
npm run build
```

### Lint/type-check

```bash
npm run lint
```

## Environment Variables

Copy the sample environment file and configure any required values:

```bash
cp .env.example .env
```

The project expects values such as:

- `GEMINI_API_KEY`: API key for Gemini AI access
- `APP_URL`: app URL used for runtime links and callbacks

## Available Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — create a production build
- `npm run preview` — preview the built app
- `npm run lint` — run TypeScript type checking
- `npm run clean` — remove build artifacts

## Notes

- This app uses AI Studio-style runtime secret injection for Gemini configuration.
- The current repo is a single-page React application focused on discovery, growth, and learning experiences.
- For deployment/runtime environments, ensure the required secret and app URL values are configured properly.

## License

This project does not currently appear to define a license file. If needed, add a license before publishing or distributing it publicly.
