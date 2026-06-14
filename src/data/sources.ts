/**
 * 全站史料与数据来源清单
 *
 * 本作品所有朝代信息、疆域数据、人物/场景图片均来自下列公开、合规来源。
 * 此清单在详情面板"史料来源"区块展示，让读者明确数据出处。
 *
 * 注意：疆域图为基于上述资料的历史疆域**简化示意**，用于可视化动态变化，
 * 不代表精确边界或现代行政、主权范围。
 */
export interface SourceEntry {
  /** 来源名称 */
  name: string
  /** 类型：古籍 / 现代 / 地理 / 图片 */
  category: '古籍' | '现代' | '地理' | '图片'
  /** 授权或版本说明 */
  license: string
  /** 简述本作品如何使用该来源 */
  usage: string
}

export const DATA_SOURCES: SourceEntry[] = [
  {
    name: '《史记》司马迁',
    category: '古籍',
    license: '公版领域',
    usage: '先秦至汉初朝代兴亡、帝王事迹、重大事件的主要叙事来源',
  },
  {
    name: '《资治通鉴》司马光',
    category: '古籍',
    license: '公版领域',
    usage: '战国至五代编年史，用于核对事件年份与因果脉络',
  },
  {
    name: '维基百科中文版',
    category: '现代',
    license: 'CC BY-SA 4.0',
    usage: '人口、疆域、经济等量化数据与现代史学综述的交叉参考',
  },
  {
    name: '谭其骧《中国历史地图集》',
    category: '地理',
    license: '公开出版物引用',
    usage: '14 朝代疆域多边形简化的形态依据',
  },
  {
    name: '哈佛 CHGIS 中国历史地理信息系统',
    category: '地理',
    license: 'CC BY-NC-SA 4.0',
    usage: '历史政区与聚落坐标参考',
  },
  {
    name: 'Wikimedia Commons',
    category: '图片',
    license: 'Public Domain',
    usage: '全部人物像与场景图素材，详见 public/images/SOURCES.md',
  },
]

/** 疆域示意免责声明 */
export const TERRITORY_DISCLAIMER =
  '疆域图为基于谭其骧地图集与 CHGIS 的历史简化示意，用于展示动态变化趋势，不代表精确边界或现代行政、主权范围。'
