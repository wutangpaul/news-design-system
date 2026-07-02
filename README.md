# News Design System

[![CI](https://github.com/wutangpaul/news-design-system/actions/workflows/ci.yml/badge.svg)](https://github.com/wutangpaul/news-design-system/actions/workflows/ci.yml)
[![React](https://img.shields.io/badge/React-18-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Storybook](https://img.shields.io/badge/Storybook-9-FF4785?logo=storybook&logoColor=white)](https://storybook.js.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

A component library, pattern library, and set of page templates for a premium news-publishing
platform. Built with React, TypeScript, and Tailwind CSS, documented in Storybook.

| | |
|---|---|
| **Components** | 35 |
| **Patterns** | 37 |
| **Templates** | 15 |
| **Tests** | 798 passing across 87 test files |
| **Accessibility** | WCAG 2.2 AA, axe-core clean on every default story |

The system is organized into five layers, matching how a newsroom's product actually gets
assembled — from raw design decisions up to full pages:

```
Design Tokens  →  Foundations  →  Components  →  Patterns  →  Templates
   (colors,        (accessibility,   (Button,       (StoryCard,   (Homepage,
    type, space)     dark mode,       Input,         ArticleBody,  Article,
                      grid, a11y)     Modal, ...)     Byline, ...)  LiveBlog, ...)
```

## Stack

- **React 18** + **TypeScript**
- **Tailwind CSS 3** (class-based dark mode) — theme generated from `src/tokens/*`
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
  breakpoints, z-index. Single source of truth, consumed by `tailwind.config.ts`. Color system:
  `ink` (neutral grayscale), `masthead` (brand red accent), `success`/`warning`/`error`/`info`
  (semantic). Theme-aware `surface-*`/`text-*` Tailwind utilities are CSS-variable-backed so
  components using them automatically support dark mode.
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
the boundaries around shared files (tokens, Tailwind config, Storybook config) that shouldn't be
edited casually.

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
GitHub release and tags the version.

## Project status

All four phases from the original brief are complete: design tokens, foundations
documentation, the full component library, the pattern library, and page templates. The
codebase is verified clean end-to-end (typecheck, lint, full test suite, app build, Storybook
build) as of the latest change.

## License

[MIT](./LICENSE)
