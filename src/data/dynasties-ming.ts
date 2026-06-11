// 明朝数据 - 占位，下方继续追加
import type { Dynasty } from '@/types/dynasty'

export const ming: Dynasty = {
  id: 'ming',
  name: '明',
  pinyin: 'míng',
  startYear: 1368,
  endYear: 1644,
  capital: '南京 / 北京',
  founder: '明太祖朱元璋',
  lastRuler: '崇祯帝朱由检',
  peakArea: 997,
  peakYear: 1420,
  peakPopulation: 15000,
  oneLineTag: '汉族最后一个大一统王朝',
  summary: '明朝是汉族最后一个大一统王朝。郑和七下西洋，《永乐大典》集古典文献之大成。',
  riseReasons: [
    { reason: '元末农民战争', desc: '红巾军起义瓦解元朝', source: '《明史》' },
    { reason: '朱元璋崛起', desc: '"驱逐胡虏，恢复中华"号召', source: '《明太祖实录》' },
  ],
  fallReasons: [
    { reason: '阉党专权', desc: '魏忠贤与东林党之争', source: '《明史》' },
    { reason: '天灾人祸', desc: '小冰期导致粮食减产', source: '《明史》' },
    { reason: '李自成起义', desc: '1630 年代陕西大旱爆发农民起义', source: '《明史》' },
    { reason: '清军入关', desc: '1644 年吴三桂引清军入关', source: '《清史稿》' },
  ],
  emperors: [
    { name: '明太祖朱元璋', reign: '1368 - 1398', years: 30, role: '开国之君', achievements: ['恢复中华', '洪武之治', '废丞相设内阁'], faults: ['胡蓝之狱', '诛杀功臣'] },
    { name: '明成祖朱棣', reign: '1402 - 1424', years: 22, role: '永乐大帝', achievements: ['永乐盛世', '郑和下西洋', '《永乐大典》', '营建紫禁城', '五次亲征漠北'] },
    { name: '明思宗朱由检', reign: '1627 - 1644', years: 17, role: '亡国之君', achievements: ['铲除魏忠贤'], faults: ['性格多疑', '自毁长城'] },
  ],
  events: [
    { year: 1368, title: '朱元璋称帝', desc: '建明，年号洪武', source: '《明史》' },
    { year: 1405, title: '郑和下西洋', desc: '**人类大航海时代的前奏**', source: '《明史》' },
    { year: 1408, title: '《永乐大典》成书', desc: '11095 卷，**类书之最**', source: '《明史》' },
    { year: 1449, title: '土木之变', desc: '明英宗被俘', source: '《明史》' },
    { year: 1644, title: '崇祯自缢', desc: '李自成入京，明亡', source: '《明史》' },
  ],
  economy: { territory: 997, population: 15000, currency: '大明宝钞、银两' },
  battles: [
    { year: 1388, name: '捕鱼儿海之战', desc: '蓝玉击破北元', keyFigures: ['蓝玉'] },
    { year: 1449, name: '土木之变', desc: '明英宗被俘', keyFigures: ['瓦剌也先'] },
    { year: 1593, name: '万历朝鲜战争', desc: '明军援朝抗日', keyFigures: ['李如松', '丰臣秀吉'] },
  ],
  culture: {
    literature: ['《水浒传》', '《三国演义》', '《西游记》', '《金瓶梅》', '《永乐大典》'],
    art: ['明代家具', '景德镇青花瓷', '吴门四才子'],
    technology: ['《天工开物》', '李时珍《本草纲目》', '郑和宝船'],
    philosophy: ['王阳明心学', '李贽童心说'],
    institutions: ['内阁制', '锦衣卫', '东厂', '一条鞭法'],
  },
  foreignRelations: [
    { direction: '东', target: '日本', desc: '勘合贸易、倭寇', events: ['戚继光抗倭', '万历朝鲜战争'] },
    { direction: '南', target: '南洋', desc: '郑和下西洋', events: ['郑和七下西洋'] },
    { direction: '北', target: '蒙古', desc: '长期对峙', events: ['五次亲征', '隆庆和议'] },
  ],
  territoryEvolution: [
    { year: 1420, range: '极盛 997 万 km²', event: '含安南、奴儿干都司' },
  ],
  evaluations: [
    { author: '黄宗羲', quote: '明之亡，亡于天启、崇祯', source: '《明夷待访录》' },
  ],
  relatedPersons: [
    { name: '刘伯温', role: '谋士', events: '朱元璋首席谋臣' },
    { name: '郑和', role: '航海家', events: '七下西洋' },
    { name: '王守仁（阳明）', role: '哲学家', events: '心学集大成者' },
    { name: '张居正', role: '首辅', events: '一条鞭法' },
    { name: '魏忠贤', role: '宦官', events: '**明亡主谋之一**' },
  ],
  geoFile: 'ming.json',
  color: '#8B2A2A',
  figureIds: ['zhuyuanzhang'],
  sceneIds: ['scene-greatwall'],
}
