import fs from 'fs'
import os from 'os'
import path from 'path'

import { generateSprite } from '../../src/lib/index'
import { checkIconCountInSpriteJson, checkRatioInSpriteJson } from '../util'

describe('test lib/index.ts', (): void => {
  let tmpDir = ''
  let iconsDir = path.join(__dirname, '../icons')
  let icons2Dir = path.join(__dirname, '../icons2')

  beforeAll(function () {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spriteone-'))
  })

  afterAll(function () {
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true })
    }
  })

  test('sprite (json and png) must exist after generating', async () => {
    const output_file_name = path.join(tmpDir, './test1')
    const pixelRatios = [1]
    await generateSprite(output_file_name, [iconsDir], pixelRatios)
    expect(fs.existsSync(`${output_file_name}.json`)).toBeTruthy()
    expect(fs.existsSync(`${output_file_name}.png`)).toBeTruthy()

    await checkRatioInSpriteJson(`${output_file_name}.json`, pixelRatios[0])
    await checkIconCountInSpriteJson(`${output_file_name}.json`, 1)
  })

  test('sprite must exist with pixelRatio = 2', async () => {
    const output_file_name = path.join(tmpDir, './test2')
    const pixelRatios = [2]
    await generateSprite(output_file_name, [iconsDir], pixelRatios)
    expect(fs.existsSync(`${output_file_name}.json`)).toBeTruthy()
    expect(fs.existsSync(`${output_file_name}.png`)).toBeTruthy()

    await checkRatioInSpriteJson(`${output_file_name}.json`, pixelRatios[0])
    await checkIconCountInSpriteJson(`${output_file_name}.json`, 1)
  })

  test('multiple sprites with different ratio should be generated', async () => {
    const output_file_name = path.join(tmpDir, './test3')
    const pixelRatios = [1, 2]
    await generateSprite(output_file_name, [iconsDir], pixelRatios)
    expect(fs.existsSync(`${output_file_name}.json`)).toBeTruthy()
    expect(fs.existsSync(`${output_file_name}.png`)).toBeTruthy()
    expect(fs.existsSync(`${output_file_name}@2x.json`)).toBeTruthy()
    expect(fs.existsSync(`${output_file_name}@2x.png`)).toBeTruthy()

    for (let i = 0; i < pixelRatios.length; i++) {
      const ratio = pixelRatios[i]
      const jsonName = `${output_file_name}${
        ratio > 1 ? `@${ratio}x` : ''
      }.json`
      await checkRatioInSpriteJson(jsonName, ratio)
      await checkIconCountInSpriteJson(jsonName, 1)
    }
  })

  test('sprite must be generated from multiple icon directories', async () => {
    const output_file_name = path.join(tmpDir, './test4')
    const pixelRatios = [1]
    await generateSprite(output_file_name, [iconsDir, icons2Dir], pixelRatios)
    expect(fs.existsSync(`${output_file_name}.json`)).toBeTruthy()
    expect(fs.existsSync(`${output_file_name}.png`)).toBeTruthy()

    await checkRatioInSpriteJson(`${output_file_name}.json`, pixelRatios[0])
    await checkIconCountInSpriteJson(`${output_file_name}.json`, 3)
  })
})
