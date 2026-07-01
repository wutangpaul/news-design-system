import { forwardRef, useState, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Tag } from "../../components/Tag";
import { Link } from "../../components/Link";

export interface TopicTagItem {
  /** Stable identifier, used as the React key. */
  id: string;
  /** Visible label, e.g. "Climate" or "Politics". */
  label: string;
  /**
   * Destination URL for a topic archive page. When set, the tag renders as a real link
   * (wrapping a static `Tag`) instead of an interactive chip button.
   */
  href?: string;
  /**
   * Click handler for a filter-style chip (no navigation). Ignored when `href` is set —
   * a tag is either a navigational link or a JS-driven toggle, not both.
   */
  onClick?: () => void;
  /** Marks the chip as the active filter. Only meaningful when `onClick` is used (no `href`). */
  selected?: boolean;
}

export interface TopicTagsProps extends HTMLAttributes<HTMLDivElement> {
  /** Topics to display. */
  topics: TopicTagItem[];
  /** Caps the number of tags shown before a "Show more" toggle appears. Omit to show all. */
  maxVisible?: number;
  /** Label for the expand toggle when collapsed. Defaults to "Show N more". */
  showMoreLabel?: string;
  /** Label for the collapse toggle once expanded. @default "Show less" */
  showLessLabel?: string;
}

/**
 * Lays out a row of topic/category `Tag`s with wrapping and consistent gap — a thin
 * composition wrapper, not a reimplementation of `Tag`'s own static/interactive/removable
 * behavior. Each item renders as either a real link (when `href` is given) or an interactive
 * filter chip (when `onClick` is given), reusing `Tag`/`Link` exactly as they already work.
 */
export const TopicTags = forwardRef<HTMLDivElement, TopicTagsProps>(
  ({ topics, maxVisible, showMoreLabel, showLessLabel = "Show less", className, ...rest }, ref) => {
    const [expanded, setExpanded] = useState(false);

    const shouldCollapse = typeof maxVisible === "number" && topics.length > maxVisible;
    const visibleTopics = shouldCollapse && !expanded ? topics.slice(0, maxVisible) : topics;
    const hiddenCount = shouldCollapse ? topics.length - (maxVisible as number) : 0;

    return (
      <div ref={ref} className={cn("flex flex-wrap items-center gap-2", className)} {...rest}>
        {visibleTopics.map((topic) =>
          topic.href ? (
            <Link key={topic.id} href={topic.href} tone="standalone" className="no-underline">
              <Tag tone={topic.selected ? "brand" : "neutral"}>{topic.label}</Tag>
            </Link>
          ) : (
            <Tag
              key={topic.id}
              interactive
              tone={topic.selected ? "brand" : "neutral"}
              selected={topic.selected}
              onClick={topic.onClick}
            >
              {topic.label}
            </Tag>
          ),
        )}
        {shouldCollapse && (
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="rounded-full px-3 py-1 text-small font-medium text-masthead-600 underline-offset-2 hover:text-masthead-700 hover:underline"
          >
            {expanded ? showLessLabel : (showMoreLabel ?? `Show ${hiddenCount} more`)}
          </button>
        )}
      </div>
    );
  },
);
TopicTags.displayName = "TopicTags";
