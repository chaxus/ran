import fs, { promises as fsPromises } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import del from 'del'
import imageminJpegtran from 'imagemin-jpegtran'
import imageminWebp from 'imagemin-webp'
import imageminSvgo from 'imagemin-svgo'
import isJpg from 'is-jpg'
import tempy from 'tempy'
import test from 'ava'
import imagemin from './index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('imagemin', () => {
    it('optimize a file', async () => {
    const buffer = await fsPromises.readFile(
      path.join(__dirname, 'fixture.jpg'),
    )
    const files = await imagemin(['fixture.jpg'], {
      plugins: [imageminJpegtran()],
    })

    expect(files[0].destinationPath).toEqual(undefined)
    expect(files[0].data.length < buffer.length).toBeTruthy()
    expect(isJpg(files[0].data)).toBeTruthy()
  })

  it('optimize a buffer', async () => {
    const buffer = await fsPromises.readFile(
      path.join(__dirname, 'fixture.jpg'),
    )
    const data = await imagemin.buffer(buffer, {
      plugins: [imageminJpegtran()],
    })

    expect(data.length < buffer.length).toBeTruthy()
    expect(isJpg(data)).toBeTruthy()
  })

  it('output error on corrupt images', async () => {
    await expect(imagemin(['fixture-corrupt.jpg'], {
        plugins: [imageminJpegtran()],
      })).rejects.toThrow(/Corrupt JPEG data/)
  })

  it('throw on wrong input', async () => {
    expect.assertions(2)
    await expect(imagemin('foo')).rejects.toThrow(/Expected an `Array`, got `string`/)
    await expect(imagemin.buffer('foo')).rejects.toThrow(/Expected a `Buffer`, got `string`/)
  })

  it('return original file if no plugins are defined', async () => {
    const buffer = await fsPromises.readFile(
      path.join(__dirname, 'fixture.jpg'),
    )
    const files = await imagemin(['fixture.jpg'])

    t.is(files[0].destinationPath, undefined)
    t.deepEqual(files[0].data, buffer)
    t.true(isJpg(files[0].data))
  })

  test('return original buffer if no plugins are defined', async (t) => {
    const buffer = await fsPromises.readFile(
      path.join(__dirname, 'fixture.jpg'),
    )
    const data = await imagemin.buffer(buffer)

    t.deepEqual(data, buffer)
    t.true(isJpg(data))
  })

  // TODO: Fix the test.
  test.failing(
    'return processed buffer even it is a bad optimization',
    async (t) => {
      const buffer = await fsPromises.readFile(
        path.join(__dirname, 'fixture.svg'),
      )
      t.false(buffer.includes('http://www.w3.org/2000/svg'))

      const data = await imagemin.buffer(buffer, {
        plugins: [
          imageminSvgo({
            plugins: [
              {
                addAttributesToSVGElement: {
                  attributes: [
                    {
                      xmlns: 'http://www.w3.org/2000/svg',
                    },
                  ],
                },
              },
            ],
          }),
        ],
      })

      t.true(data.includes('xmlns="http://www.w3.org/2000/svg"'))
      t.true(data.length > buffer.length)
    },
  )

  test('output at the specified location', async (t) => {
    const temporary = tempy.directory()
    const destinationTemporary = tempy.directory()
    const buffer = await fsPromises.readFile(
      path.join(__dirname, 'fixture.jpg'),
    )

    await fsPromises.mkdir(temporary, { recursive: true })
    await fsPromises.writeFile(path.join(temporary, 'fixture.jpg'), buffer)

    const files = await imagemin(['fixture.jpg', `${temporary}/*.jpg`], {
      destination: destinationTemporary,
      plugins: [imageminJpegtran()],
    })

    t.true(fs.existsSync(files[0].destinationPath))
    t.true(fs.existsSync(files[1].destinationPath))

    await del([temporary, destinationTemporary], { force: true })
  })

  test('output at the specified location when input paths contain Windows path delimiter', async (t) => {
    const temporary = tempy.directory()
    const destinationTemporary = tempy.directory()
    const buffer = await fsPromises.readFile(
      path.join(__dirname, 'fixture.jpg'),
    )

    await fsPromises.mkdir(temporary, { recursive: true })
    await fsPromises.writeFile(path.join(temporary, 'fixture.jpg'), buffer)

    const fileNameWithWindowsPathDelimiter = `${temporary}\\*.jpg`

    const files = await imagemin([fileNameWithWindowsPathDelimiter], {
      destination: destinationTemporary,
      plugins: [imageminJpegtran()],
    })

    t.true(fs.existsSync(files[0].destinationPath))

    await del([temporary, destinationTemporary], { force: true })
  })

  test('set webp ext', async (t) => {
    const temporary = tempy.file()
    const files = await imagemin(['fixture.jpg'], {
      destination: temporary,
      plugins: [imageminWebp()],
    })

    t.is(path.extname(files[0].destinationPath), '.webp')
    await del(temporary, { force: true })
  })

  test('set svg ext', async (t) => {
    const temporary = tempy.file()
    const files = await imagemin(['fixture.svg'], {
      destination: temporary,
      plugins: [imageminSvgo()],
    })

    t.is(path.extname(files[0].destinationPath), '.svg')
    await del(temporary, { force: true })
  })

  test('ignores junk files', async (t) => {
    const temporary = tempy.directory()
    const destinationTemporary = tempy.directory()
    const buffer = await fsPromises.readFile(
      path.join(__dirname, 'fixture.jpg'),
    )

    await fsPromises.mkdir(temporary, { recursive: true })
    await fsPromises.writeFile(path.join(temporary, '.DS_Store'), '')
    await fsPromises.writeFile(path.join(temporary, 'Thumbs.db'), '')
    await fsPromises.writeFile(path.join(temporary, 'fixture.jpg'), buffer)

    await t.notThrowsAsync(
      imagemin([`${temporary}/*`], {
        destination: destinationTemporary,
        plugins: [imageminJpegtran()],
      }),
    )

    t.true(fs.existsSync(path.join(destinationTemporary, 'fixture.jpg')))
    t.false(fs.existsSync(path.join(destinationTemporary, '.DS_Store')))
    t.false(fs.existsSync(path.join(destinationTemporary, 'Thumbs.db')))

    await del([temporary, destinationTemporary], { force: true })
  })

  test('glob option', async (t) => {
    const files = await imagemin(['fixture.jpg'], {
      glob: false,
      plugins: [imageminJpegtran()],
    })

    t.true(isJpg(files[0].data))
  })
})
