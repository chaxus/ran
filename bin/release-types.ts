import { object, text } from './tooling-json.ts';
export interface ReleaseIdentity {
  name: string;
  version: string;
  integrity?: string;
}
export interface ReleaseArchive extends ReleaseIdentity {
  archive: string;
  integrity: string;
}
export interface ReleaseReceipt {
  tag: string;
  packages: ReleaseArchive[];
  commit?: string;
  preparedFromCleanCheckout?: boolean;
}
export function releaseReceipt(value: unknown): ReleaseReceipt {
  const data = object(value, 'release receipt');
  if (!Array.isArray(data.packages)) throw new TypeError('Release receipt packages must be an array');
  const packages = data.packages.map((value): ReleaseArchive => {
    const pkg = object(value, 'release archive');
    return {
      name: text(pkg.name, 'archive name'),
      version: text(pkg.version, 'archive version'),
      archive: text(pkg.archive, 'archive path'),
      integrity: text(pkg.integrity, 'archive integrity'),
    };
  });
  const receipt: ReleaseReceipt = { tag: text(data.tag, 'release tag'), packages };
  if (data.commit !== undefined) receipt.commit = text(data.commit, 'release commit');
  if (data.preparedFromCleanCheckout !== undefined) {
    if (typeof data.preparedFromCleanCheckout !== 'boolean')
      throw new TypeError('Clean checkout receipt must be boolean');
    receipt.preparedFromCleanCheckout = data.preparedFromCleanCheckout;
  }
  return receipt;
}
