# ChatGPT

A production-quality frontend for an AI assistant — conversation history, simulated
token streaming, file analysis, markdown and code rendering, and a settings layer
that actually persists.

Every interaction in the product is real. The model responses are simulated behind
a service boundary that mirrors the shape of a real completions API, so connecting
a backend means replacing one file.

```
npm install     # or: bun install
npm run dev     # http://localhost:3000
```

## Routes

| Route | What it is |
| --- | --- |
| `/` | Marketing page, built from the application's own components |
| `/chat` | A new conversation |
| `/chat/[chatId]` | An existing conversation |
| `/settings` | Full-page settings (same sections as the in-app dialog) |
| `/login`, `/register` | Mock authentication |

## What works

**Conversations** — create, open, rename, delete, and search. History is grouped
into Today / Yesterday / Previous 7 days / Older and persisted to `localStorage`
behind a service abstraction.

**Streaming** — responses arrive token by token with word-aware chunking and
pauses at sentence and block boundaries, so the cadence reads like generation
rather than a progress bar. Stop halts it on the frame you press it; the partial
answer stays on screen.

**Message actions** — copy, regenerate, thumbs up/down, and inline editing of a
user message (which rewrites the response below it). Actions reveal on hover on
pointer devices and stay visible on touch.

**Rich content** — GitHub-flavoured markdown with syntax-highlighted code blocks,
per-block copy, horizontally scrolling tables, and long URLs that cannot break the
layout. Only nine highlight.js grammars are registered, so the client bundle does
not carry 190 of them.

**Attachments** — PDF, TXT, DOCX, PNG, JPG, CSV and JSON, validated for type and
size before a simulated resumable upload, with pending / uploading / uploaded /
error states, drag-and-drop, and paste.

**Settings** — theme, Enter-key behaviour, streaming, auto-scroll,
message actions, data export and deletion. All persisted locally.

## Keyboard

| | |
| --- | --- |
| `⌘/Ctrl + K` | Search conversations |
| `⌘/Ctrl + ⇧ + O` | New chat |
| `⌘/Ctrl + Enter` | Send |
| `⌘/Ctrl + B` | Toggle sidebar |
| `⌘/Ctrl + ,` | Settings |
| `/` | Focus composer |
| `Esc` | Close dialog, menu or drawer |

Modifier keys resolve per platform, so every binding works on macOS and Windows.

## Design system

Dark is the primary experience; light is a first-class peer. Both resolve from one
set of HSL custom properties in [`app/globals.css`](app/globals.css) — no component
declares a colour of its own.

- **Type scale** — display / h1 / h2 / h3 / body / chat / small / caption / code,
  defined as Tailwind v4 theme tokens rather than ad-hoc sizes
- **Radius** — 6 / 8 / 10 / 12px; controls sit at 8–10px
- **Elevation** — surface contrast and hairlines do the work; shadows are reserved
  for dialogs, popovers, the composer and the command menu
- **Motion** — one easing curve (`cubic-bezier(0.22, 1, 0.36, 1)`) and four
  durations, with `prefers-reduced-motion` removing non-essential animation rather
  than shortening it

UI primitives are built on Radix and styled from scratch — no untouched defaults.

## Accessibility

Visible focus on every interactive element, semantic buttons throughout, labelled
icon buttons, `aria-expanded` / `aria-selected` / `aria-current` where they apply,
and a command menu driven by `aria-activedescendant` so focus stays in the input.

The transcript is a `role="log"` region with live announcements switched **off**,
because announcing every streamed token is unusable. A separate visually hidden
status region reports when generation starts and finishes.

## Architecture

```
app/                    routes (App Router)
components/
  chat/                 shell, sidebar, header, message list, composer, markdown
  sidebar/              conversation rows, grouping, ⌘K search, user menu
  settings/             dialog, sections, full-page variant
  shared/               logo, theme toggle, toasts, empty/error/loading states
  ui/                   button, icon button, input, dialog, dropdown, popover…
  marketing/            hero, feature grid, product preview, CTA, footer
hooks/                  use-chat, use-chat-history, use-auto-scroll, shortcuts…
lib/chat/               mock service, chat utils, markdown config, attachments
providers/              chat, preferences, session, toasts, theme
types/                  chat, file, user
```

State is split by concern: `ChatProvider` owns conversations and generation,
`PreferencesProvider` owns settings, `SessionProvider` owns the mock user, and
`next-themes` owns the theme — one source of truth each.

### Connecting a real backend

[`lib/chat/mock-chat-service.ts`](lib/chat/mock-chat-service.ts) is the only module
that knows the data is fake. It exposes the functions a real client would:

```ts
getConversations()  getConversation(id)  createConversation()
renameConversation(id, title)  deleteConversation(id)  saveConversation(c)
streamAssistantResponse(options, callbacks)  uploadFile(file, onProgress)
```

No component reads `localStorage` or calls `setTimeout` to fake latency. Replace
the bodies with `fetch` and the UI is unchanged.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Radix UI ·
Framer Motion · lucide-react · react-markdown + remark-gfm + rehype-highlight ·
React Hook Form + Zod · next-themes

## Notes

- Simulated generation fails roughly 1 time in 50 so the inline error and retry
  path is reachable in normal use. Sending a message starting with `/error`
  forces it deterministically.
- Conversations live in `localStorage` under `chatgpt.*` keys. Nothing is sent
  anywhere.
