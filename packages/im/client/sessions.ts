import { WebDB, createStore } from 'ranuts/utils';
import type { IDBCollection } from 'ranuts/utils';
import type { TokenUsage } from 'ranuts/stream';
import type { MessageContent, StoredMessage } from '@/client/chat-types';

export type { StoredMessage } from '@/client/chat-types';

/** One conversation. */
export interface Session {
  id: string;
  /** Derived from the first thing the user said; conversations are found by what they were about. */
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: StoredMessage[];
  /**
   * Tokens billed across every round of this conversation, including rounds whose messages
   * compaction has since folded away.
   *
   * Stored rather than derived: what a conversation cost is not recoverable from what it
   * currently carries, and after one compaction the two stop resembling each other.
   */
  usage?: TokenUsage;
}

const DB_NAME = 'ran-im';
const STORE = 'sessions';
/** Bumped only when the store layout changes; the record shape is the app's business. */
const DB_VERSION = 1;

const preferences = createStore<string>('ran-im:');
const CURRENT_KEY = 'current-session';

/** How much of the first message becomes the title. */
const TITLE_LENGTH = 24;

/**
 * Names a conversation after the first thing said in it.
 *
 * Every chat application does this, and for the same reason: a list of timestamps is a list
 * nobody can search. The first line is what the conversation was about often enough to be
 * worth more than an empty field waiting to be filled in by hand.
 *
 * @param content The first user message.
 * @returns A title, or the placeholder when there is no text to take one from.
 */
export function titleFrom(content: MessageContent): string {
  const text =
    typeof content === 'string'
      ? content
      : content
          .map((part) => (part.type === 'text' ? part.text : ''))
          .join(' ')
          .trim();
  const line = text.split('\n', 1)[0]?.trim() ?? '';
  if (line === '') return '未命名对话';
  return line.length <= TITLE_LENGTH ? line : `${line.slice(0, TITLE_LENGTH)}…`;
}

/** Reading and writing the conversations this browser holds. */
export interface SessionStore {
  /** Every conversation, most recently used first. */
  list(): Promise<Session[]>;
  /** One conversation, or null when it is gone. */
  get(id: string): Promise<Session | null>;
  /** Writes a conversation. Resolves false when the browser refused — see {@link save}. */
  save(session: Session): Promise<boolean>;
  remove(id: string): Promise<void>;
  /** The conversation this browser had open, so a reload lands where it left off. */
  currentId(): string;
  setCurrentId(id: string): void;
}

/**
 * Opens the conversation store.
 *
 * Reads use the forgiving `collection` handle, which answers with the empty case when
 * IndexedDB is unavailable — a private window, a browser with storage disabled — so the app
 * opens on an empty list rather than a broken screen.
 *
 * Writes do not get that treatment. `WebDB`'s own guidance is that swallowing a failure is
 * wrong when the write *is* the user's action, and a conversation they just had is exactly
 * that: losing it silently is worse than saying so. {@link SessionStore.save} reports
 * whether the write landed and leaves the decision to the caller.
 *
 * @returns The store, already open.
 */
export async function openSessionStore(): Promise<SessionStore> {
  const db = new WebDB({
    dbName: DB_NAME,
    version: DB_VERSION,
    stores: [{ name: STORE, options: { keyPath: 'id' } }],
  });
  await db.openDataBase();
  const sessions: IDBCollection<Session> = db.collection<Session>(STORE);

  return {
    async list(): Promise<Session[]> {
      const all = await sessions.all();
      // Most recently used first: the one being continued is the one being looked for.
      return all.sort((a, b) => b.updatedAt - a.updatedAt);
    },
    get: (id) => sessions.get(id),
    save: (session) => sessions.put(session),
    remove: async (id) => {
      await sessions.remove(id);
    },
    currentId: () => preferences.get(CURRENT_KEY, ''),
    setCurrentId: (id) => preferences.set(CURRENT_KEY, id),
  };
}
