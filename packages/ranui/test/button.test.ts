/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import Button from '../components/button/index.ts'

describe('button', () => {
    it('whether button exist', () => {
        const element = new Button()
        expect(element).not.toBeNull()
    })
})