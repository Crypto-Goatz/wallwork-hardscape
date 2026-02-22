# Updating from Template

This site was created from the `rocket-client-template`. You can pull in framework updates (new admin features, bug fixes, component improvements) without overwriting your client-specific content.

## One-time setup

Add the template as an upstream remote:

```bash
git remote add template https://github.com/0nork/rocket-client-template.git
```

## Pull updates

```bash
git fetch template
git merge template/main
```

Files listed in `.gitattributes` with `merge=ours` will **never** be overwritten by template updates. This includes:

- `client/` — all client-specific configuration
- `.env.local` — environment variables
- `app/tools/**` — custom tools / visualizer pages
- `app/free-estimate/**` — custom lead gen pages
- `app/api/contact/**`, `app/api/leads/**` — custom API routes
- `lib/skills/**` — custom AI skills
- `lib/crm-api.ts` — CRM integration config
- `components/site/CRMChatWidget.tsx` — chat widget config

## What gets updated

Everything else: admin dashboard, setup wizard, core components, lib utilities, config schemas, and shared UI.

## Resolving conflicts

If you've modified a non-protected file that the template also changed, Git will ask you to resolve the conflict. Standard merge resolution applies.

## Powered by Rocket+

Template by [RocketClients.com](https://rocketclients.com) | Part of the [0nork](https://github.com/0nork) ecosystem
