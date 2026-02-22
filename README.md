# Rocket Client Template

A white-label client site template powered by **Google Workspace as CMS**, **Gemini AI** for content generation, **CRO9** for analytics, and **RocketAdd** for CRM integration.

Clone, configure, deploy. New client sites in ~30 minutes.

## Stack

- **Next.js 15** (App Router, React 19, TypeScript)
- **Tailwind CSS 4**
- **Google Sheets** as content database
- **Google Drive** for media storage
- **Gemini AI** for content generation (client's own API key)
- **CRO9** analytics + behavioral tracking
- **RocketAdd** CRM OAuth integration

## Quick Start

```bash
npm install
cp .env.example .env.local
# Fill in environment variables
npm run dev
```

## Full Deployment Guide

See [DEPLOY.md](./DEPLOY.md) for the complete step-by-step deployment process.

## Project Structure

```
app/           Public pages + admin dashboard + API routes
components/    Site, admin, and UI components
lib/           Google, Gemini, CRM, CRO9 integrations
config/        Site config + Sheets schema
```

## Part of the Rocket+ Ecosystem

Built by [RocketClients.com](https://rocketclients.com) | [0nork](https://github.com/0nork)
