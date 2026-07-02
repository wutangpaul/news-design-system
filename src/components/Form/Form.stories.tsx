import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Form } from "./Form";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";

const meta: Meta<typeof Form> = {
  title: "Components/Form",
  component: Form,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof Form>;

/**
 * A realistic "Contact us" form. Field-level validation (and the `errors` map Form renders as
 * a summary) is entirely owned by this story — Form itself never inspects field values. Try
 * submitting with empty fields to see the error summary appear and take focus.
 */
function ContactForm({ autoSubmitOnMount = false }: { autoSubmitOnMount?: boolean }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  function validate(data: FormData): Record<string, string> {
    const nextErrors: Record<string, string> = {};
    if (!String(data.get("name") ?? "").trim()) {
      nextErrors["contact-name"] = "Enter your name.";
    }
    const email = String(data.get("email") ?? "").trim();
    if (!email) {
      nextErrors["contact-email"] = "Enter your email address.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors["contact-email"] = "Enter an email address in the correct format.";
    }
    if (!String(data.get("message") ?? "").trim()) {
      nextErrors["contact-message"] = "Enter your message.";
    }
    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const nextErrors = validate(new FormData(event.currentTarget));
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      // A real app would send the data on; the story just has nowhere to send it.
    }
  }

  // Demonstrates the "failed submit" flow without requiring the viewer to interact: submit an
  // empty form as soon as this story mounts, exactly as if a user had clicked Send with nothing
  // filled in.
  useEffect(() => {
    if (autoSubmitOnMount) {
      formRef.current?.requestSubmit();
    }
  }, [autoSubmitOnMount]);

  return (
    <Form ref={formRef} onSubmit={handleSubmit} errors={errors} className="max-w-md">
      <Input
        id="contact-name"
        name="name"
        label="Name"
        errorText={errors["contact-name"]}
        required
      />
      <Input
        id="contact-email"
        name="email"
        type="email"
        label="Email address"
        errorText={errors["contact-email"]}
        required
      />
      <Textarea
        id="contact-message"
        name="message"
        label="Message"
        errorText={errors["contact-message"]}
        required
      />
      <Button type="submit" className="self-start">
        Send message
      </Button>
    </Form>
  );
}

export const Default: Story = {
  render: () => <ContactForm />,
};

export const FailedSubmit: Story = {
  name: "Error summary (failed submit)",
  render: () => <ContactForm autoSubmitOnMount />,
};
