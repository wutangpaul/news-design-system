import { forwardRef } from "react";
import { Icon, type IconProps } from "./Icon";

/** Props for a curated named icon — everything from {@link IconProps} except `children`,
 * which is predefined by the icon itself. */
export type NamedIconProps = Omit<IconProps, "children">;

/**
 * Hand-written, minimal 24x24 icon set covering the design system's common chrome
 * needs (close/dismiss, disclosure chevrons, search, navigation, sharing, save,
 * directional arrows, and external links). Each icon is built on top of {@link Icon},
 * so size/label/className/aria props all behave the same as the base wrapper.
 */

export const Close = forwardRef<SVGSVGElement, NamedIconProps>((props, ref) => (
  <Icon ref={ref} {...props}>
    <path
      d="M6 6l12 12M18 6L6 18"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
));
Close.displayName = "Close";

export const ChevronDown = forwardRef<SVGSVGElement, NamedIconProps>((props, ref) => (
  <Icon ref={ref} {...props}>
    <path
      d="M6 9l6 6 6-6"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
));
ChevronDown.displayName = "ChevronDown";

export const ChevronRight = forwardRef<SVGSVGElement, NamedIconProps>((props, ref) => (
  <Icon ref={ref} {...props}>
    <path
      d="M9 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
));
ChevronRight.displayName = "ChevronRight";

export const ChevronLeft = forwardRef<SVGSVGElement, NamedIconProps>((props, ref) => (
  <Icon ref={ref} {...props}>
    <path
      d="M15 6l-6 6 6 6"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
));
ChevronLeft.displayName = "ChevronLeft";

export const Search = forwardRef<SVGSVGElement, NamedIconProps>((props, ref) => (
  <Icon ref={ref} {...props}>
    <circle cx={11} cy={11} r={7} stroke="currentColor" strokeWidth={2} />
    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
  </Icon>
));
Search.displayName = "Search";

export const Menu = forwardRef<SVGSVGElement, NamedIconProps>((props, ref) => (
  <Icon ref={ref} {...props}>
    <path
      d="M4 6h16M4 12h16M4 18h16"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Icon>
));
Menu.displayName = "Menu";

export const Share = forwardRef<SVGSVGElement, NamedIconProps>((props, ref) => (
  <Icon ref={ref} {...props}>
    <path
      d="M12 15V4M12 4l-4 4M12 4l4 4"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 13v5a2 2 0 002 2h10a2 2 0 002-2v-5"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
));
Share.displayName = "Share";

export const Bookmark = forwardRef<SVGSVGElement, NamedIconProps>((props, ref) => (
  <Icon ref={ref} {...props}>
    <path
      d="M6.5 4A1.5 1.5 0 005 5.5V20l7-4.5 7 4.5V5.5A1.5 1.5 0 0017.5 4h-11z"
      fill="currentColor"
    />
  </Icon>
));
Bookmark.displayName = "Bookmark";

export const ArrowRight = forwardRef<SVGSVGElement, NamedIconProps>((props, ref) => (
  <Icon ref={ref} {...props}>
    <path
      d="M4 12h16M14 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
));
ArrowRight.displayName = "ArrowRight";

export const ExternalLink = forwardRef<SVGSVGElement, NamedIconProps>((props, ref) => (
  <Icon ref={ref} {...props}>
    <path
      d="M9 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-3"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 4h6v6M20 4L10 14"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
));
ExternalLink.displayName = "ExternalLink";
