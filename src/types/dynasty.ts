/**
 * 朝代扩展类型 — 12 维度内容
 */

export interface Emperor {
  name: string
  reign: string
  years: number
  role: string
  achievements: string[]
  faults?: string[]
}

export interface HistoricalEvent {
  year: number
  title: string
  desc: string
  source?: string
}

export interface Economy {
  territory: number
  population?: number
  farmland?: string
  currency?: string
  roads?: string
  /** 其他关键数据点 */
  others?: { label: string; value: string }[]
}

export interface Battle {
  year: number
  name: string
  desc: string
  keyFigures: string[]
}

export interface Culture {
  literature?: string[]
  art?: string[]
  technology?: string[]
  engineering?: string[]
  philosophy?: string[]
  institutions?: string[]
}

export interface ForeignRelation {
  direction: '北' | '西' | '南' | '东'
  target: string
  desc?: string
  events: string[]
}

export interface TerritoryStage {
  year: number
  range: string
  event: string
}

export interface HistoricalEvaluation {
  author: string
  quote: string
  source: string
}

export interface RelatedPerson {
  name: string
  role: string
  events: string
  source?: string
}

export interface Dynasty {
  id: string
  name: string
  pinyin: string
  startYear: number
  endYear: number
  capital: string
  founder: string
  lastRuler: string
  peakPopulation?: number
  peakArea?: number
  peakYear?: number
  /** 一句话定位 */
  oneLineTag: string
  /** 简介（150-250 字） */
  summary: string
  /** 因何而兴（3-5 条） */
  riseReasons: { reason: string; desc: string; source?: string }[]
  /** 因何而亡（3-5 条） */
  fallReasons: { reason: string; desc: string; source?: string }[]
  /** 帝王长廊 */
  emperors: Emperor[]
  /** 大事年表（8-10 个） */
  events: HistoricalEvent[]
  /** 经济数据 */
  economy: Economy
  /** 军事事件（5-8 个） */
  battles: Battle[]
  /** 文化遗产 */
  culture: Culture
  /** 对外关系 */
  foreignRelations: ForeignRelation[]
  /** 疆域变化 */
  territoryEvolution: TerritoryStage[]
  /** 史家评价（1-2 段） */
  evaluations: HistoricalEvaluation[]
  /** 相关人物 */
  relatedPersons?: RelatedPerson[]
  /** 朝代专属色 */
  color?: string
  /** 朝代疆域 GeoJSON 文件名 */
  geoFile: string
  /** 主题色 */
  figureIds?: string[]
  sceneIds?: string[]
}
