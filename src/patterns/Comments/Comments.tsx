import {
  forwardRef,
  useId,
  useState,
  type FormEvent,
  type HTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";
import { Avatar } from "../../components/Avatar";
import { Button } from "../../components/Button";
import { Textarea } from "../../components/Textarea";

/** Minimal author info for a single comment. */
export interface CommentAuthor {
  /** Full display name — used for the avatar fallback initials and as visible text. */
  name: string;
  /** Optional avatar image source. Falls back to initials when omitted. */
  avatarSrc?: string;
}

/** Content shape for a single comment, including optional nested replies. */
export interface CommentData {
  /** Stable identifier, passed back via `onReply`. */
  id: string;
  author: CommentAuthor;
  /** ISO 8601 timestamp string, passed straight through to a real `<time dateTime>`. */
  timestamp: string;
  /** Comment body. Plain text — this pattern doesn't render rich/markdown content. */
  body: string;
  /** Nested replies, rendered indented beneath this comment. */
  replies?: CommentData[];
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export interface CommentProps extends Omit<HTMLAttributes<HTMLLIElement>, "id"> {
  /** The comment to display. */
  comment: CommentData;
  /** Called with the comment's `id` when its Reply control is activated. Omit to hide Reply. */
  onReply?: (commentId: string) => void;
}

/**
 * A single comment: avatar, author name, machine-readable timestamp, and body text.
 * Purely presentational — it renders whatever `comment.replies` it's given but has no
 * opinion on how those replies were fetched or ordered.
 */
export const Comment = forwardRef<HTMLLIElement, CommentProps>(
  ({ comment, onReply, className, ...rest }, ref) => {
    return (
      <li ref={ref} className={cn("flex flex-col gap-2", className)} {...rest}>
        <div className="flex items-start gap-3">
          <Avatar name={comment.author.name} src={comment.author.avatarSrc} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-small font-semibold text-text-primary">
                {comment.author.name}
              </span>
              <time dateTime={comment.timestamp} className="font-mono text-caption text-text-tertiary">
                {formatTimestamp(comment.timestamp)}
              </time>
            </div>
            <p className="mt-1 text-small text-text-secondary">{comment.body}</p>
            {onReply && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="-ml-3 mt-1 h-auto px-3 py-1 text-small"
                onClick={() => onReply(comment.id)}
                aria-label={`Reply to ${comment.author.name}`}
              >
                Reply
              </Button>
            )}
          </div>
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <ol className="ml-11 flex flex-col gap-3 border-l border-surface-border pl-4">
            {comment.replies.map((reply) => (
              <Comment key={reply.id} comment={reply} onReply={onReply} />
            ))}
          </ol>
        )}
      </li>
    );
  },
);
Comment.displayName = "Comment";

export interface CommentsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  /** Flat (or threaded, via `replies`) list of comments to display. */
  comments: CommentData[];
  /** Called with a comment's `id` when its Reply control is activated. Omit to hide Reply on every comment. */
  onReply?: (commentId: string) => void;
  /**
   * Called with the trimmed draft text when the composer is submitted. Omit to hide the
   * composer entirely — this component never appends the new comment itself (no backend,
   * no optimistic state); the caller owns re-fetching/re-rendering `comments`.
   */
  onSubmit?: (body: string) => void;
  /** Label for the composer's submit button. @default "Post comment" */
  submitLabel?: string;
  /** Message shown when `comments` is empty. @default "No comments yet." */
  emptyMessage?: string;
}

/**
 * Threaded/flat comment list. Renders an optional new-comment composer (when `onSubmit`
 * is passed) above the list of `Comment`s. Display-only: it accepts `comments` as data and
 * reports intent via `onReply`/`onSubmit` — moderation, persistence, and real submission
 * are the host application's responsibility.
 */
export const Comments = forwardRef<HTMLDivElement, CommentsProps>(
  (
    {
      comments,
      onReply,
      onSubmit,
      submitLabel = "Post comment",
      emptyMessage = "No comments yet.",
      className,
      ...rest
    },
    ref,
  ) => {
    const [draft, setDraft] = useState("");
    const textareaId = useId();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const trimmed = draft.trim();
      if (!trimmed) return;
      onSubmit?.(trimmed);
      setDraft("");
    }

    return (
      <div ref={ref} className={cn("flex flex-col gap-6", className)} {...rest}>
        {onSubmit && (
          <form onSubmit={handleSubmit} className="flex flex-col items-end gap-2">
            <Textarea
              id={textareaId}
              label="Add a comment"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Share your thoughts..."
              wrapperClassName="w-full"
            />
            <Button type="submit" size="sm" disabled={draft.trim().length === 0}>
              {submitLabel}
            </Button>
          </form>
        )}
        {comments.length === 0 ? (
          <p className="text-small text-text-tertiary">{emptyMessage}</p>
        ) : (
          <ol className="flex flex-col gap-5">
            {comments.map((comment) => (
              <Comment key={comment.id} comment={comment} onReply={onReply} />
            ))}
          </ol>
        )}
      </div>
    );
  },
);
Comments.displayName = "Comments";
