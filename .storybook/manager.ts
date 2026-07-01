import { addons } from "storybook/manager-api";

addons.setConfig({
  showNav: true, // Show the left sidebar
  showPanel: true, // Show the bottom addon panel
  panelPosition: "bottom",
  // Keep every top-level sidebar section (Design Tokens, Foundations, Components,
  // Patterns, Templates) expanded by default rather than requiring a click to open —
  // with 80+ docs entries, a collapsed-by-default tree hides most of the library on
  // first load.
  sidebar: {
    collapsedRoots: [],
  },
});
