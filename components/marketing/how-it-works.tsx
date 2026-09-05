const STEPS = [
  {
    title: "Ask in plain language",
    body: "Type a question, paste a stack trace, or drop in a file. No prompt formatting, no slash commands to memorise.",
  },
  {
    title: "Attach what it needs to see",
    body: "Drop in a PDF, spreadsheet, image or source file. Each one is checked for type and size before it is read.",
  },
  {
    title: "Keep the thread",
    body: "Edit a question and the answer below it is rewritten. Regenerate, rate, or copy any response — the history stays yours.",
  },
];

/** Three steps, joined by a hairline rule rather than illustrations. */
export function HowItWorks() {
  return (
    <section
      id="how"
      className="border-border bg-sunken/60 border-y"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <header className="max-w-2xl">
          <p className="text-caption text-accent-strong font-mono tracking-[0.16em] uppercase">
            How it works
          </p>
          <h2 className="text-h1 text-foreground mt-3 text-balance">
            Three steps, and none of them are setup
          </h2>
        </header>

        <ol className="border-border bg-border mt-10 grid gap-px overflow-hidden rounded-xl border sm:mt-12 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="bg-background flex flex-col gap-3 p-6 sm:p-7">
              <span className="text-caption text-accent-strong font-mono tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-h3 text-foreground">{step.title}</h3>
              <p className="text-small text-muted-foreground text-pretty">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
