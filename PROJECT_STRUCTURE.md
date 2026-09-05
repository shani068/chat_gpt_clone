# Project structure

Source lives at the repository root (no `src/`). Path alias: `@/*` → `./*`.

```
app/
  layout.tsx                    fonts, metadata, viewport, provider tree
  page.tsx                      marketing landing page
  error.tsx                     root error boundary
  not-found.tsx                 404
  globals.css                   ← the entire design system
  chat/
    layout.tsx                  metadata + viewport pinning
    page.tsx                    /chat — a new conversation
    [chatId]/page.tsx           /chat/:id — an existing conversation
  (auth)/
    layout.tsx                  centred column with the hero grid
    login/page.tsx              /login  (+ loading.tsx skeleton)
    register/page.tsx           /register
  (dashboard)/
    layout.tsx                  page canvas for non-chat app routes
    settings/page.tsx           /settings
    dashboard/page.tsx          legacy /dashboard → redirects to /chat

components/
  chat/
    chat-shell.tsx              frame: sidebar + main + overlays + shortcuts
    chat-sidebar.tsx            docked and drawer variants
    chat-header.tsx             title, generation status, chat actions
    chat-message-list.tsx       scroll region, states, live-region wiring
    user-message.tsx            bubble + inline editing
    assistant-message.tsx       open content block + actions
    streaming-message.tsx       in-flight answer and caret placement
    message-actions.tsx         copy / edit / regenerate / rating
    chat-composer.tsx           auto-grow input, attachments, send & stop
    file-preview.tsx            attachment chip, all four states
    scroll-to-bottom.tsx        jump pill
    welcome-screen.tsx          zero state
    prompt-suggestions.tsx      starter prompts
    markdown-renderer.tsx       react-markdown pipeline + component overrides
    code-block.tsx              language label, copy, scroll container
  sidebar/
    conversation-search.tsx     ⌘K command menu
    conversation-group.tsx      one dated bucket
    conversation-item.tsx       row, rename, delete confirmation
    user-menu.tsx               account, theme, shortcuts, sign out
  settings/
    settings-dialog.tsx         in-app dialog with section rail
    settings-panel.tsx          the sections themselves (shared)
    settings-section.tsx        section, row and segmented-choice primitives
    settings-page-content.tsx   full-page variant of the same sections
  shared/
    logo.tsx  theme-toggle.tsx  toast-provider.tsx
    empty-state.tsx  error-state.tsx  loading-skeleton.tsx
  ui/
    button.tsx  icon-button.tsx  input.tsx  tooltip.tsx
    dialog.tsx  dropdown-menu.tsx  popover.tsx
    primitives.tsx              separator, skeleton, badge, kbd, avatar, switch
  marketing/
    hero.tsx  feature-grid.tsx  product-preview.tsx
    how-it-works.tsx  call-to-action.tsx  site-footer.tsx
  layout/
    navbar.tsx                  marketing navigation

hooks/
  use-chat.ts                   active conversation + mutations
  use-chat-history.ts           list, grouping, filtering
  use-auto-scroll.ts            sticky-bottom scrolling
  use-keyboard-shortcuts.ts     global bindings + the hint table
  use-media-query.ts            breakpoints, reduced motion
  use-copy-to-clipboard.ts      clipboard write + copied flag

lib/chat/
  mock-chat-service.ts          the whole backend seam
  chat-utils.ts                 ids, titles, date bucketing, search, formatting
  mock-responses.ts             canned answer corpus
  markdown.ts                   highlight.js language registry + hast helpers
  attachments.ts                file validation and object-URL lifecycle

providers/
  app-providers.tsx             composition order
  chat-provider.tsx             conversations, streaming, generation
  preferences-provider.tsx      persisted settings
  session-provider.tsx          mock user

types/                          chat.ts, file.ts, user.ts
constants/                      config.ts, routes.ts, motion.ts
utils/                          cn.ts, format-date.ts
```

## Conventions

- **Colour comes only from tokens.** Components use `bg-card`, `text-muted-foreground`,
  `border-border` — never a raw hex or a Tailwind palette colour.
- **Client components are leaves.** Pages and layouts stay server components; the
  `"use client"` boundary starts at the interactive component.
- **No fake API logic in components.** Anything that would be a network call goes
  through `lib/chat/mock-chat-service.ts`.
- **Icon buttons take a required `label`**, which becomes both the accessible name
  and the tooltip — an unlabelled icon button is unrepresentable.

## Data flow

```
route (chatId)
   → ChatShell effect: openConversation(chatId)
   → ChatProvider: loads via mock service, holds messages
   → useChat()          → message list, composer, header
   → useChatHistory()   → sidebar, ⌘K search
```

Generation writes to React state on every token and persists once, on completion —
so a long answer is not serialised to storage sixty times while it streams.

## Legacy scaffold

These files are from the original Next.js starter and are no longer referenced by
the application. They compile and lint cleanly, and are kept only because they may
be wanted as an HTTP layer for a future backend:

`lib/api.ts` · `lib/auth.ts` · `lib/resolve-error.ts` · `utils/resolve-error.ts` ·
`services/*` · `hooks/useApi.ts` · `hooks/useFetch.ts` · `providers/query-provider.tsx` ·
`types/api.d.ts` · `types/auth.d.ts` · `components/features/dashboard/*` ·
`components/ui/spinner.tsx` · `components/layout/sidebar.tsx` ·
`app/(dashboard)/dashboard/{error,loading}.tsx`
