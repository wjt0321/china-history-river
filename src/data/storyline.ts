export interface StoryStep {
  dynastyId: string
  title: string
  narration: string
  durationMs: number
}

/**
 * 自动巡游叙事步骤
 *
 * 用 14 个朝代串起一条可自动播放的历史叙事线。
 */
export const STORY_STEPS: StoryStep[] = [
  {
    dynastyId: 'xia',
    title: '文明起源',
    narration: '从夏开始，早期邦国结构与王权观念逐渐成形，历史长河的第一段脉络缓缓展开。',
    durationMs: 3800,
  },
  {
    dynastyId: 'shang',
    title: '青铜礼制',
    narration: '商代以青铜礼器、甲骨文与宗教祭祀为核心，推动了早期国家形态的成熟。',
    durationMs: 3800,
  },
  {
    dynastyId: 'zhou',
    title: '分封秩序',
    narration: '周代建立分封与宗法秩序，礼乐制度深刻塑造了中国古代政治文化。',
    durationMs: 3800,
  },
  {
    dynastyId: 'qin',
    title: '大一统奠基',
    narration: '秦以郡县制、统一文字与度量衡完成第一次全国性整合，为后世王朝定下模板。',
    durationMs: 3800,
  },
  {
    dynastyId: 'han',
    title: '帝国扩展',
    narration: '汉代强化中央集权，并通过丝绸之路把中原文明推向更广阔的欧亚世界。',
    durationMs: 3800,
  },
  {
    dynastyId: 'sanguo',
    title: '分裂对峙',
    narration: '三国时期在军事与政治分裂中孕育新秩序，也让英雄叙事深植后世记忆。',
    durationMs: 3800,
  },
  {
    dynastyId: 'jin-nanbeichao',
    title: '迁徙融合',
    narration: '两晋南北朝是剧烈迁徙与族群融合的时代，南北互动重塑了国家与文化版图。',
    durationMs: 3800,
  },
  {
    dynastyId: 'sui',
    title: '再度统一',
    narration: '隋朝短暂而关键，完成统一并修筑大运河，为唐代盛世铺平道路。',
    durationMs: 3800,
  },
  {
    dynastyId: 'tang',
    title: '开放盛世',
    narration: '唐代以开放包容的帝国气象闻名，长安成为东亚世界最具影响力的都城之一。',
    durationMs: 3800,
  },
  {
    dynastyId: 'wudai',
    title: '过渡与重组',
    narration: '五代十国在割据与重组中承接唐末遗产，新的区域格局与政治秩序逐渐成形。',
    durationMs: 3800,
  },
  {
    dynastyId: 'song',
    title: '文治与商业',
    narration: '宋代重文轻武，城市经济、科技发明与商业网络一起抬高了文明的精细度。',
    durationMs: 3800,
  },
  {
    dynastyId: 'yuan',
    title: '欧亚贯通',
    narration: '元代连接更广阔的欧亚空间，行省制度与跨区域交流共同塑造帝国治理新形态。',
    durationMs: 3800,
  },
  {
    dynastyId: 'ming',
    title: '制度重建',
    narration: '明代在中央集权、海洋探索与城市文化之间寻找新平衡，延续并重构帝国秩序。',
    durationMs: 3800,
  },
  {
    dynastyId: 'qing',
    title: '近世转折',
    narration: '清代疆域达到高位，但也面对近代世界体系的冲击，历史进入新的转折阶段。',
    durationMs: 4200,
  },
]
