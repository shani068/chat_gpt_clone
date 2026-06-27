# Project Structure

This is a **Next.js 16** template using the App Router, React 19, TypeScript, Tailwind CSS v4, TanStack Query v5, and Axios. Below is a full breakdown of every folder and file, and how to extend the project.

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| Next.js | 16.2.4 | Framework (App Router) |
| React | 19.2.4 | UI library |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^4 | Styling |
| TanStack Query | ^5 | Server state / data fetching |
| Axios | ^1 | HTTP client |
| Prettier | ^3 | Code formatting |
| ESLint | ^9 | Linting |
| Bun | — | Package manager & runtime |

---

## Full Directory Tree

```
next-js-template/
├── .claude/                        # Claude AI skill definitions (AI tooling only)
│   └── skills/
│       ├── better-auth-best-practices/
│       ├── next-best-practices/
│       ├── shadcn/
│       ├── tanstack-query-best-practices/
│       ├── typescript-best-practices/
│       └── ...
│
├── app/                            # Next.js App Router root
│   ├── (auth)/                     # Route group — auth pages (no shared URL segment)
│   │   ├── layout.tsx              # Layout wrapping all auth pages
│   │   └── login/
│   │       └── page.tsx            # /login route
│   │
│   ├── (dashboard)/                # Route group — dashboard pages (empty, ready to fill)
│   │
│   ├── globals.css                 # Global CSS + Tailwind imports
│   ├── layout.tsx                  # Root layout (html/body, fonts, providers)
│   ├── page.tsx                    # Home page — route /
│   └── favicon.ico
│
├── components/                     # Reusable UI components
│   ├── features/                   # Feature-specific components (empty, ready to fill)
│   └── shared/                     # Shared/generic components (empty, ready to fill)
│
├── hooks/                          # Custom React hooks
│   ├── useApi.ts                   # Mutation hooks: usePost, usePut, usePatch, useDelete, useUpload
│   └── useFetch.ts                 # Query hook: useFetch (GET requests via TanStack Query)
│
├── lib/                            # Pure utilities and configuration
│   ├── api.ts                      # Axios instance with base URL and 401 interceptor
│   ├── auth.ts                     # Auth helpers (empty, ready to fill)
│   ├── resolve-error.ts            # Extracts human-readable string from any error
│   └── validations/
│       └── auth.schema.ts          # Zod/validation schemas for auth forms (empty, ready to fill)
│
├── public/                         # Static assets served at /
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── types/                          # Global TypeScript type declarations (empty, ready to fill)
│
├── .claude/                        # Claude AI agent skills (do not edit manually)
├── .gitignore
├── .prettierrc                     # Prettier config
├── AGENTS.md                       # Claude agent instructions
├── CLAUDE.md                       # Claude Code project instructions
├── bun.lock                        # Bun lockfile
├── eslint.config.mjs               # ESLint flat config
├── next.config.ts                  # Next.js configuration
├── next-env.d.ts                   # Auto-generated Next.js type reference
├── package.json
├── postcss.config.mjs              # PostCSS config for Tailwind v4
├── skills-lock.json                # Claude skills lock file
└── tsconfig.json                   # TypeScript config
```

---

## Folder-by-Folder Explanation

### `app/`

This is the Next.js **App Router** directory. Every folder inside `app/` that contains a `page.tsx` becomes a route.

**Route groups** — folders wrapped in parentheses like `(auth)` and `(dashboard)` are **route groups**. They let you share a layout between pages without adding a URL segment. For example, `app/(auth)/login/page.tsx` maps to the URL `/login`, not `/auth/login`.

**How to add a new page:**
```
app/
└── about/
    └── page.tsx     ← accessible at /about
```

**How to add a nested page:**
```
app/
└── dashboard/
    ├── page.tsx         ← /dashboard
    └── settings/
        └── page.tsx     ← /dashboard/settings
```

**How to add a shared layout for a group of pages:**
```
app/
└── (dashboard)/
    ├── layout.tsx       ← wraps all pages inside (dashboard)
    ├── dashboard/
    │   └── page.tsx
    └── profile/
        └── page.tsx
```

**How to add a dynamic route:**
```
app/
└── users/
    └── [id]/
        └── page.tsx     ← /users/123, params.id = "123"
```

---

### `components/`

Split into two sub-folders:

- **`features/`** — components that belong to a specific feature (e.g., `features/auth/LoginForm.tsx`, `features/dashboard/UserCard.tsx`). When a component is only used in one feature, put it here.
- **`shared/`** — generic, reusable components that have no feature dependency (e.g., `shared/Button.tsx`, `shared/Modal.tsx`, `shared/Avatar.tsx`).

**How to add a component:**
```
components/
├── features/
│   └── auth/
│       └── LoginForm.tsx
└── shared/
    └── Button.tsx
```

---

### `hooks/`

Custom React hooks. The two existing hooks wrap TanStack Query.

**`useFetch.ts`** — wraps `useQuery` for GET requests:
```ts
const { data, isLoading, error } = useFetch<User[]>('/api/users', ['users']);
```

Options: `enabled`, `staleTime`, `gcTime`, `refetchInterval`, `initialData`, `params`, `config`.

**`useApi.ts`** — wraps `useMutation` for write operations:

| Hook | HTTP Method | Use case |
|---|---|---|
| `usePost` | POST | Create a resource |
| `usePut` | PUT | Replace a resource |
| `usePatch` | PATCH | Partially update a resource |
| `useDelete` | DELETE | Remove a resource |
| `useUpload` | POST multipart | File uploads with progress |

Example:
```ts
const { mutate, isPending } = usePost<ResponseType, BodyType>('/api/users', {
  invalidateKeys: [['users']],
  onSuccess: (data) => console.log(data),
  onError: (message) => console.error(message),
});
```

**How to add a new hook:**
```
hooks/
└── useDebounce.ts     ← add any hook here
```

---

### `lib/`

Pure utility modules — no React, no JSX.

**`api.ts`** — the Axios instance used by all hooks. Reads `NEXT_PUBLIC_API_URL` from environment variables. Automatically redirects to `/login` on any 401 response.

**`auth.ts`** — placeholder for auth helper functions (token storage, session checks, etc.).

**`resolve-error.ts`** — converts any caught error into a readable string. Reads `response.data.message` from Axios errors first, then falls back to `err.message`, then `"Something went wrong"`.

**`validations/`** — Zod schemas or any validation logic. Keeps validation out of components.

**How to add a validation schema:**
```
lib/
└── validations/
    ├── auth.schema.ts
    └── user.schema.ts    ← add schemas here
```

---

### `types/`

Global TypeScript declarations. Use this for types shared across many files that don't belong in a single module.

**How to add global types:**
```ts
// types/api.d.ts
export interface ApiResponse<T> {
  data: T;
  message: string;
}
```

---

### `public/`

Static files served at the root URL. A file at `public/logo.png` is accessible at `/logo.png`. Do not import these through the module system — reference them by URL string.

---

## Environment Variables

Create a `.env.local` file at the project root (never commit it):

```env
NEXT_PUBLIC_API_URL=https://api.yourbackend.com
```

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.
- Variables without the prefix are server-only.

---

## Scripts

| Command | What it does |
|---|---|
| `bun dev` | Start dev server at http://localhost:3000 |
| `bun build` | Build for production |
| `bun start` | Run the production build |
| `bun lint` | Run ESLint |

---

## How to Add a New Feature — End-to-End Example

Suppose you are adding a **Users** feature:

1. **Type** — `types/user.d.ts`
   ```ts
   export interface User { id: string; name: string; email: string; }
   ```

2. **Validation** — `lib/validations/user.schema.ts`
   ```ts
   import { z } from "zod";
   export const createUserSchema = z.object({ name: z.string().min(2), email: z.string().email() });
   ```

3. **Component** — `components/features/users/UserCard.tsx`
   ```tsx
   export function UserCard({ user }: { user: User }) {
     return <div>{user.name}</div>;
   }
   ```

4. **Page** — `app/(dashboard)/users/page.tsx`
   ```tsx
   import { useFetch } from "@/hooks/useFetch";
   export default function UsersPage() {
     const { data, isLoading } = useFetch<User[]>('/users', ['users']);
     if (isLoading) return <p>Loading...</p>;
     return <ul>{data?.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
   }
   ```

---

## Path Aliases

The `@` alias maps to the project root. Configured in `tsconfig.json`.

```ts
import { api } from "@/lib/api";
import { useFetch } from "@/hooks/useFetch";
import { Button } from "@/components/shared/Button";
```
