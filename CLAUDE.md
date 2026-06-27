# Next.js Template — Claude Instructions

> **IMPORTANT:** Read this entire file before writing a single line of code.
> Every rule here is enforced — no exceptions, no legacy patterns.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Next.js | 16.x | Framework — App Router ONLY |
| React | 19.x | UI library |
| TypeScript | ^5 | Strict mode always |
| Tailwind CSS | ^4 | Styling — v4 syntax only |
| TanStack Query | ^5 | Server state & data fetching |
| Axios | ^1 | HTTP client |
| Zod | ^4 | Schema validation — v4 syntax only |
| Bun | latest | Package manager & runtime |
| Prettier | ^3 | Code formatting |
| ESLint | ^9 | Linting |

---

## ⚡ SKILLS — Read Before Writing Any Code

This project has a `.claude/skills/` folder with skill files. These are
**mandatory** — Claude must read and follow the relevant skill before writing
code in that area. Skills override general knowledge when they conflict.

| Skill | When to read it |
|-------|----------------|
| `next-best-practices` | Before writing any page, layout, route handler, or Server Action |
| `tanstack-query-best-practices` | Before writing any `useFetch`, `usePost`, or any data fetching hook |
| `typescript-best-practices` | Before writing any `.ts` or `.tsx` file |
| `better-auth-best-practices` | Before writing any auth logic, session handling, or middleware |
| `shadcn` | Before adding or modifying any shadcn/ui component |

**Rule:** If a skill file exists for the task — read it first, then write code.
Never rely on training data alone when a skill is available.

---

## Quick Start

```bash
bun dev        # Dev server → http://localhost:3000
bun build      # Production build
bun start      # Run production build
bun lint       # Run ESLint
```

---

## Project Structure

```
next-js-template/
├── app/                    # Routes ONLY — no components, no business logic here
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── error.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── not-found.tsx
│   ├── error.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                 # Generic reusable: Button, Input, Badge, Modal, Card
│   ├── layout/             # Header, Footer, Sidebar, Navbar
│   └── features/           # Feature-specific components
│       ├── auth/
│       └── dashboard/
├── hooks/                  # Custom React hooks — always prefix "use"
│   ├── useApi.ts           # usePost, usePut, usePatch, useDelete, useUpload
│   └── useFetch.ts         # useQuery wrapper for GET requests
├── lib/                    # Third-party SDK configs ONLY
│   ├── api.ts              # Axios instance
│   ├── auth.ts             # Auth config/helpers
│   └── validations/        # Zod schemas
│       └── auth.schema.ts
├── utils/                  # Pure helper functions — no React, no side effects
│   ├── resolve-error.ts
│   ├── format-date.ts
│   └── cn.ts               # clsx + tailwind-merge
├── services/               # Business logic — reusable across hooks & components
│   ├── auth.service.ts
│   └── user.service.ts
├── providers/              # React context providers
│   ├── query-provider.tsx
│   └── app-providers.tsx
├── constants/              # App-wide constants — no magic strings anywhere
│   ├── routes.ts
│   └── config.ts
├── types/                  # Global TypeScript types
│   ├── api.d.ts
│   └── auth.d.ts
└── public/
    ├── images/
    ├── icons/
    └── fonts/
```

---

## 🚫 Dead Code & Legacy Syntax — STRICTLY FORBIDDEN

Claude must NEVER write old or deprecated syntax. Always use the latest
API for every library in this project.

### Zod — v4 Syntax Only

```ts
// ✅ CORRECT — Zod v4
import { z } from 'zod'

const schema = z.object({
  email: z.email(),
  name: z.string().min(2),
  age: z.number().min(18),
})

z.string().min(1, 'Required')
z.string().url()
z.string().email()

// ❌ FORBIDDEN — Zod v3 legacy
z.string().email({ message: '...' })   // old overload style
z.string().nonempty()                  // removed in v4 — use .min(1)
z.object({}).strict()                  // different API in v4
```

### Tailwind CSS — v4 Syntax Only

```tsx
// ✅ CORRECT — Tailwind v4
<div className="bg-linear-to-r from-blue-500 to-purple-500" />
<div className="inset-shadow-sm" />
<div className="text-balance" />
<div className="grid-cols-[1fr_2fr]" />

// ❌ FORBIDDEN — Tailwind v3 legacy
<div className="bg-gradient-to-r" />   // v3 gradient syntax
```

```css
/* ✅ CORRECT — Tailwind v4 in CSS */
@import "tailwindcss";

/* ❌ FORBIDDEN — Tailwind v3 */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Next.js — App Router Patterns Only

```tsx
// ✅ CORRECT — App Router
// Server Component by default, no annotation needed
export default async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}

// ✅ CORRECT — async params in Next.js 16
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
}

// ❌ FORBIDDEN — Pages Router patterns
export async function getServerSideProps() { }   // Pages Router only
export async function getStaticProps() { }        // Pages Router only
import { useRouter } from 'next/router'           // use next/navigation instead
```

### React — v19 Patterns Only

```tsx
// ✅ CORRECT — React 19
import { use } from 'react'
const data = use(promise)

// ✅ CORRECT — useActionState (React 19)
import { useActionState } from 'react'

// ❌ FORBIDDEN — old patterns
import { useFormState } from 'react-dom'   // replaced by useActionState in React 19
React.FC<Props>                             // never use React.FC — use direct prop types
```

### TanStack Query — v5 Syntax Only

```ts
// ✅ CORRECT — TanStack Query v5
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query'

useQuery({ queryKey: ['users'], queryFn: fetchUsers })
useMutation({ mutationFn: createUser })

const client = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000 },
  },
})

// ❌ FORBIDDEN — TanStack Query v4 legacy
useQuery(['users'], fetchUsers)         // positional args removed in v5
useMutation(createUser)                 // positional args removed in v5
```

---

## TypeScript Rules

- **Strict mode always** — `tsconfig.json` has `"strict": true`
- **No `any` — ever.** Use `unknown` and narrow, or define a proper type
- Use `interface` for object shapes
- Use `type` for unions, primitives, mapped types
- Never use `React.FC` — always type props directly:

```tsx
// ✅ correct
interface ButtonProps {
  label: string
  onClick: () => void
}
export function Button({ label, onClick }: ButtonProps) { ... }

// ❌ wrong
const Button: React.FC<ButtonProps> = ({ label }) => { ... }
```

---

## Component Rules

- **Named exports** for all components — except `page.tsx` and `layout.tsx`
- One component per file — no exceptions
- `"use client"` only when required: event handlers, hooks, browser APIs
- Server Components by default — never add `"use client"` unnecessarily
- PascalCase for component names and filenames: `UserCard.tsx`
- No inline styles — Tailwind classes only

```tsx
// ✅ correct
'use client'  // only if truly needed

export function LoginForm() {
  return <form>...</form>
}

// ❌ wrong — default export for non-page components
export default function LoginForm() { ... }
```

---

## Data Fetching Rules

**Never use raw `fetch()` or `axios` directly in components or pages.**
Always go through the project hooks.

```ts
// ✅ GET — use useFetch
const { data, isLoading, error } = useFetch<User[]>('/users', ['users'])

// ✅ Mutations — use useApi hooks
const { mutate, isPending } = usePost<ResponseType, BodyType>('/users', {
  invalidateKeys: [['users']],
  onSuccess: (data) => authService.saveSession(data),
  onError: (message) => console.error(message),
})

// ❌ WRONG — direct axios in component
import { api } from '@/lib/api'
const res = await api.get('/users')   // never do this in a component
```

---

## Services Rules

Business logic belongs in `services/` — not in hooks, not in components.

```ts
// ✅ correct pattern
export const authService = {
  saveSession: (data: AuthSession): void => {
    localStorage.setItem(CONFIG.TOKEN_KEY, data.token)
    localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(data.user))
  },
  clearSession: (): void => {
    localStorage.removeItem(CONFIG.TOKEN_KEY)
    localStorage.removeItem(CONFIG.USER_KEY)
  },
  getToken: (): string | null =>
    localStorage.getItem(CONFIG.TOKEN_KEY),
}

// ❌ wrong — logic inside hook
const useLogin = () => usePost('/auth/login', {
  onSuccess: (data) => {
    localStorage.setItem('token', data.token)   // this belongs in authService
  }
})
```

---

## Constants Rules

No magic strings or numbers anywhere in the codebase.

```ts
// constants/routes.ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
} as const

// constants/config.ts
export const CONFIG = {
  APP_NAME: 'MyApp',
  API_VERSION: 'v1',
  PAGINATION_LIMIT: 10,
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'auth_user',
} as const

// ✅ usage
router.push(ROUTES.LOGIN)
localStorage.getItem(CONFIG.TOKEN_KEY)

// ❌ FORBIDDEN — magic strings inline
router.push('/login')
localStorage.getItem('auth_token')
```

---

## Providers Setup

Root `layout.tsx` only wraps `<AppProviders>` — never add individual
providers directly in layout:

```tsx
// app/layout.tsx ✅
import { AppProviders } from '@/providers/app-providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}

// providers/app-providers.tsx ✅
'use client'

import { QueryProvider } from './query-provider'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  )
}
```

---

## App Router Special Files

| File | Purpose | Client? |
|------|---------|---------|
| `page.tsx` | Route UI | Server by default |
| `layout.tsx` | Shared layout | Server by default |
| `loading.tsx` | Suspense skeleton | Server by default |
| `error.tsx` | Error boundary | **Must be `"use client"`** |
| `not-found.tsx` | 404 UI | Server by default |

---

## File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `UserCard.tsx` |
| Pages & Layouts | lowercase | `page.tsx`, `layout.tsx` |
| Hooks | camelCase | `useFetch.ts` |
| Utils | kebab-case | `format-date.ts` |
| Services | kebab-case + `.service` | `auth.service.ts` |
| Types | kebab-case + `.d` | `auth.d.ts` |
| Constants | kebab-case | `routes.ts` |

---

## Path Aliases

Always use `@/` alias — never use relative `../../` imports:

```ts
// ✅ correct
import { api } from '@/lib/api'
import { useFetch } from '@/hooks/useFetch'
import { ROUTES } from '@/constants/routes'
import { CONFIG } from '@/constants/config'
import { Button } from '@/components/ui/Button'
import { authService } from '@/services/auth.service'
import { cn } from '@/utils/cn'

// ❌ wrong
import { api } from '../../lib/api'
```

---

## Where Does New Code Go?

| What you're building | Where it goes |
|----------------------|---------------|
| New page/route | `app/(group)/route-name/page.tsx` |
| Loading skeleton | `app/(group)/route-name/loading.tsx` |
| Error boundary | `app/(group)/route-name/error.tsx` |
| Generic UI component | `components/ui/ComponentName.tsx` |
| Header, Footer, Sidebar | `components/layout/` |
| Feature component | `components/features/feature-name/` |
| Custom React hook | `hooks/useHookName.ts` |
| Axios / SDK config | `lib/` |
| Zod schema | `lib/validations/name.schema.ts` |
| Pure helper function | `utils/` |
| Business logic | `services/name.service.ts` |
| React context provider | `providers/` |
| App-wide constant | `constants/` |
| Shared TypeScript type | `types/` |

---

## Environment Variables

```env
# .env.local — never commit this file
NEXT_PUBLIC_API_URL=https://api.yourbackend.com
```

- `NEXT_PUBLIC_` → exposed to browser
- Without prefix → server-only
- Never hardcode URLs — always use `process.env.NEXT_PUBLIC_API_URL` via `lib/api.ts`

---

## Hard Rules Summary — Never Break These

- ❌ No `any` type — ever
- ❌ No legacy Zod v3 syntax — v4 only
- ❌ No Tailwind v3 classes — v4 only
- ❌ No Pages Router patterns (`getServerSideProps`, `next/router`)
- ❌ No TanStack Query v4 positional args — v5 object syntax only
- ❌ No `React.FC` — type props directly
- ❌ No raw `axios` or `fetch()` in components — use hooks
- ❌ No magic strings/numbers — use `constants/`
- ❌ No business logic in hooks — use `services/`
- ❌ No individual providers in `layout.tsx` — use `AppProviders`
- ❌ No components inside `app/` folder — routes only
- ❌ No default exports for components (only `page.tsx` / `layout.tsx`)
- ❌ No relative `../../` imports — use `@/` alias
- ❌ No `"use client"` without a real reason — Server Components by default
- ❌ No dead code, commented-out code, or unused imports in any file
- ❌ No skills bypassed — always read relevant skill before writing code