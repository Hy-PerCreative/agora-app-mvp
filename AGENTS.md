# ACE repository instructions

## Product

ACE is Marcus Hendricks's private AI chief of staff and executive operating system. It should reduce the amount of context, coordination, and follow-up Marcus must hold personally.

The primary product question is:

> What requires Marcus's attention, judgment, energy, or authorization now?

## Engineering priorities

1. Preserve user control and explicit approval boundaries.
2. Do not imply an integration is live when it is mocked or disconnected.
3. Keep private credentials and personal data out of source control.
4. Prefer small, testable modules over one large page component.
5. Every visible action must either work or clearly explain why it is unavailable.
6. Mobile is a first-class interface.
7. Maintain an auditable activity history for consequential actions.

## Stack

- Next.js App Router
- TypeScript in strict mode
- React
- Static export for the demo deployment
- Local persistence for the MVP
- Future server-side persistence and integrations behind explicit environment configuration

## Commands

```bash
npm install
npm run check
npm run build
npm run dev
```

## Architecture boundaries

- `app/`: routes, metadata, and global styles
- `components/`: product UI and interaction components
- `hooks/`: reusable client-state behavior
- `lib/`: domain types, seed data, and pure utilities
- `docs/`: architecture, roadmap, and operating decisions

Do not put API keys in client components. Live Gmail, Calendar, Drive, finance, e-signature, and OpenAI integrations must use server-side routes or a dedicated backend with scoped OAuth credentials.

## Definition of done

A change is complete only when:

- TypeScript passes.
- The production build succeeds.
- Relevant buttons and state transitions work.
- Empty and failure states are handled.
- Mocked behavior is labeled accurately.
- No secrets or unnecessary personal data are committed.
