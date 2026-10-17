import fs from 'node:fs';
import type { Noop } from '@/utils/noop';

/** Result shared by the file helpers; self-contained in published declarations. */
export interface Identification {
  success: boolean;
  _identification?: boolean;
  message?: string;
  data?: unknown;
}

export type FilePromiseResult = Promise<Identification> & {
  abort?: Noop;
};

export type Error = NodeJS.ErrnoException | null;

export default fs;
