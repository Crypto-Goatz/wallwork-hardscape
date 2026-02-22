# Rocket Client Template — Deployment Guide

Deploy a new client site in minutes using the AI-powered setup wizard.

## Quick Start (Recommended)

### Step 1: Clone & Deploy

```bash
git clone https://github.com/0nork/rocket-client-template.git client-name-site
cd client-name-site
rm -rf .git && git init && git add . && git commit -m "Initial commit from rocket-client-template"
```

Push to GitHub and deploy on Vercel. Set only **3 environment variables**:

| Variable | Description |
|----------|-------------|
| `ADMIN_PASSWORD` | Password to access `/admin` |
| `VERCEL_TOKEN` | Vercel API token (from vercel.com/account/tokens) |
| `VERCEL_PROJECT_ID` | Your Vercel project ID (from project Settings > General) |

### Step 2: Run the Setup Wizard

Visit `/admin` on your deployed site. You'll be redirected to the AI-powered setup wizard which will:

1. Collect your business info and brand colors
2. Create a Google Sheet with all 8 content tabs automatically
3. Create Google Drive folders for media
4. Generate initial content with AI (services, FAQs, blog posts, SEO)
5. Connect optional integrations (CRM, CRO9)
6. Save all env vars to Vercel and trigger a redeployment

**You'll need:**
- A Google Cloud service account JSON key (Sheets + Drive APIs enabled)
- A Gemini API key (optional, for AI content generation)

That's it! The wizard handles everything else.

---

## Manual Setup (Advanced)

If you prefer to set up manually without the wizard:

### Prerequisites

- Node.js 18+
- A Google Workspace account (for Sheets + Drive CMS)
- A Google Cloud project with Sheets API & Drive API enabled
- Vercel account (for hosting)
- Optional: CRO9 account, CRM sub-account

### Create the Google Sheet

Create a spreadsheet with these tabs:
- `site_config` — columns: `key`, `value`
- `services` — columns: `id`, `title`, `slug`, `description`, `image_id`, `icon`, `order`
- `portfolio` — columns: `id`, `title`, `description`, `image_ids`, `category`, `date`
- `testimonials` — columns: `id`, `name`, `role`, `text`, `rating`, `image_id`
- `blog` — columns: `id`, `title`, `slug`, `content`, `excerpt`, `image_id`, `published_at`, `status`
- `team` — columns: `id`, `name`, `role`, `bio`, `image_id`
- `faqs` — columns: `id`, `question`, `answer`, `category`
- `seo` — columns: `page_path`, `title`, `description`, `og_image_id`

In `site_config`, add: `business_name`, `phone`, `email`, `tagline`, `setup_complete=true`.

### Create the Drive Folder

Create a folder with subfolders: `portfolio/`, `team/`, `blog/`, `general/`.

### Set Environment Variables

Required:
- `GOOGLE_SHEETS_ID` — Spreadsheet ID
- `GOOGLE_DRIVE_FOLDER_ID` — Folder ID
- `GOOGLE_SERVICE_ACCOUNT_KEY` — base64-encoded JSON key
- `ADMIN_PASSWORD` — admin access password
- `SESSION_SECRET` — `openssl rand -hex 32`

Optional:
- `GEMINI_API_KEY` — Gemini API key
- `NEXT_PUBLIC_CRO9_KEY` — CRO9 analytics key
- `NEXT_PUBLIC_CRM_TRACKING_ID` — CRM tracking ID

Site branding (optional — can also be set via `site_config` sheet tab):
- `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_SITE_PHONE`, `NEXT_PUBLIC_SITE_EMAIL`
- `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_TAGLINE`
- `NEXT_PUBLIC_COLOR_PRIMARY`, `NEXT_PUBLIC_COLOR_SECONDARY`, `NEXT_PUBLIC_COLOR_ACCENT`

---

## Updating from Template

See [UPDATING.md](./UPDATING.md) for how to pull framework updates without overwriting client content.

## File Structure Reference

```
app/             — Next.js pages (public site + admin dashboard + setup wizard)
components/      — React components (site/, admin/, ui/)
lib/             — Backend integrations (google/, setup/, gemini, crm, cro9)
config/          — Site and sheet schema configuration
client/          — Client-specific files (protected from template updates)
public/          — Static assets
```

## Updating Content

Clients can update content in two ways:
1. **Google Sheets** — Edit the spreadsheet directly (changes appear within 5 minutes)
2. **Admin Dashboard** — Use `/admin/content` to edit through the web interface

## Powered by Rocket+

Template by [RocketClients.com](https://rocketclients.com) | Part of the [0nork](https://github.com/0nork) ecosystem
