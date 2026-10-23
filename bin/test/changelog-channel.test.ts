import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const generator = join(repository, 'packages/ranui/bin/generate-changelog-docs.ts');

for (const version of ['0.5.0', '0.5.0-alpha.1', '0.5.0-beta.1', '0.5.0-rc.1']) {
  test(`changelog pages reflect the ${version} release channel in every language`, async (t) => {
    const root = await mkdtemp(join(tmpdir(), 'ran-changelog-channel-'));
    t.after(() => rm(root, { recursive: true, force: true }));
    const cwd = join(root, 'packages/ranui');
    await mkdir(cwd, { recursive: true });
    await writeFile(join(cwd, 'package.json'), JSON.stringify({ name: 'ranui', type: 'module', version }));
    await writeFile(join(cwd, 'CHANGELOG.md'), `# Changelog\n\n## [${version}]\n\nRelease entry.\n`);
    await writeFile(join(cwd, 'CHANGELOG.zh-CN.md'), `# 更新日志\n\n## [${version}]\n\n发布记录。\n`);
    execFileSync(process.execPath, [generator], { cwd, stdio: 'pipe' });
    for (const lang of ['', 'cn', 'ja', 'es', 'pt', 'ko', 'de', 'fa']) {
      const page = await readFile(join(root, 'packages/docs', lang, 'src/ranui/changelog.md'), 'utf8');
      assert.equal(page.includes('::: warning '), version.includes('-'), `${lang || 'en'} warning`);
      assert.ok(page.includes(`## [${version}]`), `${lang || 'en'} release entry`);
      assert.ok(page.includes(lang === 'cn' ? '发布记录。' : 'Release entry.'), `${lang || 'en'} body`);
    }
    execFileSync(process.execPath, [generator, '--check'], { cwd, stdio: 'pipe' });
  });
}
