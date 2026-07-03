import React, { useEffect } from "react";
import type { Preview } from "@storybook/react-vite";
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
  return <div className="bg-surface-canvas">{children}</div>;
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
          "Introduction",
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
            "Data Visualization",
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
              "Social Embed",
              "Comments",
              "Live Blog Entry",
              "Breaking News Banner",
              "Topic Tags",
              "Category Navigation",
              "Paywall",
              "Ad Slot",
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
          [
            "Overview",
            "Homepage",
            "Article",
            "Live Blog",
            "Opinion",
            "Features",
            "Category Landing",
            "Topic Landing",
            "Author Profile",
            "Account",
            "Search Results",
            "Newsletter Landing",
            "Video",
            "Podcast",
            "Archive",
            "Error Pages",
          ],
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
