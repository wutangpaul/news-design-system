# Component conventions

Read this before adding a component or pattern. Consistency here matters more than any
individual component's cleverness — everything in this library is built by parallel
contributors who can't see each other's work in progress.

## File structure

Each component/pattern lives in its own folder:

```
src/components/Button/
  Button.tsx        # implementation + exported types
  Button.stories.tsx
  Button.test.tsx
  Button.mdx         # usage docs (props table, do's/don'ts, a11y notes)
  index.ts            # re-exports
```

Patterns (Phase 3) live under `src/patterns/<PatternName>/` with the same shape, and may
import finished components from `src/components/*`.

## Styling

- Tailwind utility classes only — no inline styles, no raw hex values. Every color/spacing/
  radius/shadow/font value must come from the theme defined in `tailwind.config.ts`, which is
  generated from `src/tokens/*`. If a token you need doesn't exist, use the closest existing
  one rather than inventing a one-off value.
- Use `surface-*` / `text-*` color utilities (not raw `ink-*`) for anything that should adapt
  between light and dark mode — they're backed by CSS variables that flip under the `.dark`
  class. Use `ink-*`/`masthead-*` directly only for fixed-brand elements that shouldn't theme.
- Use `class-variance-authority` (`cva`) for variant/size props, and `tailwind-merge` + `clsx`
  (via the `cn()` helper in `src/lib/cn.ts`) to let consumers override classes safely.

## Component API

- Every component is typed with TypeScript, forwards `ref` where it wraps a native element,
  and spreads remaining props onto the root DOM node (`...rest`).
- Props are documented with TSDoc comments so they surface in Storybook's auto-generated
  Controls/docs table.

## Accessibility (WCAG 2.2 AA — non-negotiable)

- Full keyboard operability. Use the WAI-ARIA Authoring Practices Guide pattern for the
  relevant widget (e.g. roving tabindex for Tabs, focus trap + Escape for Modal/Drawer).
- Correct semantic HTML and ARIA roles/states — don't reach for `div`+ARIA when a native
  element does the job.
- Visible focus indicator (inherited automatically via the global `:focus-visible` style —
  don't suppress it with `outline-none` unless you replace it with an equally visible ring).
- Color is never the only signal (pair with icon/text/shape).
- Storybook's a11y addon (axe-core) must report no violations on default stories.

## Testing

- React Testing Library + Vitest. Test behavior (renders, interactions, keyboard nav, ARIA
  attributes), not implementation details.
- Place tests in `<Name>.test.tsx` next to the component.

## Storybook

- One `.stories.tsx` per component with a `Default` story plus stories covering each
  meaningful variant/state (sizes, disabled, error, loading, dark mode where relevant).
- Every component also gets a hand-written `.mdx` docs page (`import { Meta, Canvas, Controls }
  from "@storybook/blocks"`, `<Meta of={XStories} />`, then prose + `<Canvas of={...}/>` per
  story + `<Controls />` for the props table) covering usage guidance, rationale, do's/don'ts,
  and accessibility notes.
- Do **not** add `tags: ['autodocs']` to the CSF `meta` object when a custom `.mdx` exists for
  that component — Storybook 8 treats a tag-generated docs page and a custom MDX docs page for
  the same title as a conflict and the whole index build fails ("Unable to index files"). The
  MDX file *is* the docs page; `tags: ['autodocs']` is only for components that have no custom
  MDX (none currently — every component should have one).

## MDX docs — bugs to avoid (found the hard way in Phase 2)

`yarn build-storybook` succeeding does **not** prove an MDX docs page actually renders — it
only bundles the JS, it doesn't execute every page. These three mistakes all passed
`build-storybook` clean and then crashed in the browser:

1. **Bare `{word}` in prose text.** MDX evaluates *any* unescaped `{...}` as a live JS
   expression, even outside code — writing `` the aria-label is "Remove {label}" `` in plain
   prose crashes with "label is not defined". If you need to show a literal placeholder like
   that, wrap it in backtick-delimited inline code, or reword to avoid the brace entirely.
2. **Nested backticks inside a single-backtick inline code span** (e.g. showing a template
   literal like `` `style={{ width: \`${x}%\` }}` `` as inline code) breaks MDX's code-span
   parser, which then falls through to prose mode and evaluates the exposed `{x}` the same way
   as above. Fix: put any snippet that itself contains backticks into a triple-backtick fenced
   code block instead — fenced blocks are always raw/safe, inline spans are not once nested.
3. **`<Controls of={XStories} />`** — passing the whole stories module (a "meta") to `Controls`
   throws "Invalid value passed to the 'of' prop" (it only accepts a `story`). If the page
   already has `<Meta of={XStories} />`, just write `<Controls />` with no `of` — it inherits
   context automatically.

Before considering a new MDX page done, do a quick self-check: strip fenced code blocks and
inline code spans, and make sure no stray `{`/`}` remains in the leftover prose.

## Patterns (Phase 3) — additional notes

Patterns differ from components in one key way: they **should** compose finished components
from `src/components/*` rather than reimplementing markup (a Story Card is a `Card` + `Image` +
`Heading` + `Tag` + `Byline`, not hand-rolled HTML). Import them normally — the "self-contained,
no cross-imports" rule from Phase 2 was specific to Phase 2's parallel-build constraint and does
not apply here.

- Location: `src/patterns/<PatternName>/`, same file shape as components
  (`Name.tsx`/`.stories.tsx`/`.test.tsx`/`.mdx`/`index.ts`).
- Storybook title: `Patterns/<Category>/<PatternName>` — `Category` is one of `Editorial`,
  `Navigation`, `Content Discovery` (matching the project brief's own grouping), regardless of
  which agent/session built it.
- Patterns take real content via props (title, image src, author name, etc.) — they are not
  content-agnostic the way Templates (Phase 4) are meant to be. Define a small TS interface per
  pattern for its content shape; there's no shared "content model" to conform to yet.
- `cn()` and the `vitest-axe` matcher are already fixed centrally (see git history) — use them
  normally, no need for the workarounds Phase 2 components had to invent before those fixes
  landed.

## Boundaries — do not edit these as part of building a component

`package.json`, `tailwind.config.ts`, `src/tokens/*`, `src/index.css`, `.storybook/*`,
`vite.config.ts`, `tsconfig*.json`, or any other component's folder. If a shared file truly
needs a change, flag it instead of editing it — these are integrated centrally to avoid
parallel agents clobbering each other.

Each component's `index.ts` is the only cross-component export surface; the top-level
`src/components/index.ts` / `src/patterns/index.ts` barrels are assembled in a separate
integration pass.
