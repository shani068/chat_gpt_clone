# MyApp — Next.js Template

A production-ready Next.js 16 starter with App Router, React 19, TypeScript, Tailwind CSS v4, TanStack Query v5, and Axios. Designed for scalability from day one.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.4 |
| UI Library | React | 19.2.4 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | ^4 |
| Server State | TanStack Query | ^5 |
| HTTP Client | Axios | ^1 |
| Validation | Zod | ^4 |
| Package Manager | Bun | latest |
| Linting | ESLint | ^9 |
| Formatting | Prettier | ^3 |

---

## Project Structure

```
next-js-template/
├── app/
│   ├── (auth)/                    # Auth route group — /login, /register
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/               # Dashboard route group — /dashboard, /settings
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── error.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── error.tsx                  # Global error boundary
│   ├── not-found.tsx              # 404 page
│   ├── globals.css
│   └── layout.tsx                 # Root layout with providers
├── components/
│   ├── ui/                        # Primitive UI components (Button, Input, Spinner)
│   ├── layout/                    # Shell components (Navbar, Sidebar)
│   └── features/
│       ├── auth/                  # Auth-scoped components
│       └── dashboard/             # Dashboard-scoped components
├── hooks/
│   ├── useApi.ts                  # Mutation hooks (POST / PUT / PATCH / DELETE / upload)
│   └── useFetch.ts                # Query hook (GET with TanStack Query)
├── lib/
│   ├── api.ts                     # Axios instance + 401 interceptor
│   ├── auth.ts                    # Session helpers (get / set / clear)
│   └── validations/
│       └── auth.schema.ts         # Zod schemas for auth forms
├── services/
│   ├── auth.service.ts            # Login / register / logout / me
│   └── user.service.ts            # User CRUD
├── providers/
│   ├── query-provider.tsx         # TanStack Query v5 QueryClientProvider
│   └── app-providers.tsx          # Root provider tree
├── constants/
│   ├── routes.ts                  # ROUTES constant map
│   └── config.ts                  # APP_NAME, TOKEN_KEY, pagination defaults
├── utils/
│   ├── cn.ts                      # clsx + tailwind-merge helper
│   ├── format-date.ts             # formatDate / formatDateTime / timeAgo
│   └── resolve-error.ts           # Converts any thrown value to a string
└── types/
    ├── api.d.ts                   # ApiResponse<T>, PaginatedResponse<T>, ApiError
    └── auth.d.ts                  # User, UserRole, AuthSession, credentials
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.0
- Node.js >= 20 (for tooling compatibility)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/next-js-template.git
cd next-js-template

# Install dependencies
bun install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

> Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. All others are server-only.

### Development

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
|---|---|
| `bun dev` | Start the development server with hot reload |
| `bun build` | Build the application for production |
| `bun start` | Serve the production build |
| `bun lint` | Run ESLint across the codebase |

---

## Architecture Decisions

### Route Groups
Pages are organized into `(auth)` and `(dashboard)` route groups. Parentheses prevent the folder name from appearing in the URL while still allowing a shared layout for each group.

### Server vs. Client Components
- **Pages and layouts** are React Server Components by default — no JavaScript sent to the browser.
- **Interactive leaf nodes** (forms, navigation with active state) are explicitly opted into `"use client"`.
- This keeps the client bundle minimal and enables server-side data fetching without waterfalls.

### Data Layer Separation
```
services/   ← raw API calls (framework-agnostic, testable in isolation)
hooks/      ← React wrappers around services using TanStack Query
```
Service functions can be called from Server Actions or unit tests without React. Hooks exist only in Client Components.

### Error Handling
- `resolveError` in `utils/` normalises every thrown value — Axios errors, native Errors, and unknown objects — into a displayable string.
- Route-level `error.tsx` files scope error boundaries to their subtree; the global `app/error.tsx` catches everything else.

---

## Conventions

| Concern | Convention |
|---|---|
| Component exports | Named exports everywhere except `page.tsx` / `layout.tsx` |
| Hook naming | Always prefixed with `use` |
| Service exports | `const serviceName = { method }` object |
| Constant naming | `UPPER_SNAKE_CASE` |
| Type declarations | `interface` for objects · `type` for unions and primitives |
| File naming | `kebab-case.tsx` for components · `camelCase.ts` for everything else |

---

## Adding a New Feature

1. **Type** — `types/your-feature.d.ts`
2. **Validation** — `lib/validations/your-feature.schema.ts`
3. **Service** — `services/your-feature.service.ts`
4. **Components** — `components/features/your-feature/`
5. **Page** — `app/(dashboard)/your-feature/page.tsx`

---

## Deployment

The recommended deployment target is [Vercel](https://vercel.com). Push to your main branch and Vercel handles the rest.

For self-hosting, run:

```bash
bun build
bun start
```

Refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for Docker and Node.js server options.

---

## License

MIT
