# ACE

ACE is Marcus Hendricks's private AI chief of staff and executive operating system.

The application is designed to answer one question:

> What requires Marcus's attention, judgment, energy, or authorization now?

## Current MVP

ACE currently provides:

- an executive Today briefing
- persistent project tracking
- a decision queue with status controls
- structured memory
- approval-gated actions
- an activity history
- authority-policy visibility
- integration setup planning for Calendar, Gmail, Drive, Contacts, finance, and e-signature
- deterministic demo intelligence, labeled as demo behavior

No external systems, credentials, or financial accounts are connected in this repository.

## Development

Requirements:

- Node.js 22
- npm 10 or later

```bash
npm install
npm run check
npm run build
npm run dev
```

Open `http://localhost:3000`.

## Repository structure

- `app/` — routes, metadata, and styles
- `components/` — ACE product interface
- `hooks/` — persistent client-state behavior
- `lib/` — domain types and seed data
- `docs/` — architecture and delivery roadmap
- `AGENTS.md` — Codex and agent engineering instructions

## Data and privacy

The MVP stores changes in the browser's local storage. It does not contain production credentials or production personal data.

A production ACE deployment with live integrations will require:

- a private repository
- a server-capable deployment environment
- encrypted OAuth-token storage
- a database
- scoped Google and OpenAI credentials
- auditable approval and execution records

GitHub Pages is suitable only for the static demo, not for the production chief-of-staff system.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
