import React, { useEffect } from "react";
import type { Preview } from "@storybook/react";
import "../src/index.css";

const ThemeWrapper = ({
  theme,
  children,
}: {
  theme: string;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  return <div className="bg-surface-canvas p-4">{children}</div>;
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
    layout: "fullscreen",
    options: {
      storySort: {
        order: [
          "Design Tokens",
          [
            "Overview",
            "Colors",
            "Typography",
            "Spacing & Radius",
            "Shadows & Motion",
            "Breakpoints & Z-Index",
          ],
          "Foundations",
          [
            "Overview",
            "Brand & Editorial Typography",
            "Grid & Layout",
            "Iconography",
            "Accessibility Standards",
            "Responsive Design Principles",
            "Dark Mode Strategy",
            "Print Styles",
          ],
          "Components",
          ["Overview", "*"],
          "Patterns",
          [
            "Overview",
            "Editorial",
            [
              "Article Header",
              "Hero Story",
              "Article Body",
              "Pull Quote",
              "Block Quote",
              "Inline Image",
              "Image Gallery",
              "Caption",
              "Byline",
              "Author Card",
              "Reading Progress",
              "Reading Time",
              "Related Articles",
              "Newsletter Signup",
              "Social Sharing",
              "Comments",
              "Live Blog Entry",
              "Breaking News Banner",
              "Topic Tags",
              "Category Navigation",
            ],
            "Navigation",
            [
              "Global Header",
              "Primary Navigation",
              "Secondary Navigation",
              "Mega Menu",
              "Footer",
              "Search Experience",
            ],
            "Content Discovery",
            [
              "Story Card",
              "Featured Story Grid",
              "Most Read",
              "Trending",
              "Recommended Articles",
              "Topic Collections",
              "Video Cards",
              "Podcast Cards",
            ],
          ],
          "Templates",
          ["Overview"],
        ],
      },
    },
  },
  globalTypes: {
    theme: {
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => (
      <ThemeWrapper theme={context.globals.theme}>
        <Story />
      </ThemeWrapper>
    ),
  ],
};

export default preview;
