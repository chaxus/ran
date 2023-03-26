import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { build } from '@/ranpack'

const __filename = fileURLToPath(import.meta.url)

const __dirname = dirname(__filename)

const option = {
    input: resolve(__dirname, './index')
}

async function buildTest() {
    const bundle = await build(option);
    const res = bundle.generate();
    bundle.write();
    return res
}

const result = `
const a = 1;
const add = function (num1, num2) {
  return num1 + num2;
};
export const c = add(a, 2);
`

describe('ranpack', () => {
    it('tree shaking', async () => {
        try {
            const res = await buildTest()
            expect(res.code).to.be.equal(result)
        } catch (error) {
            console.log('error', error);
        }
    })
})