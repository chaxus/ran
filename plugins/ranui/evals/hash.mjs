import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
export const hash = (value) => createHash('sha256').update(value).digest('hex');
export const treeHash = (root) =>
  hash(
    readdirSync(root, { recursive: true, withFileTypes: true })
      .filter((e) => e.isFile())
      .map((e) => {
        const p = path.join(e.parentPath, e.name);
        return [path.relative(root, p), hash(readFileSync(p))];
      })
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map((x) => x.join(':'))
      .join('\n'),
  );
