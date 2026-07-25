import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WebDB, createHandoff } from '@/utils';

/* ── A minimal IndexedDB stand-in ──────────────────────────────────────────
 * Only the parts WebDB uses (open/upgrade, transactions, CRUD, cursors), which is enough to
 * cover the three things that matter: creating stores from the schema, aligning versions,
 * and the promise wrapping.
 */

class FakeRequest<T = unknown> {
  result!: T;
  error: { name: string; message: string } | null = null;
  transaction: FakeTransaction | null = null;
  onsuccess: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onupgradeneeded: ((event: unknown) => void) | null = null;

  succeed(result: T): void {
    this.result = result;
    queueMicrotask(() => this.onsuccess?.());
  }
  failWith(name: string, message: string): void {
    this.error = { name, message };
    queueMicrotask(() => this.onerror?.());
  }
}

class FakeNameList {
  private names = new Set<string>();
  add(name: string): void {
    this.names.add(name);
  }
  contains(name: string): boolean {
    return this.names.has(name);
  }
}

class FakeObjectStore {
  indexNames = new FakeNameList();
  createdIndexes: string[] = [];
  constructor(
    public name: string,
    public rows: Map<unknown, Record<string, unknown>>,
    public keyPath: string,
  ) {}

  private key(value: Record<string, unknown>): unknown {
    return value[this.keyPath];
  }
  add(value: Record<string, unknown>): FakeRequest {
    const request = new FakeRequest();
    if (this.rows.has(this.key(value))) request.failWith('ConstraintError', 'key exists');
    else {
      this.rows.set(this.key(value), value);
      request.succeed(this.key(value));
    }
    return request;
  }
  put(value: Record<string, unknown>): FakeRequest {
    const request = new FakeRequest();
    this.rows.set(this.key(value), value);
    request.succeed(this.key(value));
    return request;
  }
  get(key: unknown): FakeRequest {
    const request = new FakeRequest();
    request.succeed(this.rows.get(key));
    return request;
  }
  getAll(): FakeRequest {
    const request = new FakeRequest();
    request.succeed([...this.rows.values()]);
    return request;
  }
  count(): FakeRequest {
    const request = new FakeRequest();
    request.succeed(this.rows.size);
    return request;
  }
  delete(key: unknown): FakeRequest {
    const request = new FakeRequest();
    this.rows.delete(key);
    request.succeed(undefined);
    return request;
  }
  clear(): FakeRequest {
    const request = new FakeRequest();
    this.rows.clear();
    request.succeed(undefined);
    return request;
  }
  createIndex(name: string): void {
    this.indexNames.add(name);
    this.createdIndexes.push(name);
  }
  openCursor(): FakeRequest {
    const request = new FakeRequest<{ value: unknown; continue: () => void } | null>();
    const values = [...this.rows.values()];
    let i = 0;
    const step = (): void => {
      if (i < values.length) {
        const value = values[i++];
        request.result = { value, continue: () => queueMicrotask(step) };
      } else {
        request.result = null;
      }
      request.onsuccess?.();
    };
    queueMicrotask(step);
    return request;
  }
}

class FakeTransaction {
  constructor(private db: FakeDatabase) {}
  objectStore(name: string): FakeObjectStore {
    const store = this.db.stores.get(name);
    if (!store) throw new Error(`NotFoundError: ${name}`);
    return store;
  }
}

class FakeDatabase {
  stores = new Map<string, FakeObjectStore>();
  objectStoreNames = new FakeNameList();
  closed = false;
  onversionchange: (() => void) | null = null;
  constructor(
    public name: string,
    public version: number,
  ) {}
  createObjectStore(name: string, options?: { keyPath?: string }): FakeObjectStore {
    const store = new FakeObjectStore(name, new Map(), options?.keyPath ?? 'id');
    this.stores.set(name, store);
    this.objectStoreNames.add(name);
    return store;
  }
  transaction(): FakeTransaction {
    if (this.closed) throw new Error('InvalidStateError: database is closed');
    return new FakeTransaction(this);
  }
  close(): void {
    this.closed = true;
  }
}

/** The "disk": database name → the persisted instance, keeping data and version across opens */
const disk = new Map<string, FakeDatabase>();

const fakeIndexedDB = {
  open(name: string, version: number): FakeRequest<FakeDatabase> {
    const request = new FakeRequest<FakeDatabase>();
    const existing = disk.get(name);
    if (existing && version < existing.version) {
      request.failWith(
        'VersionError',
        `The requested version (${version}) is less than the existing version (${existing.version}).`,
      );
      return request;
    }
    const db = existing ?? new FakeDatabase(name, version);
    const needsUpgrade = !existing || version > existing.version;
    db.version = version;
    db.closed = false;
    disk.set(name, db);
    queueMicrotask(() => {
      if (needsUpgrade) {
        request.result = db;
        request.transaction = new FakeTransaction(db);
        request.onupgradeneeded?.({});
      }
      request.result = db;
      request.onsuccess?.();
    });
    return request;
  },
  deleteDatabase(name: string): FakeRequest {
    const request = new FakeRequest();
    disk.delete(name);
    request.succeed(undefined);
    return request;
  },
};

const STORES = [
  { name: 'books', options: { keyPath: 'id' }, indexes: [{ name: 'byAuthor', keyPath: 'author' }] },
  { name: 'notes', options: { keyPath: 'id' } },
];

describe('WebDB', () => {
  beforeEach(() => {
    disk.clear();
    (globalThis as unknown as { indexedDB: unknown }).indexedDB = fakeIndexedDB;
  });
  afterEach(() => {
    delete (globalThis as unknown as { indexedDB?: unknown }).indexedDB;
  });

  const open = async (version = 1): Promise<WebDB> => {
    const db = new WebDB({ dbName: 'test', version, stores: STORES });
    await db.openDataBase();
    return db;
  };

  it('creates the declared stores and indexes on upgrade', async () => {
    await open();
    const raw = disk.get('test')!;
    expect([...raw.stores.keys()]).toEqual(['books', 'notes']);
    expect(raw.stores.get('books')!.createdIndexes).toEqual(['byAuthor']);
  });

  it('does not recreate existing stores or indexes on a later upgrade', async () => {
    await open(1);
    const db = new WebDB({ dbName: 'test', version: 2, stores: STORES });
    await db.openDataBase();
    // The index was created once on the first upgrade; reopening does not create it again
    expect(disk.get('test')!.stores.get('books')!.createdIndexes).toEqual(['byAuthor']);
    expect(db.version).toBe(2);
  });

  it('runs the upgrade hook after the declared stores exist', async () => {
    const seen: string[] = [];
    const db = new WebDB({
      dbName: 'test',
      version: 1,
      stores: STORES,
      upgrade: (database) => void seen.push(...(database as unknown as FakeDatabase).stores.keys()),
    });
    await db.openDataBase();
    expect(seen).toEqual(['books', 'notes']);
  });

  it('round-trips add / readByKey / update / delete', async () => {
    const db = await open();
    await db.add({ storeName: 'books', data: { id: '1', title: 'Walden' } });
    expect((await db.readByKey<{ title: string }>({ storeName: 'books', key: '1' })).data.title).toBe('Walden');

    await db.update({ storeName: 'books', data: { id: '1', title: 'Walden II' } });
    expect((await db.readByKey<{ title: string }>({ storeName: 'books', key: '1' })).data.title).toBe('Walden II');

    await db.delete({ storeName: 'books', key: '1' });
    expect((await db.readByKey({ storeName: 'books', key: '1' })).data).toBeUndefined();
  });

  it('rejects a duplicate add', async () => {
    const db = await open();
    await db.add({ storeName: 'books', data: { id: '1' } });
    await expect(db.add({ storeName: 'books', data: { id: '1' } })).rejects.toMatchObject({
      error: true,
      message: 'add error',
    });
  });

  it('reads all rows, counts them, and clears the store', async () => {
    const db = await open();
    await db.add({ storeName: 'books', data: { id: '1' } });
    await db.add({ storeName: 'books', data: { id: '2' } });
    expect((await db.readAll({ storeName: 'books' })).data).toHaveLength(2);
    expect((await db.count({ storeName: 'books' })).data).toBe(2);
    await db.clear({ storeName: 'books' });
    expect((await db.count({ storeName: 'books' })).data).toBe(0);
  });

  it('collects every row through a cursor', async () => {
    const db = await open();
    await db.add({ storeName: 'books', data: { id: '1' } });
    await db.add({ storeName: 'books', data: { id: '2' } });
    const result = await db.readByCursor<{ id: string }>({ storeName: 'books' });
    expect(result.data.map((r) => r.id)).toEqual(['1', '2']);
  });

  it('recovers from VersionError by realigning to the on-disk version', async () => {
    await open(3); // v3 is what is on disk
    const stale = new WebDB({ dbName: 'test', version: 1, stores: STORES });
    const result = await stale.openDataBase();
    expect(result.status).toBe('success');
    expect(stale.version).toBe(3);
  });

  it('rejects instead of hanging when a store does not exist', async () => {
    const db = await open();
    await expect(db.readByKey({ storeName: 'nope', key: '1' })).rejects.toMatchObject({ error: true });
  });

  it('rejects operations after the database is closed', async () => {
    const db = await open();
    db.closeDataBase();
    await expect(db.add({ storeName: 'books', data: { id: '1' } })).rejects.toMatchObject({ error: true });
  });

  it('drops its handle when another connection asks for a version bump', async () => {
    const db = await open();
    disk.get('test')!.onversionchange?.();
    expect(db.database).toBeUndefined();
  });
});

/*
 * A second, smaller IndexedDB stand-in for `createHandoff`. It needs things the WebDB fake
 * above deliberately lacks — out-of-line keys (`put(value, key)`) and transaction
 * completion events — and `createHandoff` resolves on `oncomplete`, so a fake that never
 * fires it would hang rather than fail.
 */
class HandoffTransaction {
  oncomplete: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onabort: (() => void) | null = null;
  private pending = 0;
  constructor(private rows: Map<string, unknown>) {
    // Settle once the synchronous body of the caller has queued its requests.
    queueMicrotask(() => queueMicrotask(() => this.oncomplete?.()));
  }
  objectStore(): {
    get: (key: string) => { result: unknown; onsuccess: (() => void) | null };
    put: (value: unknown, key: string) => void;
    delete: (key: string) => void;
  } {
    const rows = this.rows;
    return {
      get: (key: string) => {
        const request: { result: unknown; onsuccess: (() => void) | null } = { result: undefined, onsuccess: null };
        this.pending++;
        queueMicrotask(() => {
          request.result = rows.get(key);
          request.onsuccess?.();
          this.pending--;
        });
        return request;
      },
      put: (value: unknown, key: string) => void rows.set(key, value),
      delete: (key: string) => void rows.delete(key),
    };
  }
}

describe('createHandoff', () => {
  const rows = new Map<string, unknown>();

  const install = (): void => {
    rows.clear();
    (globalThis as unknown as { indexedDB: unknown }).indexedDB = {
      open: () => {
        const request: Record<string, unknown> = {
          result: {
            objectStoreNames: { contains: () => true },
            transaction: () => new HandoffTransaction(rows),
            close: () => {},
          },
        };
        queueMicrotask(() => (request.onsuccess as (() => void) | undefined)?.());
        return request;
      },
    };
  };

  afterEach(() => {
    delete (globalThis as unknown as { indexedDB?: unknown }).indexedDB;
  });

  it('hands a value from one page to the next', async () => {
    install();
    const handoff = createHandoff<string>({ dbName: 'test-handoff' });
    await expect(handoff.put('walden.docx')).resolves.toBe(true);
    await expect(handoff.take()).resolves.toBe('walden.docx');
  });

  it('is one-shot: a second take finds nothing', async () => {
    install();
    const handoff = createHandoff<string>({ dbName: 'test-handoff' });
    await handoff.put('walden.docx');
    await handoff.take();
    // This is what stops a reload from re-opening the same file.
    await expect(handoff.take()).resolves.toBeNull();
  });

  it('resolves null when nothing was ever handed over', async () => {
    install();
    await expect(createHandoff<string>({ dbName: 'test-handoff' }).take()).resolves.toBeNull();
  });

  it('degrades to null / false when IndexedDB is unavailable', async () => {
    // A page that merely *tried* to hand a file over must not break because storage is
    // missing or blocked (SSR, private mode, third-party frame).
    const handoff = createHandoff<string>({ dbName: 'test-handoff' });
    await expect(handoff.put('value')).resolves.toBe(false);
    await expect(handoff.take()).resolves.toBeNull();
  });
});
