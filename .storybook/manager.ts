import { addons } from "storybook/manager-api";

// Note: `showNav`/`showPanel` are a pre-v8 addons.setConfig API and don't exist in this
// Storybook version (confirmed absent from node_modules/storybook's manager-api) — the
// sidebar's actual default (open, navSize: 300) already applies out of the box. If it ever
// loads closed, that's persisted session state from a previous manual toggle (or the "S"
// keyboard shortcut), stored per-browser-tab — not something a manager.ts default can
// override once the user has toggled it. Clearing sessionStorage for this origin, or a
// private/incognito window, confirms the real default.
addons.setConfig({
  // Keep every top-level sidebar section (Design Tokens, Foundations, Components,
  // Patterns, Templates) expanded by default rather than requiring a click to open —
  // with 80+ docs entries, a collapsed-by-default tree hides most of the library on
  // first load.
  sidebar: {
    collapsedRoots: [],
  },
});
