import { describe, expect, it } from 'vitest'
import Button from '@/components/button'

describe('button', () => {
  it('whether button exist', () => {
    if (Button) {
      const element = new Button()
      expect(element).not.toBeNull()
    }
  })
})
