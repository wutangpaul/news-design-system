import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge's default config doesn't know about this project's custom theme keys, so it
// misclassifies them against unrelated built-in groups and silently drops one side of a
// "conflict" that isn't really one:
//   - `text-h1`..`text-h6`, `text-display`, `text-caption`, `text-small`, `text-body`,
//     `text-lead` (our fontSize scale) collide with the `text-color` group (`text-text-primary`
//     etc) under the generic `text-{value}` classifier.
//   - `font-regular` (our fontWeight scale) collides with the `font-family` group
//     (`font-sans`/`font-serif`) under the generic `font-{value}` classifier.
const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "caption",
            "small",
            "body",
            "lead",
            "h6",
            "h5",
            "h4",
            "h3",
            "h2",
            "h1",
            "display",
          ],
        },
      ],
      "font-weight": [{ font: ["regular", "medium", "semibold", "bold"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
