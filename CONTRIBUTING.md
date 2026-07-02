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

## Tailwind v4 config — currently in compatibility mode

The project runs on Tailwind v4, but `tailwind.config.ts` (all of `src/tokens/*`) is still
loaded as-is via the `@config "../tailwind.config.ts";` compatibility directive in
`src/index.css`, rather than being rewritten as a native v4 `@theme` CSS block. This was a
deliberate choice to de-risk the v4 engine upgrade (Lightning CSS, faster builds) from a much
larger, separate effort: porting the whole token system (colors, the fontSize scale's
line-height/letter-spacing pairs, spacing, radius, shadow, motion, breakpoints, z-index) into
CSS custom properties. Do not remove the `@config` line without doing that port first — until
then, `tailwind.config.ts` is still the real source of truth and should be edited normally.
One thing that *did* need updating for v4 regardless of the compat shim: the `dark:` variant
is no longer derived from the JS config's `darkMode` option, so it's declared explicitly via
`@custom-variant dark (&:where(.dark, .dark *));` in `src/index.css` — keep that in sync with
`tailwind.config.ts`'s `darkMode: "class"` if either ever changes.

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
- **Metadata typography**: timestamps, publish/updated dates, reading-time estimates,
  live-blog ticks, and byline/timestamp meta rows render in the mono face (`font-mono`,
  usually at `text-caption`). Labels around them stay sans ("Updated" is prose; the date is
  data). This is the system's signature "data of record vs. editorial voice" distinction —
  see Foundations/Brand & Editorial Typography. Author names in running article context
  (e.g. `Byline`'s linked names) stay sans.

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
- Axe checks: use `const results = await axe(container); expect(results.violations).toEqual([])`
  — **not** `vitest-axe`'s `toHaveNoViolations()` matcher. That matcher doesn't type-check in
  this repo: `@storybook/test` hoists its own older `@vitest/expect@2.0.5` alongside `vitest`'s
  own newer nested copy, so any `declare module "@vitest/expect"` augmentation resolves against
  whichever copy happens to be nearest on disk, not necessarily the one `vitest`'s `expect()`
  actually uses — a yarn hoisting artifact, not something to hack around per-file. The
  `.violations` array-assertion pattern works regardless of that and is what every existing
  component/pattern test already uses.

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
- `cn()`'s tailwind-merge classGroup gap is fixed centrally (see git history) — use it normally,
  no need for the workarounds some Phase 2 components invented before that fix landed. For axe
  checks, see the "Testing" section above — use the `.violations` array-assertion pattern, not
  `vitest-axe`'s `toHaveNoViolations()` matcher (which doesn't type-check in this repo).

## Templates (Phase 4) — additional notes

Templates are page-level layouts. Per the project brief, they **"define structure only and
remain content-agnostic"** — concretely, that means a template's own props are named layout
*slots* (`ReactNode`), not content data:

```tsx
export interface HomepageProps {
  hero: ReactNode;       // consumer passes a <HeroStory .../> (or anything else)
  featured: ReactNode;   // consumer passes a <FeaturedStoryGrid .../>
  sidebar?: ReactNode;   // consumer passes <MostRead .../>, <Trending .../>, etc.
}
```

The template component itself only arranges those slots into a responsive grid (per
[Grid & Layout](?path=/docs/foundations-grid-layout--docs)) — it never decides what pattern
fills a slot or what data that pattern shows. That decision belongs to whoever instantiates the
template (in our case, each Storybook story, which demonstrates a realistic composed page by
passing real pattern instances with sample content into the slots).

- Location: `src/templates/<TemplateName>/`, same file shape as components/patterns
  (`Name.tsx`/`.stories.tsx`/`.test.tsx`/`.mdx`/`index.ts`).
- Storybook title: `Templates/<TemplateName>` (flat — no sub-category, there are only 13).
- Every template includes the site chrome directly (compose `GlobalHeader` and `Footer` from
  `src/patterns/*`) rather than treating them as slots — every page needs them, so they aren't
  a place templates should vary.
- A template's `.stories.tsx` is where realistic content lives: instantiate real patterns
  (`HeroStory`, `StoryCard`, `ArticleBody`, etc.) with sample copy and pass them into the
  template's slots. This is the one place in the whole design system where it's correct to
  write substantial fake editorial content — it's demonstrating a full page, not documenting a
  single component's API.
- Templates may compose patterns and components directly for their own chrome (see previous
  bullet) but should default to accepting `ReactNode` slots for anything that's actually
  page-specific content, so the same template works for real CMS-driven pages later without
  modification.

## Loading and empty states

- Patterns that render a list/grid of real content (e.g. `StoryCard`, `FeaturedStoryGrid`)
  should accept a `loading?: boolean` prop that renders a placeholder built from the shared
  `Skeleton` component (`src/components/Skeleton`), matching that pattern's own real layout
  proportions, instead of requiring every consumer to invent its own loading placeholder shape.
  Grids should additionally accept a way to control how many loading placeholders to render
  (e.g. `loadingCount`).
- Templates/patterns with a genuine "nothing to show" state (zero search results, an empty
  archive range, etc.) should use the shared `EmptyState` component
  (`src/components/EmptyState`) rather than hand-rolling bespoke empty-state markup per
  template — pass it the specific heading/description/action copy for that context.

## Boundaries — do not edit these as part of building a component

`package.json`, `tailwind.config.ts`, `src/tokens/*`, `src/index.css`, `.storybook/*`,
`vite.config.ts`, `tsconfig*.json`, or any other component's folder. If a shared file truly
needs a change, flag it instead of editing it — these are integrated centrally to avoid
parallel agents clobbering each other.

Each component's `index.ts` is the only cross-component export surface; the top-level
`src/components/index.ts` / `src/patterns/index.ts` / `src/templates/index.ts` barrels are
assembled in a separate integration pass.
