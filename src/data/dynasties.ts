/**
 * 14 朝代统一导出
 */
import type { Dynasty } from '@/types/dynasty'
import { DYNASTIES_PART1 } from './dynasties-part1'
import { DYNASTIES_PART2 } from './dynasties-part2'
import { DYNASTIES_PART3 } from './dynasties-part3'
import { DYNASTIES_PART4 } from './dynasties-part4'
import { ming } from './dynasties-ming'
import { qing } from './dynasties-qing'

export const DYNASTIES: Dynasty[] = [
  ...DYNASTIES_PART1,
  ...DYNASTIES_PART2,
  ...DYNASTIES_PART3,
  ...DYNASTIES_PART4,
  ming,
  qing,
]

export const DYNASTIES_BY_TIME = [...DYNASTIES].sort((a, b) => a.startYear - b.startYear)
