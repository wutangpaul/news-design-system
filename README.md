# News Design System

[![CI](https://github.com/wutangpaul/news-design-system/actions/workflows/ci.yml/badge.svg)](https://github.com/wutangpaul/news-design-system/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/%40hysterical%2Fnews-design-system?logo=npm&logoColor=white&color=CB3837)](https://www.npmjs.com/package/@hysterical/news-design-system)
[![React](https://img.shields.io/badge/React-18-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Storybook](https://img.shields.io/badge/Storybook-9-FF4785?logo=storybook&logoColor=white)](https://wutangpaul.github.io/news-design-system/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

A component library, pattern library, and set of page templates for a premium news-publishing
platform. Built with React, TypeScript, and Tailwind CSS, documented in Storybook.

**[View the deployed Storybook →](https://wutangpaul.github.io/news-design-system/)**

| | |
|---|---|
| **Components** | 36 |
| **Patterns** | 37 |
| **Templates** | 15 |
| **Tests** | 827 passing across 91 test files |
| **Accessibility** | WCAG 2.2 AA, axe-core clean on every default story |

The system is organized into five layers, matching how a newsroom's product actually gets
assembled — from raw design decisions up to full pages:

| Layer | Contains |
|---|---|
| **Design Tokens** | colors, type scale, spacing, radius, shadow, motion, breakpoints, z-index |
| **Foundations** | accessibility, dark mode, responsive design, grid, iconography, typography |
| **Components** | Button, Input, Modal, Card, Tag, and other primitives |
| **Patterns** | StoryCard, HeroStory, GlobalHeader, ArticleBody, Byline, and other compositions |
| **Templates** | Homepage, Article, LiveBlog, and other full page layouts |

Each layer only builds on the ones before it — a pattern never invents its own spacing value,
a template never hardcodes a color.

## Using it in your app

The package is published on npm as
[`@hysterical/news-design-system`](https://www.npmjs.com/package/@hysterical/news-design-system).

### 1. Install

You need the package itself plus React (it's a peer dependency, so your app's copy of React is
what actually runs):

```bash
yarn add @hysterical/news-design-system react react-dom
```

### 2. Import the stylesheet, once

Add this near the root of your app (e.g. `main.tsx`, or your framework's root layout) — it only
needs to happen once, anywhere upstream of where components render:

```tsx
import "@hysterical/news-design-system/style.css";
```

That's a single, fully self-contained CSS file. You don't need Tailwind installed in your own
project for this to work.

### 3. Use components

```tsx
import { Button, Card, StoryCard } from "@hysterical/news-design-system";

function App() {
  return (
    <Card>
      <Button variant="primary">Subscribe</Button>
    </Card>
  );
}
```

Every component, pattern, and template in the tables above is exported from the package root —
same names as in [Storybook](https://wutangpaul.github.io/news-design-system/), so you can use
the docs site as your API reference.

### 4. Dark mode

Toggle a `dark` class on a parent element (typically `<html>`) — every component built with the
system's `surface-*`/`text-*` tokens switches automatically:

```tsx
document.documentElement.classList.toggle("dark");
```

### 5. Theming

Under the hood, every color, font, spacing, radius, and shadow is a plain CSS custom property
(e.g. `--color-masthead-500`). Override any of them in your own CSS after importing the
stylesheet, and every component picks up the change immediately — no rebuild required:

```css
@import "@hysterical/news-design-system/style.css";

:root {
  --color-masthead-500: #0057ff; /* swap the brand accent */
}
```

**If you already use Tailwind CSS v4** in your own app and want to go further than re-theming —
adding your own colors, generating new utilities, using the design system's tokens directly in
your own markup — import the raw token file into your own Tailwind entry point instead of the
compiled stylesheet:

```css
@import "tailwindcss";
@import "@hysterical/news-design-system/theme.css";

@theme {
  --color-brand-500: #ff6600; /* your own tokens, sitting alongside the system's */
}
```

This registers the design system's tokens as native values in *your* Tailwind build, so classes
like `bg-ink-500` or `text-h2` work in your own components too, not just inside the ones you
imported.

| Import | Use it when… |
|---|---|
| `@hysterical/news-design-system/style.css` | You want it to just work. No Tailwind required. |
| `@hysterical/news-design-system/theme.css` | You already run Tailwind CSS v4 and want to extend or compose the tokens. |

---

The rest of this README is about developing *this repo* (contributing components, running
Storybook locally, tests, releases) — not about consuming the package. If you just want to use
the design system, the section above is all you need.

## Stack

- **React 18** + **TypeScript**
- **Tailwind CSS 4** (class-based dark mode) — native CSS `@theme` block in `src/index.css`,
  mirrored from `src/tokens/*`
- **Storybook 9** (with the accessibility addon) for component docs and visual review
- **Vitest** + **React Testing Library** for tests, **axe-core** for automated a11y checks
- **Vite** for the app build
- `class-variance-authority` for variant APIs, `clsx` + `tailwind-merge` for safe class overrides

Package manager is **yarn**.

## Getting started

```bash
yarn install
yarn dev          # app dev server
yarn storybook    # component/pattern/template docs at localhost:6006
```

Other scripts:

```bash
yarn typecheck        # tsc -b --noEmit
yarn lint              # eslint .
yarn test              # vitest run
yarn test:watch        # vitest, watch mode
yarn build              # production app build
yarn build-storybook   # static Storybook build
```

## What's in here

- **Design tokens** (`src/tokens/`) — colors, typography, spacing, radius, shadow, motion,
  breakpoints, z-index. Source of truth for docs; mirrored into the `@theme` block in
  `src/index.css` (there's no `tailwind.config.ts` — Tailwind v4 is configured entirely in
  CSS). Color system: `ink` (neutral grayscale), `masthead` (brand red accent),
  `success`/`warning`/`error`/`info` (semantic). Theme-aware `surface-*`/`text-*` Tailwind
  utilities are CSS-variable-backed so components using them automatically support dark mode.
- **Foundations** (`src/docs/foundations/`) — written standards for accessibility, responsive
  design, dark mode strategy, grid & layout, iconography, and brand/editorial typography (a
  serif display face for headlines, sans for UI chrome, mono for timestamps/data).
- **Components** (`src/components/`) — the primitive building blocks: Button, Input, Select,
  Modal, Drawer, Tabs, Card, Badge, Tag, and more.
- **Patterns** (`src/patterns/`) — editorial, navigation, and content-discovery compositions
  built from components: ArticleHeader, HeroStory, StoryCard, Byline, GlobalHeader, MegaMenu,
  MostRead, Comments, and more.
- **Templates** (`src/templates/`) — full page layouts (Homepage, Article, Opinion, LiveBlog,
  CategoryLanding, SearchResults, AuthorProfile, and more). Templates are structure-only:
  props are `ReactNode` slots, never content data — realistic sample content lives in each
  template's `.stories.tsx`.

## Conventions

Read **[CONTRIBUTING.md](./CONTRIBUTING.md)** before adding or modifying anything — it's the
authoritative spec for file structure, styling rules, accessibility bar, testing patterns, and
the boundaries around shared files (tokens, the Tailwind `@theme` block, Storybook config) that
shouldn't be edited casually.

Quick orientation:

- Every component/pattern/template lives in its own folder with a consistent shape:
  `Name.tsx`, `Name.stories.tsx`, `Name.test.tsx`, `Name.mdx`, `index.ts`.
- Styling is Tailwind utilities only, sourced from the design tokens — no inline styles, no
  raw hex values.
- WCAG 2.2 AA is non-negotiable: full keyboard operability, correct semantics/ARIA, visible
  focus rings, and a clean axe-core run on every default story.
- Timestamps, bylines' dates, reading-time estimates, and live-blog ticks render in the mono
  face — the system's signature distinction between editorial voice and data of record.

## Releases

Versioning and the changelog are automated with
[release-please](https://github.com/googleapis/release-please): commits to `main` are parsed
for [Conventional Commits](https://www.conventionalcommits.org) prefixes (`feat:`, `fix:`,
`feat!:`/`BREAKING CHANGE:`, etc.), which release-please uses to keep an always-up-to-date
release PR with the next version bump and `CHANGELOG.md` entry. Merging that PR cuts the
GitHub release, tags the version, and publishes
[`@hysterical/news-design-system`](https://www.npmjs.com/package/@hysterical/news-design-system)
to npm (with provenance) via the `publish-npm` CI job. See
**[CHANGELOG.md](./CHANGELOG.md)** for release history.

## Project status

All four phases from the original brief are complete: design tokens, foundations
documentation, the full component library, the pattern library, and page templates. The
codebase is verified clean end-to-end (typecheck, lint, full test suite, app build, Storybook
build) as of the latest change.

## License

[MIT](./LICENSE)
