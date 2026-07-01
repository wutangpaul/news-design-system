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

## Boundaries — do not edit these as part of building a component

`package.json`, `tailwind.config.ts`, `src/tokens/*`, `src/index.css`, `.storybook/*`,
`vite.config.ts`, `tsconfig*.json`, or any other component's folder. If a shared file truly
needs a change, flag it instead of editing it — these are integrated centrally to avoid
parallel agents clobbering each other.

Each component's `index.ts` is the only cross-component export surface; the top-level
`src/components/index.ts` / `src/patterns/index.ts` barrels are assembled in a separate
integration pass.
