import { describe, expect, it } from 'vitest'
import merge from '@/utils/mergeObj'

describe('merge', function () {
  describe('an object', function () {
    const a = { foo: 'bar' },
      b = { bar: 'baz' }
    const o = merge(a, b)

    it('should merge properties into first object', function () {
      expect(Object.keys(a)).to.have.length(2)
      expect(a.foo).to.be.equal('bar')
      expect(b.bar).to.be.equal('baz')
    })

    it('should return first argument', function () {
      expect(o).to.be.equal(a)
    })
  })

  describe('an object with duplicate key', function () {
    const a = { foo: 'bar', qux: 'co' },
      b = { foo: 'baz' }
    const o = merge(a, b)

    it('should merge properties into first object', function () {
      expect(Object.keys(a)).to.have.length(2)
      expect(a.foo).to.be.equal('baz')
      expect(a.qux).to.be.equal('co')
    })

    it('should return first argument', function () {
      expect(o).to.be.equal(a)
    })
  })

  describe('without a source object', function () {
    const a = { foo: 'bar' }
    const o = merge(a)

    it('should leave first object unmodified', function () {
      expect(Object.keys(a)).to.have.length(1)
      expect(a.foo).to.be.equal('bar')
    })

    it('should return first argument', function () {
      expect(o).to.be.equal(a)
    })
  })
})
