/**
 * The vocabulary a tool uses to say what its call and result *are*, so a UI can decide
 * what they look like.
 *
 * A tool that returns markup has picked a renderer, a theme, and a layout on the UI's
 * behalf, and it does so in the one place — the model-facing result — where UI concerns do
 * not belong. Declaring an intent instead keeps the two apart: the tool names the shape of
 * what it did, and each surface renders that shape its own way.
 *
 * Two rules make this work, and both bite when broken:
 *
 * - **A view is a pure function of the call's arguments** (plus, for a result view, the
 *   result). These are computed on a live call *and* again when a log is replayed, so
 *   reading a file, the clock, or session state makes a replay disagree with what the user
 *   originally saw. A `diff` view built at call time uses `oldText: null` for a create
 *   precisely because a caller has no prior content to read.
 * - **An unrecognised card degrades, it never throws.** A surface that does not implement
 *   `diff` still shows the title and the raw input. Display must not be able to break a
 *   replay, so `<r-tool-card>` treats anything it does not recognise as `generic`.
 */

/** A file position a tool touched, so a capable editor can follow along. */
export interface ToolLocation {
  path: string;
  /** 1-based line, when the tool knows one. */
  line?: number;
}

/** One file a tool creates or modifies. */
export interface ToolDiff {
  path: string;
  /** Prior content, or null when the tool is creating the file. */
  oldText: string | null;
  newText: string;
}

/**
 * The one line a collapsed call shows beside its title.
 *
 * Optional and worth setting. The element derives one when it is absent — the first
 * argument, the command, the first path — but only the tool knows which of its arguments
 * is the one a reader scanning a run of calls needs to see. `fetch_url` wants the address;
 * a tool with six arguments wants whichever names the thing it acted on.
 */
interface ToolSummary {
  summary?: string;
}

/** The pending card, derived from a call's arguments. */
export type ToolCallView =
  | (ToolSummary & {
      card: 'generic';
      title: string;
      /** Icon hint — `read`, `search`, and so on. Unknown values fall back to no icon. */
      kind?: string;
      /** Arguments worth showing, already stringified by the producer. */
      input?: Record<string, string>;
      locations?: ToolLocation[];
    })
  | (ToolSummary & { card: 'terminal'; title: string; description?: string; cwd?: string })
  | (ToolSummary & { card: 'diff'; title: string; diffs: ToolDiff[]; locations?: ToolLocation[] });

/** The completed card, replacing the pending one. */
export type ToolResultView =
  | { card: 'generic'; title?: string; content?: string }
  | { card: 'terminal'; output: string; exitCode?: number }
  | { card: 'diff'; diffs: ToolDiff[] };

/** Lifecycle of the call the card shows. */
export type ToolCardStatus = 'running' | 'success' | 'error';
