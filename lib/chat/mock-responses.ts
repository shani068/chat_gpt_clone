/**
 * The canned answer corpus behind the mock stream.
 *
 * Kept out of the service so the routing logic stays readable, and out of
 * components entirely — swapping in a real completions endpoint means
 * deleting this file, nothing else.
 */

// Fences are built from a constant so the source stays free of escape noise.
const F = "```";

interface ResponseTemplate {
  /** Lower-cased keywords; any hit routes to this answer. */
  match: RegExp;
  body: string;
}

const TEMPLATES: ResponseTemplate[] = [
  {
    match: /distributed|consensus|microservice|scal(e|ing|ability)|system design/,
    body: `Distributed systems are mostly an exercise in accepting that **the network will fail you**, and designing so that it does not matter.

### The three things that actually change

1. **Messages get lost, duplicated and reordered.** Every remote call is a guess about the state of another machine.
2. **There is no shared clock.** "Before" and "after" become negotiated, not observed.
3. **Partial failure is the default.** One node being down is normal operating conditions, not an incident.

### The trade-off you cannot avoid

| Property | What you get | What it costs |
| --- | --- | --- |
| Consistency | Every read sees the latest write | Availability during a partition |
| Availability | Every request gets an answer | Reads may be stale |
| Partition tolerance | Survives a split network | Not optional in practice |

> Partition tolerance is not a choice — networks partition. CAP is really a
> choice between consistency and availability *while* partitioned.

### A concrete pattern: idempotency keys

Retries are safe only when the receiver can recognise a repeat:

${F}typescript
type Handler<T> = (payload: T) => Promise<Result>;

const seen = new Map<string, Result>();

export function idempotent<T>(handler: Handler<T>): (key: string, payload: T) => Promise<Result> {
  return async (key, payload) => {
    const cached = seen.get(key);
    if (cached) return cached;

    const result = await handler(payload);
    seen.set(key, result);
    return result;
  };
}
${F}

In production the map becomes Redis or a database table with a TTL, but the
shape is the same: **the client owns the key, the server owns the dedupe**.

Want me to go deeper on consensus (Raft), or on the failure modes of retries?`,
  },
  {
    match: /typescript|type-safe|generic|architecture review|review this/,
    body: `Here is how I would read that architecture. I will start with what is working, then the parts I would change.

### What is solid

- Types live next to the domain rather than in a global \`types.ts\` dumping ground.
- The service layer returns domain objects, not transport shapes.

### What I would change

**1. Stop leaking \`any\` through the boundary.** A single \`any\` at the edge
erases type safety for everything downstream of it. Parse instead:

${F}typescript
import { z } from "zod";

const ConversationSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  updatedAt: z.number().int(),
  messages: z.array(MessageSchema),
});

export type Conversation = z.infer<typeof ConversationSchema>;

export async function fetchConversation(id: string): Promise<Conversation> {
  const response = await fetch(\`/api/conversations/\${id}\`);
  if (!response.ok) throw new Error(\`Failed: \${response.status}\`);

  // Parse at the boundary — everything inside is now provably typed.
  return ConversationSchema.parse(await response.json());
}
${F}

**2. Model states as a union, not a bag of booleans.**

${F}typescript
// Before — 8 representable states, 3 of them nonsense
interface Bad { loading: boolean; error?: string; data?: Conversation }

// After — exactly 3 states, all meaningful
type Async<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: T };
${F}

**3. Push \`"use client"\` down the tree.** Marking a page as a client component
drags its whole subtree into the bundle. Keep the page a server component and
mark only the interactive leaves.

### Priority order

| Change | Effort | Payoff |
| --- | --- | --- |
| Parse at the boundary | Low | High |
| Discriminated state unions | Low | High |
| Move the client boundary down | Medium | Medium |

Happy to review a specific module if you paste it in.`,
  },
  {
    match: /debug|error|bug|not working|fails|500|crash|stack trace/,
    body: `Let us narrow this down before changing any code. Most API bugs of this shape fall into one of four buckets.

### 1. Reproduce deterministically

If it only fails sometimes, it is timing, caching, or state — not logic.

${F}bash
# Same request, ten times, only the status codes
for i in $(seq 1 10); do
  curl -s -o /dev/null -w "%{http_code} %{time_total}s\\n" \\
    -H "Authorization: Bearer $TOKEN" \\
    https://api.example.com/v1/conversations
done
${F}

### 2. Find the boundary the failure crosses

| Symptom | Usual cause |
| --- | --- |
| 401 only in production | Env var not set in the deploy target |
| 404 on a route that exists | Trailing slash or base-path rewrite |
| 500 with an empty body | Unhandled rejection before the error middleware |
| Works in curl, fails in browser | CORS, or a cookie missing \`SameSite\` |

### 3. Make the failure loud

Silent \`catch\` blocks are where bugs go to hide:

${F}javascript
// Swallows the cause and returns a lie
try {
  return await getUser(id);
} catch {
  return null;
}

// Keeps the cause attached
try {
  return await getUser(id);
} catch (cause) {
  throw new Error(\`getUser(\${id}) failed\`, { cause });
}
${F}

### 4. Bisect

If it worked last week, \`git bisect\` will find the commit faster than reading
the diff will.

---

Paste the actual error and the request that produced it and I will point at the
specific line.`,
  },
  {
    match: /postgres|sql|schema|database|migration|index/,
    body: `Here is a schema for a chat product. It assumes Postgres 14+ and leans on
foreign keys rather than application-level integrity.

${F}sql
create table users (
  id          uuid primary key default gen_random_uuid(),
  email       citext not null unique,
  name        text   not null,
  created_at  timestamptz not null default now()
);

create table conversations (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users(id) on delete cascade,
  title       text not null default 'New conversation',
  model_id    text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references conversations(id) on delete cascade,
  role             text not null check (role in ('user', 'assistant')),
  content          text not null,
  created_at       timestamptz not null default now()
);

-- The sidebar query: a user's conversations, newest first.
create index conversations_user_updated_idx
  on conversations (user_id, updated_at desc);

-- The transcript query: one conversation in order.
create index messages_conversation_created_idx
  on messages (conversation_id, created_at);
${F}

### Why it is shaped this way

- **\`on delete cascade\`** — deleting a conversation should not leave orphaned
  messages behind for a nightly job to find.
- **Composite indexes matching the sort** — \`(user_id, updated_at desc)\` serves
  the sidebar with an index-only scan; \`(user_id)\` alone would still sort.
- **\`citext\` for email** — case-insensitive uniqueness enforced by the database,
  not by remembering to call \`.toLowerCase()\` everywhere.
- **\`timestamptz\`, never \`timestamp\`** — storing local time is a bug waiting
  for a deploy in another region.

### The one thing people forget

\`updated_at\` does not update itself:

${F}sql
create or replace function touch_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger conversations_touch
  before update on conversations
  for each row execute function touch_updated_at();
${F}

Want message search next? That is a \`tsvector\` column plus a GIN index.`,
  },
  {
    match: /react|next\.?js|component|hook|render|frontend|css|tailwind/,
    body: `The short version: **most React performance problems are state placed too high in the tree.**

### The diagnosis

A component re-renders when its own state changes, its parent re-renders, or a
context it consumes changes. Almost every "React is slow" report is the second
one — state lives near the root, so every keystroke re-renders the page.

### The fix, in order of leverage

**1. Move state down.** If only the composer cares about the draft text, the
draft belongs in the composer.

**2. Isolate the frequently-changing part.**

${F}tsx
// Every keystroke re-renders MessageList too
function Chat() {
  const [draft, setDraft] = useState("");
  return (
    <>
      <MessageList messages={messages} />
      <textarea value={draft} onChange={(e) => setDraft(e.target.value)} />
    </>
  );
}

// The draft is now the composer's problem alone
function Chat() {
  return (
    <>
      <MessageList messages={messages} />
      <Composer onSend={send} />
    </>
  );
}
${F}

**3. Split contexts by update frequency.** One context holding both the theme
and the streaming buffer will re-render every theme consumer on every token.

**4. Only then reach for memo.** \`useMemo\` and \`React.memo\` have a real cost;
they pay off on expensive subtrees, not on \`<span>{name}</span>\`.

### A rule of thumb

| Symptom | Look at |
| --- | --- |
| Typing feels laggy | Where the input state lives |
| Scrolling stutters | List size — consider virtualising past ~200 rows |
| Slow first paint | Client bundle — is a leaf forcing the page client-side? |
| Whole page flashes | A context provider re-creating its value each render |

Paste a component and I will tell you which one it is.`,
  },
];

const GENERIC_OPENERS = [
  "Good question — here is how I would approach it.",
  "Let me break that into the parts that matter.",
  "Here is the short answer, then the reasoning behind it.",
];

/** Fallback answer that still exercises the full markdown surface. */
function genericResponse(prompt: string, seed: number): string {
  const opener = GENERIC_OPENERS[seed % GENERIC_OPENERS.length];
  const topic = prompt.replace(/\s+/g, " ").trim().slice(0, 80) || "this";

  return `${opener}

You asked about **${topic}**. There are three angles worth separating, because
conflating them is where most answers go wrong.

### 1. What the thing actually is

The mechanism, stated plainly and without analogy. Analogies are useful for
intuition and terrible for edge cases.

### 2. What it costs

Nothing is free. The interesting question is never *"does it work"* but *"what
did I trade to get it"*:

- **Complexity** — more moving parts to reason about later
- **Latency** — an extra hop, an extra parse, an extra await
- **Operational surface** — one more thing that can page you at 3am

### 3. When it stops being the right call

${F}typescript
// The version that fits on a slide
const result = items.filter(isValid).map(toDomain);

// The version that survives a million items
function process(items: readonly Raw[]): Domain[] {
  const out: Domain[] = [];
  for (const item of items) {
    if (!isValid(item)) continue;
    out.push(toDomain(item));
  }
  return out;
}
${F}

The first is better code right up until profiling says otherwise — and usually
profiling never says otherwise.

---

Tell me which of the three you want expanded and I will go deeper.`;
}

/**
 * Routes a prompt to an answer. Deterministic per prompt so regenerating twice
 * on the same message does not accidentally return identical text.
 */
export function responseFor(prompt: string, variant = 0): string {
  const normalised = prompt.toLowerCase();
  const template = TEMPLATES.find((entry) => entry.match.test(normalised));

  if (!template) return genericResponse(prompt, variant);
  if (variant === 0) return template.body;

  // Regenerations get a short preface so the change is visible to the user.
  const prefaces = [
    "Taking another pass at this, with a different emphasis.",
    "Here is a second take — same conclusion, different route in.",
    "Rewriting this more directly.",
  ];
  return `${prefaces[(variant - 1) % prefaces.length]}\n\n${template.body}`;
}

/** Attachments get acknowledged so the upload flow feels connected to the answer. */
export function attachmentPreface(names: string[]): string {
  if (names.length === 0) return "";
  const list =
    names.length === 1
      ? `**${names[0]}**`
      : `${names.slice(0, -1).map((n) => `**${n}**`).join(", ")} and **${names[names.length - 1]}**`;
  return `I have read ${list}. Here is what stands out.\n\n`;
}
