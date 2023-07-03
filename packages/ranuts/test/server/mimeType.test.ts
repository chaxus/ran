import assert from 'node:assert'
import { describe, it } from 'vitest'
import { getMime } from '@/server/mimeType'

describe('encodeUrl(url)', function () {
  it('should keep URL the same', function () {
    assert.strictEqual(
      getMime('myfile.txt'),
      'text/plain',
      'lookup should return text/plain',
    )
  })
})
