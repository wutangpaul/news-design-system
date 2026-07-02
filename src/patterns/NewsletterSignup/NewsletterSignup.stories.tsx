import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { NewsletterSignup } from "./NewsletterSignup";

const meta = {
  title: "Patterns/Editorial/Newsletter Signup",
  component: NewsletterSignup,
  parameters: {
    layout: "padded",
  },
  args: {
    onSubmit: () => {},
  },
} satisfies Meta<typeof NewsletterSignup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function DefaultStory() {
    return (
      <div className="max-w-md">
        <NewsletterSignup
          description="Top headlines, delivered every weekday morning."
          onSubmit={() => {
            // Real usage wires this to an actual subscription request —
            // this pattern only knows how to call the callback.
          }}
        />
      </div>
    );
  },
};

export const Loading: Story = {
  render: () => (
    <div className="max-w-md">
      <NewsletterSignup
        description="Top headlines, delivered every weekday morning."
        isLoading
        onSubmit={() => {}}
      />
    </div>
  ),
};

export const WithError: Story = {
  name: "With a server-reported error",
  render: () => (
    <div className="max-w-md">
      <NewsletterSignup
        description="Top headlines, delivered every weekday morning."
        errorText="That email is already subscribed."
        onSubmit={() => {}}
      />
    </div>
  ),
};

export const Success: Story = {
  name: "After a successful submission",
  render: () => (
    <div className="max-w-md">
      <NewsletterSignup
        successMessage="You're subscribed — check your inbox to confirm."
        onSubmit={() => {}}
      />
    </div>
  ),
};

export const Inline: Story = {
  name: "Inline (compact, for mid-article/sidebar)",
  render: () => (
    <div className="max-w-xl">
      <NewsletterSignup variant="inline" onSubmit={() => {}} />
    </div>
  ),
};

export const InlineInSidebar: Story = {
  name: "Inline in a narrow sidebar",
  render: () => (
    <div className="max-w-[280px] rounded-lg border border-surface-border p-4">
      <NewsletterSignup
        variant="inline"
        heading="Get the briefing"
        onSubmit={() => {}}
      />
    </div>
  ),
};

export const Interactive: Story = {
  name: "Interactive (simulated async submit)",
  render: function InteractiveStory() {
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | undefined>();

    return (
      <div className="max-w-md">
        <NewsletterSignup
          description="Top headlines, delivered every weekday morning."
          isLoading={isLoading}
          successMessage={successMessage}
          onSubmit={(email) => {
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              setSuccessMessage(`Confirmation sent to ${email}.`);
            }, 800);
          }}
        />
      </div>
    );
  },
};
