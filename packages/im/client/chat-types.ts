/**
 * The message shapes shared by the composer, the store and the request body.
 *
 * Their own module because `client.ts` imports the store and the store needs these: putting
 * them in `client.ts` would make the store import the entry point that imports the store.
 */

/** One part of a multimodal message. */
export type ContentPart = { type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } };

/**
 * What a message carries.
 *
 * A plain string for a text-only turn — the form every provider accepts — and parts only
 * once there is something besides text.
 */
export type MessageContent = string | ContentPart[];
