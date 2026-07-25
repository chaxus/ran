import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WebDB } from '@/utils';
import type { IDBCollection } from '@/utils';

/**
 * A WebDB whose raw methods are stubbed, so the collection façade can be tested for the one
 * thing it owns: binding the store name and folding failures into the empty case.
 */
const makeDb = (): { db: WebDB; calls: string[]; fail: (on: string | null) => void } => {
  const db = new WebDB({ dbName: 'test' });
  const rows = new Map<IDBValidKey, { id: string }>();
  const calls: string[] = [];
  let failing: string | null = null;

  const guard = <T>(op: string, run: () => T): Promise<T> => {
    calls.push(op);
    if (failing === op) return Promise.reject({ error: true, message: `${op} error` });
    return Promise.resolve(run());
  };

  db.readByKey = (({ storeName, key }: { storeName: string; key: IDBValidKey }) =>
    guard(`read:${storeName}`, () => ({ status: 'success', code: 0, error: false, data: rows.get(key) }))) as never;
  db.readByCursor = (({ storeName }: { storeName: string }) =>
    guard(`cursor:${storeName}`, () => ({
      status: 'success',
      code: 0,
      error: false,
      data: [...rows.values()],
    }))) as never;
  db.count = (({ storeName }: { storeName: string }) =>
    guard(`count:${storeName}`, () => ({ status: 'success', code: 0, error: false, data: rows.size }))) as never;
  db.add = (({ storeName, data }: { storeName: string; data: { id: string } }) =>
    guard(`add:${storeName}`, () => {
      rows.set(data.id, data);
      return { status: 'success', code: 0, error: false, data };
    })) as never;
  db.update = (({ storeName, data }: { storeName: string; data: { id: string } }) =>
    guard(`put:${storeName}`, () => {
      rows.set(data.id, data);
      return { status: 'success', code: 0, error: false, data: null };
    })) as never;
  db.delete = (({ storeName, key }: { storeName: string; key: IDBValidKey }) =>
    guard(`remove:${storeName}`, () => {
      rows.delete(key);
      return { status: 'success', code: 0, error: false, data: null };
    })) as never;
  db.clear = (({ storeName }: { storeName: string }) =>
    guard(`clear:${storeName}`, () => {
      rows.clear();
      return { status: 'success', code: 0, error: false, data: null };
    })) as never;

  return { db, calls, fail: (on) => (failing = on) };
};

let harness: ReturnType<typeof makeDb>;
let notes: IDBCollection<{ id: string; text?: string }>;

beforeEach(() => {
  harness = makeDb();
  notes = harness.db.collection<{ id: string; text?: string }>('books_notes');
});
afterEach(() => harness.fail(null));

describe('WebDB.collection', () => {
  it('exposes the bound store name', () => {
    expect(notes.name).toBe('books_notes');
  });

  it('threads the store name into every call so the caller never repeats it', async () => {
    await notes.put({ id: '1' });
    await notes.get('1');
    await notes.all();
    await notes.count();
    await notes.remove('1');
    await notes.clear();
    expect(harness.calls).toEqual([
      'put:books_notes',
      'read:books_notes',
      'cursor:books_notes',
      'count:books_notes',
      'remove:books_notes',
      'clear:books_notes',
    ]);
  });

  it('round-trips a record and unwraps it from IDBResult', async () => {
    expect(await notes.put({ id: '1', text: 'hello' })).toBe(true);
    expect(await notes.get('1')).toEqual({ id: '1', text: 'hello' });
    expect(await notes.all()).toEqual([{ id: '1', text: 'hello' }]);
    expect(await notes.count()).toBe(1);
  });

  it('returns null for a missing key rather than undefined', async () => {
    expect(await notes.get('nope')).toBeNull();
  });

  it('removes and clears', async () => {
    await notes.put({ id: '1' });
    await notes.put({ id: '2' });
    expect(await notes.remove('1')).toBe(true);
    expect(await notes.count()).toBe(1);
    expect(await notes.clear()).toBe(true);
    expect(await notes.all()).toEqual([]);
  });

  it('folds a failed read into the empty case instead of rejecting', async () => {
    harness.fail('read:books_notes');
    await expect(notes.get('1')).resolves.toBeNull();
  });

  it('folds a failed listing into an empty array', async () => {
    harness.fail('cursor:books_notes');
    await expect(notes.all()).resolves.toEqual([]);
  });

  it('folds a failed count into 0', async () => {
    harness.fail('count:books_notes');
    await expect(notes.count()).resolves.toBe(0);
  });

  it('reports a failed write as false rather than throwing', async () => {
    harness.fail('put:books_notes');
    await expect(notes.put({ id: '1' })).resolves.toBe(false);
  });

  it('reports a failed delete and clear as false', async () => {
    harness.fail('remove:books_notes');
    await expect(notes.remove('1')).resolves.toBe(false);
    harness.fail('clear:books_notes');
    await expect(notes.clear()).resolves.toBe(false);
  });

  it('keeps two collections on the same db independent', async () => {
    const progress = harness.db.collection<{ id: string }>('books_progress');
    await notes.put({ id: 'n1' });
    await progress.get('p1');
    expect(harness.calls).toEqual(['put:books_notes', 'read:books_progress']);
  });
});
