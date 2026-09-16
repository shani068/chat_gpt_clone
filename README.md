# ChatGPT Frontend

Next.js client for a ChatGPT-style AI assistant. Authenticated users get a full chat shell with streaming replies, conversation history, and settings. Guests land on a marketing page.

The browser talks only to this app’s origin. Auth, conversations, messages, and chat streaming are proxied to the Express backend via `/api/*`.

## Stack

| Technology | Role |
| --- | --- |
| Next.js 16 (App Router) | UI, routing, API rewrite proxy |
| React 19 + TypeScript | Application layer |
| Tailwind CSS v4 | Design tokens and styling |
| Better Auth | Email/password and Google OAuth (client) |
| TanStack Query + Axios | REST (conversations, messages, profile) |
| Vercel AI SDK (`ai`) | UI message streaming transport |
| Radix UI + lucide-react | Accessible primitives and icons |
| react-markdown + remark-gfm + rehype-highlight | Markdown and code blocks |
| Framer Motion | Motion |
| next-themes | Light / dark theme |
| React Hook Form + Zod | Auth forms |

## Prerequisites

- [Bun](https://bun.sh) (preferred; `bun.lock` is the lockfile) or Node.js 20+
- Running backend from [`chat_gpt_backend`](../chat_gpt_backend) on port **4000**
- PostgreSQL and OpenAI configured on the backend

## Getting started

```bash
cd chat_gpt_project
bun install
cp .env.example .env.local
# set BACKEND_URL if the API is not on http://localhost:4000
bun run dev
```

App: [http://localhost:3000](http://localhost:3000)

| Script | Description |
| --- | --- |
| `bun run dev` | Dev server (webpack) |
| `bun run dev:turbo` | Dev server (Turbopack) |
| `bun run dev:clean` | Clear `.next`, then start webpack dev |
| `bun run build` | Production build |
| `bun start` | Serve production build |
| `bun run lint` | ESLint |

## Environment

| Variable | Required | Description |
| --- | --- | --- |
| `BACKEND_URL` | Yes | Express API origin used by Next rewrites (default `http://localhost:4000`) |
| `NEXT_PUBLIC_API_URL` | No | Axios base URL; defaults to `http://localhost:3000` so requests stay same-origin and cookies work |

Do not expose backend secrets or `OPENAI_API_KEY` in this project. The browser must never call the Express origin directly for auth/cookies.

## Architecture

```
Browser (localhost:3000)
  └── /api/*  ──rewrite──►  Express (localhost:4000)
        ├── /api/auth/*          Better Auth
        ├── /api/v1/conversations
        ├── /api/v1/messages
        └── /api/chat            Streaming completions
```

- **`next.config.ts`** — rewrites `/api/:path*` to `${BACKEND_URL}/api/:path*`
- **`proxy.ts`** — session gate for `/c`, `/chat`, `/settings`, `/dashboard`; redirects signed-in users away from auth pages
- **`lib/auth-client.ts`** — Better Auth client (same-origin `/api/auth/*`)
- **`providers/chat-provider.tsx`** — conversations and stream orchestration
- **`lib/chat/stream-chat.ts`** — `POST /api/chat` streaming transport

## Routes

| Route | Description |
| --- | --- |
| `/` | Marketing (signed out) or chat home (signed in) |
| `/c/[conversationId]` | Active conversation |
| `/chat`, `/chat/[chatId]` | Legacy redirects → `/` or `/c/:id` |
| `/login`, `/register` | Email/password and Google sign-in |
| `/settings` | Full-page settings |

## Features

- **Auth** — email/password and Google OAuth via Better Auth (httpOnly session cookies)
- **Streaming chat** — token stream from the backend; stop, regenerate, retry, and edit user messages
- **Conversations** — create, open, rename, pin, archive, delete; sidebar search (`⌘/Ctrl + K`)
- **Rich replies** — GitHub-flavoured markdown, syntax-highlighted code, copy actions
- **Settings** — theme, composer behaviour, streaming and UI preferences (dialog + `/settings`)
- **Keyboard shortcuts** — new chat, search, send, sidebar, settings, focus composer

### Local-only leftovers

Preferences persistence, simulated file upload, and settings export/clear still use local helpers under `lib/chat/`. Conversation history and generation are backed by the API.

## Project structure

```
app/                 # App Router pages and layouts
components/          # chat, sidebar, settings, marketing, auth, ui
constants/           # routes and shared config
hooks/               # data fetching, chat UX, shortcuts
lib/                 # api client, auth client, chat streaming
providers/           # session, chat, preferences, query, theme
types/               # shared TypeScript types
proxy.ts             # auth route protection
next.config.ts       # /api rewrite to BACKEND_URL
```

## Pairing with the backend

1. Start PostgreSQL and configure `chat_gpt_backend` (see its README).
2. Run the API: `bun run dev` in `chat_gpt_backend` → port **4000**.
3. Set `BACKEND_URL=http://localhost:4000` in this app’s `.env.local`.
4. Set the backend `BETTER_AUTH_URL=http://localhost:3000` so cookies and OAuth callbacks match the Next origin.
5. For Google OAuth, authorize `http://localhost:3000/api/auth/callback/google`.

## License

Private / unlicensed unless otherwise stated.
