import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta = {
  title: "Components/Card",
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <Card.Body>
        <h3 className="text-h6">Newsroom expands climate desk</h3>
        <p className="text-small text-text-secondary">
          Three new reporters join the team covering extreme weather and
          policy.
        </p>
      </Card.Body>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <Card variant="flat">
        <Card.Body>
          <p className="text-small font-medium">Flat</p>
        </Card.Body>
      </Card>
      <Card variant="outlined">
        <Card.Body>
          <p className="text-small font-medium">Outlined</p>
        </Card.Body>
      </Card>
      <Card variant="elevated">
        <Card.Body>
          <p className="text-small font-medium">Elevated</p>
        </Card.Body>
      </Card>
    </div>
  ),
};

export const PaddingDensity: Story = {
  name: "Padding density",
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <Card variant="outlined" padding="compact">
        <Card.Body>
          <p className="text-small font-medium">Compact</p>
        </Card.Body>
      </Card>
      <Card variant="outlined" padding="comfortable">
        <Card.Body>
          <p className="text-small font-medium">Comfortable</p>
        </Card.Body>
      </Card>
      <Card variant="outlined" padding="spacious">
        <Card.Body>
          <p className="text-small font-medium">Spacious</p>
        </Card.Body>
      </Card>
    </div>
  ),
};

export const WithHeaderAndFooter: Story = {
  name: "Header / Body / Footer composition",
  render: () => (
    <Card variant="outlined" className="max-w-sm">
      <Card.Header>
        <p className="text-caption uppercase tracking-wide text-text-tertiary">
          Politics
        </p>
        <h3 className="text-h6">City council approves new transit budget</h3>
      </Card.Header>
      <Card.Body>
        <p className="text-small text-text-secondary">
          The $2.4 billion plan funds four new light-rail lines over the next
          decade.
        </p>
      </Card.Body>
      <Card.Footer>
        <span className="text-caption text-text-tertiary">5 min read</span>
      </Card.Footer>
    </Card>
  ),
};

export const Interactive: Story = {
  name: "Interactive (composed with a link)",
  render: () => (
    <a
      href="https://example.com/full-story"
      className="block max-w-sm rounded-lg focus-visible:outline-none"
    >
      <Card variant="outlined" interactive>
        <Card.Body>
          <h3 className="text-h6">Read the full story</h3>
          <p className="text-small text-text-secondary">
            Card only supplies the hover/focus affordance — the link wrapping
            it owns the click and keyboard behavior.
          </p>
        </Card.Body>
      </Card>
    </a>
  ),
};

export const AsSection: Story = {
  name: "Polymorphic `as` prop",
  render: () => (
    <Card as="section" variant="outlined" aria-label="Editor's picks">
      <Card.Body>
        <p className="text-small">Rendered as a native &lt;section&gt;.</p>
      </Card.Body>
    </Card>
  ),
};
