import fs from 'node:fs';
import type { Noop } from '@/utils/noop';

export type FilePromiseResult = Promise<Ranuts.Identification> & {
  abort?: Noop;
};

export type Error = NodeJS.ErrnoException | null;

export default fs;
