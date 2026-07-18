# ACE architecture

## Purpose

ACE is a private executive command center. The MVP is intentionally local-first and approval-first. It provides a coherent interface before any system is granted authority over email, calendars, files, contracts, or money.

## Current MVP

The current application is a static-exported Next.js app with:

- Today briefing
- Project portfolio
- Decision queue
- Structured memory
- Approval queue
- Authority policy display
- Integration setup placeholders
- Deterministic demo intelligence

State is currently client-side. No live external system is connected.

## Target architecture

### Interface

Next.js application optimized for desktop and mobile.

### Application services

Server-side routes or a dedicated backend will handle:

- OpenAI Responses API calls
- OAuth token exchange and refresh
- Gmail and Google Calendar actions
- Google Drive indexing
- audit logging
- scheduled brief generation
- policy evaluation

### Data

A relational database should store:

- users
- organizations and ventures
- projects
- decisions
- approvals
- memories
- commitments
- people and relationships
- activities
- authority policies
- integration accounts

Sensitive OAuth tokens should be encrypted separately from normal application records.

### Agent boundary

The model may recommend and prepare actions. A policy engine determines whether an action is:

- observable only
- recommendable
- preparable
- approval-required
- delegated within a rule
- prohibited

The model must not decide its own authority level.

## Security rules

- Never expose secrets in browser bundles.
- Use least-privilege OAuth scopes.
- Require explicit approval for new recipients, new vendors, money movement, contracts, hiring decisions, destructive changes, and other high-consequence actions.
- Record who proposed, approved, and executed consequential actions.
- Treat this repository as containing no production personal data.

## Deployment

The demo can be statically exported and deployed to GitHub Pages. A production version with live integrations will require a server-capable host and a private database.
