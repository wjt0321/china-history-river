import { describe, it, expect } from 'vitest'
import { DYNASTIES } from '../dynasties'

const HEX_RE = /^#[0-9a-fA-F]{6}$/

describe('朝代数据完整性', () => {
  it('应有 14 个朝代', () => {
    expect(DYNASTIES).toHaveLength(14)
  })

  it('每个朝代必须有 id', () => {
    for (const d of DYNASTIES) {
      expect(d.id, `${d.name} 缺少 id`).toBeTruthy()
      expect(typeof d.id).toBe('string')
    }
  })

  it('每个朝代必须有 name', () => {
    for (const d of DYNASTIES) {
      expect(d.name, `${d.id} 缺少 name`).toBeTruthy()
      expect(typeof d.name).toBe('string')
    }
  })

  it('每个朝代必须有 startYear 和 endYear', () => {
    for (const d of DYNASTIES) {
      expect(typeof d.startYear, `${d.id} startYear 类型错误`).toBe('number')
      expect(typeof d.endYear, `${d.id} endYear 类型错误`).toBe('number')
    }
  })

  it('startYear < endYear', () => {
    for (const d of DYNASTIES) {
      expect(
        d.startYear,
        `${d.id}: startYear (${d.startYear}) 应小于 endYear (${d.endYear})`,
      ).toBeLessThan(d.endYear)
    }
  })

  it('每个朝代必须有 geoFile', () => {
    for (const d of DYNASTIES) {
      expect(d.geoFile, `${d.name} 缺少 geoFile`).toBeTruthy()
      expect(typeof d.geoFile).toBe('string')
    }
  })

  it('color 必须是合法 hex（如提供）', () => {
    for (const d of DYNASTIES) {
      if (d.color) {
        expect(
          d.color,
          `${d.name} color "${d.color}" 不是合法 6 位 hex`,
        ).toMatch(HEX_RE)
      }
    }
  })

  it('id 必须唯一', () => {
    const ids = DYNASTIES.map((d) => d.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('events 中有坐标的事件必须有 coords[0] 和 coords[1]', () => {
    for (const d of DYNASTIES) {
      for (const ev of d.events) {
        if (ev.coords) {
          expect(
            ev.coords,
            `${d.id} 事件 "${ev.title}" coords 应为 [number, number]`,
          ).toHaveLength(2)
          expect(typeof ev.coords[0]).toBe('number')
          expect(typeof ev.coords[1]).toBe('number')
        }
      }
    }
  })

  it('必须有至少一条 riseReasons', () => {
    for (const d of DYNASTIES) {
      expect(d.riseReasons.length, `${d.name} 缺少 riseReasons`).toBeGreaterThan(0)
    }
  })

  it('必须有至少一条 fallReasons', () => {
    for (const d of DYNASTIES) {
      expect(d.fallReasons.length, `${d.name} 缺少 fallReasons`).toBeGreaterThan(0)
    }
  })

  it('summary 应该非空且有一定长度', () => {
    for (const d of DYNASTIES) {
      expect(d.summary, `${d.name} summary 为空`).toBeTruthy()
      expect(d.summary.length, `${d.name} summary 过短`).toBeGreaterThan(10)
    }
  })

  it('朝代时间线无重叠幻觉（按时间排列后相邻朝代时间参考合理）', () => {
    // 只是合理性检查，不要求严格衔接（历史有断层和重叠）
    const sorted = [...DYNASTIES].sort((a, b) => a.startYear - b.startYear)
    for (let i = 0; i < sorted.length - 1; i++) {
      // 每个朝代的 endYear 不应早于下一个的 startYear 过多（超过 500 年间隔属异常）
      const gap = sorted[i + 1].startYear - sorted[i].endYear
      expect(
        gap,
        `${sorted[i].name}→${sorted[i + 1].name} 时间间隔 ${gap} 年异常`,
      ).toBeLessThan(500)
    }
  })
})
