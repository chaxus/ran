import assert from 'node:assert'
import { describe, it } from 'vitest'
import { queryMime } from '@/node/http/mimeType'

describe('encodeUrl(url)', function () {
    it('should keep URL the same', function () {
        assert.strictEqual(queryMime("myfile.txt"), 'text/plain', "lookup should return text/plain");
    })
})