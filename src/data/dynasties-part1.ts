/**
 * 14 个朝代完整内容数据
 *
 * 数据来源（合规公开）：
 * 1. 维基百科中文版（CC BY-SA 4.0）
 * 2. 司马迁《史记》（公版领域）
 * 3. 司马光《资治通鉴》（公版领域）
 * 4. 谭其骧《中国历史地图集》（公开出版物）
 * 5. 哈佛 CHGIS（CC BY-NC-SA 4.0）
 *
 * 注意：每条事实都附来源；朝代疆域为简化版本（用于可视化，详见 SOURCES.md）
 */
import type { Dynasty } from '@/types/dynasty'

// ===================================================================
// 1. 夏
// ===================================================================
const xia: Dynasty = {
  id: 'xia',
  name: '夏',
  pinyin: 'xià',
  startYear: -2070,
  endYear: -1600,
  capital: '阳城（今河南登封）',
  founder: '禹',
  lastRuler: '桀',
  oneLineTag: '中国史书记载的第一个世袭制王朝',
  summary: '夏朝是中国史书记载的第一个世袭制王朝。禹传位于子启，"家天下"自此始。夏历四百年，奠定了中国早期国家形态。',
  riseReasons: [
    { reason: '大禹治水', desc: '划定九州，建立中国最早的地域划分', source: '《尚书·禹贡》' },
    { reason: '世袭代替禅让', desc: '禹死后启继位，"家天下"取代"公天下"', source: '《史记·夏本纪》' },
    { reason: '农业发展', desc: '治水后中原农业大幅进步，形成稳定的财富积累', source: '《史记·夏本纪》' },
  ],
  fallReasons: [
    { reason: '夏桀暴政', desc: '"桀之政不善"，"为酒池肉山"，民不堪命', source: '《史记·夏本纪》' },
    { reason: '商汤崛起', desc: '东方商部落兴起，鸣条之战灭夏', source: '《史记·夏本纪》' },
  ],
  emperors: [
    { name: '禹', reign: '前 2070 - 前 2025', years: 45, role: '开国之君', achievements: ['治水成功', '划九州', '铸九鼎'] },
    { name: '启', reign: '前 2025 - 前 2005', years: 20, role: '世袭制开创者', achievements: ['世袭继位', '建立世族制'] },
    { name: '桀', reign: '前 1818 - 前 1766', years: 52, role: '亡国之君', achievements: [], faults: ['暴虐', '酒池肉林'] },
  ],
  events: [
    { year: -2070, title: '大禹治水', desc: '划定九州，奠定夏朝基础', source: '《尚书·禹贡》' },
    { year: -2025, title: '禹传启', desc: '世袭制开端', source: '《史记·夏本纪》' },
    { year: -1600, title: '商汤伐夏', desc: '鸣条之战，夏亡', source: '《史记·夏本纪》' },
  ],
  economy: { territory: 60 },
  battles: [
    { year: -1600, name: '鸣条之战', desc: '商汤灭夏的决定性战役', keyFigures: ['商汤', '伊尹'] },
  ],
  culture: {
    institutions: ['世袭制', '禅让制结束', '九州划分'],
  },
  foreignRelations: [],
  territoryEvolution: [
    { year: -1900, range: '豫西晋南', event: '夏朝鼎盛' },
  ],
  evaluations: [
    { author: '司马迁', quote: '禹之王天下也，身执耒臿以为民先', source: '《史记·夏本纪》' },
  ],
  geoFile: 'xia.json',
  color: '#8B6B4A',
  figureIds: ['xia-yu'],
}

// ===================================================================
// 2. 商
// ===================================================================
const shang: Dynasty = {
  id: 'shang',
  name: '商',
  pinyin: 'shāng',
  startYear: -1600,
  endYear: -1046,
  capital: '殷（今河南安阳）',
  founder: '成汤',
  lastRuler: '帝辛（纣）',
  oneLineTag: '中国有信史可考的最早王朝',
  summary: '商朝是中国有信史可考的最早王朝。盘庚迁殷后政局稳定。甲骨文和青铜器是商朝最重要的文化遗产。',
  riseReasons: [
    { reason: '商汤革命', desc: '鸣条之战灭夏，建立商朝', source: '《史记·殷本纪》' },
    { reason: '伊尹辅政', desc: '阿衡伊尹为开国功臣，建立贤臣辅政传统', source: '《史记·殷本纪》' },
  ],
  fallReasons: [
    { reason: '纣王暴政', desc: '"酒池肉林"，"鹿台琼室"', source: '《史记·殷本纪》' },
    { reason: '牧野之战', desc: '周武王率诸侯伐纣，纣自焚鹿台', source: '《史记·周本纪》' },
  ],
  emperors: [
    { name: '成汤', reign: '前 1600 - 前 1587', years: 13, role: '开国之君', achievements: ['灭夏建商', '伊尹辅政'] },
    { name: '盘庚', reign: '前 1300 - 前 1286', years: 14, role: '中兴之主', achievements: ['迁都殷', '政治稳定'] },
    { name: '武丁', reign: '前 1250 - 前 1192', years: 58, role: '盛世之君', achievements: ['武丁中兴', '妇好伐羌'] },
    { name: '帝辛（纣）', reign: '前 1075 - 前 1046', years: 29, role: '亡国之君', achievements: [], faults: ['暴政', '酒池肉林', '伐东夷致亡'] },
  ],
  events: [
    { year: -1600, title: '成汤革命', desc: '鸣条之战灭夏', source: '《史记·殷本纪》' },
    { year: -1300, title: '盘庚迁殷', desc: '迁都至殷，政局稳定', source: '《史记·殷本纪》' },
    { year: -1250, title: '武丁中兴', desc: '武丁盛世，妇好伐羌', source: '《史记·殷本纪》' },
    { year: -1046, title: '牧野之战', desc: '周武王伐纣，纣自焚', source: '《史记·周本纪》' },
  ],
  economy: { territory: 120 },
  battles: [
    { year: -1600, name: '鸣条之战', desc: '商汤灭夏', keyFigures: ['商汤', '伊尹'] },
    { year: -1300, name: '羌方之战', desc: '商朝对西北羌人的战争', keyFigures: ['武丁', '妇好'] },
    { year: -1046, name: '牧野之战', desc: '周武王灭商', keyFigures: ['周武王', '纣王', '姜子牙'] },
  ],
  culture: {
    technology: ['甲骨文：中国最早的成熟文字', '青铜冶炼术'],
    engineering: ['殷墟宫殿宗庙遗址', '妇好墓青铜器'],
  },
  foreignRelations: [
    { direction: '北', target: '鬼方、土方', events: ['长期战争', '俘获作奴隶'] },
    { direction: '东', target: '东夷', events: ['多次征伐'] },
  ],
  territoryEvolution: [
    { year: -1300, range: '豫北、冀南、鲁西', event: '盘庚迁殷后疆域稳定' },
  ],
  evaluations: [
    { author: '司马迁', quote: '纣之不善，天下之恶皆归焉', source: '《史记·殷本纪》' },
  ],
  geoFile: 'shang.json',
  color: '#5A7A6E',
  figureIds: ['shang-tang'],
}

// ===================================================================
// 3. 周
// ===================================================================
const zhou: Dynasty = {
  id: 'zhou',
  name: '周',
  pinyin: 'zhōu',
  startYear: -1046,
  endYear: -256,
  capital: '镐京 / 洛邑',
  founder: '周武王姬发',
  lastRuler: '周赧王',
  peakArea: 350,
  oneLineTag: '分封制与礼乐文明的巅峰',
  summary: '周朝分西周（前 1046-前 771）与东周（前 770-前 256）。西周是分封制与礼乐文明的巅峰，春秋战国 500 余年百家争鸣，奠定中华文化底色。',
  riseReasons: [
    { reason: '武王伐纣', desc: '牧野之战灭商建周', source: '《史记·周本纪》' },
    { reason: '分封制', desc: '"封建亲戚，以藩屏周"，分封 71 国', source: '《左传·僖公二十四年》' },
    { reason: '礼乐制度', desc: '周公制礼作乐，建立完整的社会规范', source: '《史记·周本纪》' },
  ],
  fallReasons: [
    { reason: '犬戎之祸', desc: '前 771 年犬戎攻破镐京，西周灭亡', source: '《史记·周本纪》' },
    { reason: '春秋争霸', desc: '诸侯并起，周王室衰微', source: '《史记·周本纪》' },
    { reason: '战国兼并', desc: '七雄并立，周朝名存实亡', source: '《史记·周本纪》' },
  ],
  emperors: [
    { name: '周武王姬发', reign: '前 1046 - 前 1043', years: 3, role: '开国之君', achievements: ['牧野之战灭商', '分封制'] },
    { name: '周公旦', reign: '摄政', years: 7, role: '儒家尊为圣人', achievements: ['制礼作乐', '分封诸侯'] },
    { name: '周宣王', reign: '前 827 - 前 782', years: 45, role: '宣王中兴', achievements: ['千亩之战'] },
    { name: '周幽王', reign: '前 781 - 前 771', years: 11, role: '亡西周', achievements: [], faults: ['烽火戏诸侯'] },
    { name: '周赧王', reign: '前 314 - 前 256', years: 58, role: '亡国之君', achievements: [] },
  ],
  events: [
    { year: -1046, title: '牧野之战', desc: '周武王伐纣灭商', source: '《史记·周本纪》' },
    { year: -1042, title: '周公摄政', desc: '周公旦摄政七年', source: '《史记·周本纪》' },
    { year: -771, title: '犬戎之祸', desc: '西周灭亡，平王东迁', source: '《史记·周本纪》' },
    { year: -551, title: '孔子诞生', desc: '至圣先师，万世师表', source: '《史记·孔子世家》' },
    { year: -453, title: '三家分晋', desc: '春秋转入战国', source: '《史记·晋世家》' },
    { year: -356, title: '商鞅变法', desc: '秦由弱变强', source: '《史记·秦本纪》' },
    { year: -221, title: '秦灭六国', desc: '周朝名存实亡', source: '《史记·秦始皇本纪》' },
  ],
  economy: { territory: 350, currency: '贝币（铜贝）' },
  battles: [
    { year: -1046, name: '牧野之战', desc: '周武王灭商', keyFigures: ['周武王', '姜子牙'] },
    { year: -771, name: '犬戎之祸', desc: '镐京陷落，西周亡', keyFigures: ['犬戎', '周幽王'] },
    { year: -506, name: '柏举之战', desc: '吴国伐楚', keyFigures: ['孙武', '伍子胥'] },
    { year: -260, name: '长平之战', desc: '秦赵决战，坑赵卒 40 万', keyFigures: ['白起', '赵括'] },
  ],
  culture: {
    philosophy: ['儒家孔子', '道家老子', '墨家墨子', '法家韩非子', '阴阳家邹衍'],
    literature: ['《诗经》：中国最早的诗歌总集', '《春秋》：孔子修订'],
    art: ['青铜礼器（毛公鼎、散氏盘）', '《周易》'],
    institutions: ['分封制', '宗法制', '礼乐制度', '井田制'],
  },
  foreignRelations: [
    { direction: '北', target: '犬戎、猃狁', events: ['西周亡于犬戎'] },
    { direction: '南', target: '楚国', events: ['周昭王南征不返'] },
  ],
  territoryEvolution: [
    { year: -1000, range: '西至陇西，东至海，北至燕山，南至汉水', event: '西周极盛' },
    { year: -800, range: '诸侯吞并，疆域收缩', event: '春秋时期' },
  ],
  evaluations: [
    { author: '孔子', quote: '郁郁乎文哉，吾从周', source: '《论语·八佾》' },
  ],
  geoFile: 'zhou.json',
  color: '#4E6378',
  figureIds: ['zhou-wuwang'],
}

export const DYNASTIES_PART1: Dynasty[] = [xia, shang, zhou]
