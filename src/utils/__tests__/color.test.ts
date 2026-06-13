import { describe, it, expect } from 'vitest'
import { hexToRgba, adjustBrightness } from '../color'

describe('hexToRgba', () => {
  it('6位 hex 转 rgba', () => {
    expect(hexToRgba('#ff0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)')
    expect(hexToRgba('#00ff00', 1)).toBe('rgba(0, 255, 0, 1)')
    expect(hexToRgba('#0000ff', 0)).toBe('rgba(0, 0, 255, 0)')
  })

  it('3位 hex 转 rgba', () => {
    expect(hexToRgba('#f00', 0.5)).toBe('rgba(255, 0, 0, 0.5)')
    expect(hexToRgba('#0f0', 1)).toBe('rgba(0, 255, 0, 1)')
    expect(hexToRgba('#00f', 0)).toBe('rgba(0, 0, 255, 0)')
  })

  it('去掉 # 也能工作', () => {
    expect(hexToRgba('ff0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)')
  })

  it('alpha 边界值', () => {
    expect(hexToRgba('#ffffff', 0)).toBe('rgba(255, 255, 255, 0)')
    expect(hexToRgba('#ffffff', 1)).toBe('rgba(255, 255, 255, 1)')
  })

  it('朝代色', () => {
    expect(hexToRgba('#8B3535', 0.4)).toBe('rgba(139, 53, 53, 0.4)')
    expect(hexToRgba('#B8943A', 0.4)).toBe('rgba(184, 148, 58, 0.4)')
  })
})

describe('adjustBrightness', () => {
  it('正值变亮', () => {
    const result = adjustBrightness('#800000', 50)
    // 128 + 50*2.55 = 128 + 127.5 = 255.5 → cap at 255
    // G/B: 0 + 127.5 → 但 JS 浮点 2.55 近似导致 127.499... → round 127
    expect(result).toBe('rgb(255, 127, 127)')
  })

  it('负值变暗', () => {
    const result = adjustBrightness('#ffffff', -50)
    // 255 - 127.5 = 127.5 → 128
    expect(result).toBe('rgb(128, 128, 128)')
  })

  it('边界 cap 在 0 和 255', () => {
    expect(adjustBrightness('#ffffff', 200)).toBe('rgb(255, 255, 255)')
    expect(adjustBrightness('#000000', -200)).toBe('rgb(0, 0, 0)')
  })

  it('零变化', () => {
    expect(adjustBrightness('#808080', 0)).toBe('rgb(128, 128, 128)')
  })
})
