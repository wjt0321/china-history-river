import { describe, it, expect } from 'vitest'
import { formatYear } from '../format'

describe('formatYear', () => {
  // —— short style ——————————————————————————————
  it('short: 公元年份只返回数字字符串', () => {
    expect(formatYear(221, 'short')).toBe('221')
    expect(formatYear(2025, 'short')).toBe('2025')
  })

  it('short: 公元前年份返回 BC 前缀', () => {
    expect(formatYear(-221, 'short')).toBe('BC 221')
    expect(formatYear(-2070, 'short')).toBe('BC 2070')
  })

  it('short: 公元元年（0年）返回 0', () => {
    expect(formatYear(0, 'short')).toBe('0')
  })

  // —— full style ——————————————————————————————
  it('full: 公元年份返回「公元 X 年」', () => {
    expect(formatYear(618, 'full')).toBe('公元 618 年')
    expect(formatYear(1368, 'full')).toBe('公元 1368 年')
  })

  it('full: 公元前年份返回「公元前 X 年」', () => {
    expect(formatYear(-221, 'full')).toBe('公元前 221 年')
    expect(formatYear(-1046, 'full')).toBe('公元前 1046 年')
  })

  it('full: 公元元年（0年）', () => {
    expect(formatYear(0, 'full')).toBe('公元 0 年')
  })
})
