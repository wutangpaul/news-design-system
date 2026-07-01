import type { Meta, StoryObj } from "@storybook/react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./Accordion";

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <Accordion type="single" defaultValue="item-1" className="max-w-xl">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is your corrections policy?</AccordionTrigger>
        <AccordionContent>
          We correct factual errors promptly and append a visible correction note to the
          original article.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How is sponsored content labeled?</AccordionTrigger>
        <AccordionContent>
          Sponsored content is clearly labeled at the top of the article and styled distinctly
          from editorial content.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Can I republish your articles?</AccordionTrigger>
        <AccordionContent>
          Some articles are available for republication under a Creative Commons license — look
          for the republish badge.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  name: "type=multiple",
  render: () => (
    <Accordion type="multiple" defaultValue={["item-1"]} className="max-w-xl">
      <AccordionItem value="item-1">
        <AccordionTrigger>Section one</AccordionTrigger>
        <AccordionContent>Multiple items can be open at the same time.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Section two</AccordionTrigger>
        <AccordionContent>Try opening this while section one stays open.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const DisabledItem: Story = {
  render: () => (
    <Accordion type="single" defaultValue="item-1" className="max-w-xl">
      <AccordionItem value="item-1">
        <AccordionTrigger>Available section</AccordionTrigger>
        <AccordionContent>This section can be toggled.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" disabled>
        <AccordionTrigger>Unavailable section</AccordionTrigger>
        <AccordionContent>This content is not reachable while disabled.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
