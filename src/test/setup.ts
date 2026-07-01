import "@testing-library/jest-dom/vitest";
import { expect } from "vitest";
import type { AxeResults, Result } from "axe-core";

// vitest-axe@0.1.0's published types re-export everything from "vitest-axe/matchers" as
// `export type *`, which makes its `toHaveNoViolations` value unusable from TypeScript even
// though the runtime export is a real function, and its type augmentation targets Vitest 1.x's
// `Vi` namespace which Vitest 2.x's `expect` no longer reads. Rather than depend on the
// package's broken/stale type surface, we register the (trivial) matcher and its types
// ourselves, augmenting the module Vitest 2.x actually sources `Assertion` from.
function describeViolations(violations: Result[]): string {
  return violations
    .map((v) => `- ${v.id}: ${v.help} (${v.helpUrl})`)
    .join("\n");
}

expect.extend({
  toHaveNoViolations(results: AxeResults) {
    const violations = results.violations ?? [];
    return {
      pass: violations.length === 0,
      message: () =>
        violations.length === 0
          ? "expected axe violations, but none were found"
          : `expected no accessibility violations but found ${violations.length}:\n${describeViolations(violations)}`,
    };
  },
});

declare module "@vitest/expect" {
  interface Assertion<T> {
    toHaveNoViolations: T extends AxeResults ? () => void : never;
  }
}
