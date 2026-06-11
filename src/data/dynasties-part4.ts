/**
 * 朝代数据 Part 4：五代、宋、元
 */
import type { Dynasty } from '@/types/dynasty'

// ===================================================================
// 10. 五代十国
// ===================================================================
const wudai: Dynasty = {
  id: 'wudai',
  name: '五代十国',
  pinyin: 'wǔ dài shí guó',
  startYear: 907,
  endYear: 979,
  capital: '开封 / 临安等多地',
  founder: '朱温',
  lastRuler: '—',
  oneLineTag: '唐后的藩镇延续',
  summary: '唐朝之后的短暂分裂期。中原五朝（后梁、后唐、后晋、后汉、后周）更迭，南方十国并立。是藩镇割据的延续。',
  riseReasons: [
    { reason: '黄巢瓦解唐朝', desc: '黄巢起义后藩镇坐大', source: '《新五代史》' },
    { reason: '朱温代唐', desc: '907 年朱温代唐建后梁', source: '《新五代史》' },
  ],
  fallReasons: [
    { reason: '陈桥兵变', desc: '960 年赵匡胤建立北宋', source: '《宋史》' },
    { reason: '南方统一', desc: '宋先后灭南方诸国', source: '《宋史》' },
  ],
  emperors: [
    { name: '朱温（后梁太祖）', reign: '907 - 912', years: 5, role: '后梁开国', achievements: ['代唐建梁'] },
    { name: '李存勖（后唐庄宗）', reign: '923 - 926', years: 3, role: '后唐开国', achievements: ['灭后梁'] },
    { name: '石敬瑭（后晋高祖）', reign: '936 - 942', years: 6, role: '后晋开国', achievements: [], faults: ['割让燕云十六州'] },
    { name: '郭威（后周太祖）', reign: '951 - 954', years: 3, role: '后周开国', achievements: ['改革'] },
    { name: '柴荣（后周世宗）', reign: '954 - 959', years: 5, role: '五代第一明君', achievements: ['改革', '北伐', '禁佛'] },
  ],
  events: [
    { year: 907, title: '朱温代唐', desc: '后梁建立，五代开始', source: '《新五代史》' },
    { year: 936, title: '割让燕云十六州', desc: '石敬瑭认契丹为父', source: '《新五代史》' },
    { year: 960, title: '陈桥兵变', desc: '赵匡胤建立北宋', source: '《宋史》' },
  ],
  economy: { territory: 280 },
  battles: [
    { year: 936, name: '儿皇帝之耻', desc: '石敬瑭认契丹为父', keyFigures: ['石敬瑭', '耶律德光'] },
  ],
  culture: {
    art: ['董源、巨然（南方山水画）'],
  },
  foreignRelations: [
    { direction: '北', target: '契丹', desc: '石敬瑭割让燕云十六州', events: ['燕云十六州之耻'] },
  ],
  territoryEvolution: [
    { year: 950, range: '约 280 万 km²', event: '中原五朝 + 南方十国' },
  ],
  evaluations: [
    { author: '欧阳修', quote: '五代之际，兴亡之迹', source: '《新五代史》' },
  ],
  geoFile: 'wudai.json',
  color: '#6B5A7A',
}

// ===================================================================
// 11. 宋
// ===================================================================
const song: Dynasty = {
  id: 'song',
  name: '宋',
  pinyin: 'sòng',
  startYear: 960,
  endYear: 1279,
  capital: '东京汴梁 / 临安',
  founder: '宋太祖赵匡胤',
  lastRuler: '宋帝昺',
  peakArea: 280,
  peakPopulation: 10000,
  oneLineTag: '文治盛极而武备稍逊',
  summary: '宋朝分为北宋（960-1127）与南宋（1127-1279）。活字印刷、指南针、火药外传，重塑世界文明。北宋经济文化巅峰但军事积弱。',
  riseReasons: [
    { reason: '陈桥兵变', desc: '960 年赵匡胤黄袍加身', source: '《宋史》' },
    { reason: '南征北伐', desc: '先后灭南方诸国与北汉', source: '《宋史》' },
    { reason: '杯酒释兵权', desc: '赵匡胤解除武将兵权', source: '《宋史》' },
  ],
  fallReasons: [
    { reason: '靖康之难', desc: '1127 年金军攻陷汴京，徽钦二帝被俘', source: '《宋史》' },
    { reason: '崖山海战', desc: '1279 年宋亡于元，文天祥殉国', source: '《宋史》' },
    { reason: '重文轻武', desc: '"守内虚外"国策导致军事积弱', source: '《宋史》' },
  ],
  emperors: [
    { name: '宋太祖赵匡胤', reign: '960 - 976', years: 16, role: '开国之君', achievements: ['陈桥兵变', '统一全国', '杯酒释兵权'] },
    { name: '宋太宗赵光义', reign: '976 - 997', years: 21, role: '太祖之弟', achievements: ['收吴越、北汉'] },
    { name: '宋真宗赵恒', reign: '997 - 1022', years: 25, role: '咸平之治', achievements: ['澶渊之盟'] },
    { name: '宋仁宗赵祯', reign: '1022 - 1063', years: 41, role: '仁宗盛治', achievements: ['人才辈出'] },
    { name: '宋神宗赵顼', reign: '1067 - 1085', years: 18, role: '变法求强', achievements: ['王安石变法'] },
    { name: '宋徽宗赵佶', reign: '1100 - 1126', years: 26, role: '艺术天子', achievements: ['瘦金体', '《清明上河图》'], faults: ['靖康之难'] },
    { name: '宋高宗赵构', reign: '1127 - 1162', years: 35, role: '南宋开国', achievements: ['建立南宋'] },
    { name: '宋理宗赵昀', reign: '1224 - 1264', years: 40, role: '联蒙灭金', achievements: ['端平入洛'], faults: ['联蒙灭金'] },
    { name: '宋帝昺赵昺', reign: '1278 - 1279', years: 1, role: '亡国之君', achievements: [] },
  ],
  events: [
    { year: 960, title: '陈桥兵变', desc: '赵匡胤黄袍加身', source: '《宋史》' },
    { year: 976, title: '杯酒释兵权', desc: '解除武将兵权', source: '《宋史》' },
    { year: 1004, title: '澶渊之盟', desc: '宋辽和议，每年给岁币', source: '《宋史》' },
    { year: 1069, title: '王安石变法', desc: '试图扭转"三冗"困境', source: '《宋史》' },
    { year: 1088, title: '《梦溪笔谈》', desc: '沈括撰成', source: '《梦溪笔谈》' },
    { year: 1127, title: '靖康之难', desc: '金军攻陷汴京，**北宋灭亡**', source: '《宋史》' },
    { year: 1279, title: '崖山海战', desc: '南宋亡于元，文天祥殉国', source: '《宋史》' },
  ],
  economy: {
    territory: 280,
    population: 10000,
    currency: '交子（世界最早的纸币，1024 年）',
    others: [
      { label: '交子', value: '1024 年世界最早的纸币' },
      { label: '江南圩田', value: '大规模农业开发' },
      { label: 'GDP 占比', value: '约占当时世界 80%（估算）' },
    ],
  },
  battles: [
    { year: 1004, name: '澶渊之盟', desc: '宋辽百年和平', keyFigures: ['寇准', '萧太后'] },
    { year: 1127, name: '靖康之难', desc: '**北宋灭亡**', keyFigures: ['金军', '宋徽宗', '宋钦宗'] },
    { year: 1140, name: '郾城大捷', desc: '岳飞大破金军', keyFigures: ['岳飞'] },
    { year: 1279, name: '崖山海战', desc: '南宋亡于元', keyFigures: ['张弘范', '陆秀夫'] },
  ],
  culture: {
    literature: ['苏轼', '欧阳修', '李清照', '辛弃疾', '陆游', '《全宋词》', '《梦溪笔谈》（沈括）'],
    art: ['张择端《清明上河图》', '宋徽宗瘦金体', '王希孟《千里江山图》', '宋代瓷器（五大名窑）'],
    technology: ['活字印刷（毕昇）', '指南针航海', '火药军事化', '水力纺织机械', '水密隔舱'],
    philosophy: ['程朱理学（程颢、程颐、朱熹）', '陆九渊心学'],
    institutions: ['科举完善（弥封、誊录）', '枢密院', '三司（财政）', '厢军制'],
  },
  foreignRelations: [
    { direction: '北', target: '辽、金、蒙古', desc: '积弱', events: ['澶渊之盟', '靖康之难', '崖山海战'] },
    { direction: '西', target: '西夏', desc: '和战不定', events: ['庆历和议'] },
    { direction: '南', target: '大理', desc: '段氏政权', events: ['宋灭大理之战（1253）'] },
    { direction: '东', target: '日本', desc: '中日贸易繁荣', events: ['《太平御览》输入日本'] },
  ],
  territoryEvolution: [
    { year: 1100, range: '约 280 万 km²', event: '北宋极盛' },
    { year: 1200, range: '约 200 万 km²', event: '南宋偏安' },
  ],
  evaluations: [
    { author: '陈亮', quote: '南宋之亡，非亡于蒙古，亡于理学家也', source: '《宋史·陈亮传》' },
    { author: '钱穆', quote: '宋代是中国之文艺复兴时代', source: '《国史大纲》' },
  ],
  geoFile: 'song.json',
  color: '#3A7A7A',
  figureIds: ['song-taizu'],
  sceneIds: ['qingming-river'],
}

// ===================================================================
// 12. 元
// ===================================================================
const yuan: Dynasty = {
  id: 'yuan',
  name: '元',
  pinyin: 'yuán',
  startYear: 1271,
  endYear: 1368,
  capital: '大都（今北京）',
  founder: '忽必烈',
  lastRuler: '元顺帝妥懽帖睦尔',
  peakArea: 1372,
  peakYear: 1290,
  peakPopulation: 9000,
  oneLineTag: '蒙古族建立的统一王朝',
  summary: '元朝是蒙古族建立的统一王朝。疆域空前辽阔，**是人类历史上最大陆地帝国之一**。行省制影响深远。',
  riseReasons: [
    { reason: '蒙古帝国崛起', desc: '1206 年成吉思汗建立大蒙古国', source: '《元史》' },
    { reason: '三次西征', desc: '蒙古铁骑征服欧亚', source: '《元史》' },
    { reason: '忽必烈改制', desc: '1271 年改国号"大元"', source: '《元史》' },
    { reason: '灭南宋', desc: '1279 年崖山海战', source: '《元史》' },
  ],
  fallReasons: [
    { reason: '民族压迫', desc: '"四等人制"激化矛盾', source: '《元史》' },
    { reason: '财政崩溃', desc: '滥发纸币导致恶性通胀', source: '《元史》' },
    { reason: '红巾军起义', desc: '1351 年红巾军起义瓦解元朝', source: '《明史》' },
  ],
  emperors: [
    { name: '元世祖忽必烈', reign: '1271 - 1294', years: 23, role: '开国之君', achievements: ['建元', '灭南宋', '行省制', '大运河重修'] },
    { name: '元成宗铁穆耳', reign: '1294 - 1307', years: 13, role: '守成', achievements: ['休养生息'] },
    { name: '元仁宗爱育黎拔力八达', reign: '1311 - 1320', years: 9, role: '尊儒', achievements: ['延祐复科'] },
    { name: '元英宗硕德八剌', reign: '1320 - 1323', years: 3, role: '改革', achievements: ['至治改革'] },
    { name: '元顺帝妥懽帖睦尔', reign: '1333 - 1368', years: 35, role: '亡国之君', achievements: ['修宋史'], faults: ['红巾军起义'] },
  ],
  events: [
    { year: 1206, title: '成吉思汗建蒙古国', desc: '铁木真统一蒙古各部', source: '《元史》' },
    { year: 1271, title: '忽必烈改国号', desc: '建国号"大元"', source: '《元史》' },
    { year: 1279, title: '崖山海战', desc: '南宋灭亡', source: '《元史》' },
    { year: 1292, title: '《授时历》颁行', desc: '郭守敬编制，精确度领先世界三百年', source: '《元史》' },
    { year: 1351, title: '红巾军起义', desc: '元末农民战争爆发', source: '《明史》' },
    { year: 1368, title: '明军攻陷大都', desc: '元亡', source: '《明史》' },
  ],
  economy: {
    territory: 1372,
    population: 9000,
    currency: '中统元宝交钞（纸币）',
    others: [
      { label: '行省制', value: '11 个行省，影响后世' },
      { label: '大运河', value: '截弯取直，开通会通河' },
    ],
  },
  battles: [
    { year: 1279, name: '崖山海战', desc: '南宋亡于元', keyFigures: ['张弘范', '陆秀夫'] },
    { year: 1368, name: '明军北伐', desc: '徐达常遇春攻陷大都', keyFigures: ['徐达', '常遇春'] },
  ],
  culture: {
    literature: ['关汉卿《窦娥冤》', '马致远《天净沙·秋思》', '王实甫《西厢记》', '元曲四大家'],
    art: ['元四家（黄公望、倪瓒、王蒙、吴镇）', '元代青花瓷'],
    technology: ['《授时历》（郭守敬）', '活字印刷西传', '火药武器西传'],
    institutions: ['行省制（影响深远）', '四等人制', '宣政院（西藏）', '澎湖巡检司（台湾）'],
  },
  foreignRelations: [
    { direction: '西', target: '欧亚', desc: '蒙古帝国三分之二归元', events: ['四大汗国名义臣服'] },
    { direction: '南', target: '南洋', desc: '海外贸易繁荣', events: ['汪大渊《岛夷志略》'] },
    { direction: '东', target: '日本', desc: '元日战争', events: ['1274/1281 两次东征日本均失败'] },
  ],
  territoryEvolution: [
    { year: 1290, range: '极盛 1372 万 km²', event: '含漠北、西藏、东北、外域' },
  ],
  evaluations: [
    { author: '明太祖朱元璋', quote: '驱逐胡虏，恢复中华', source: '《明太祖实录》' },
    { author: '近现代史家', quote: '行省制是元朝对后世最重要的政治遗产', source: '史学界共识' },
  ],
  geoFile: 'yuan.json',
  color: '#7A4A9B',
  figureIds: ['kublai'],
  sceneIds: ['scene-greatwall'],
}

export const DYNASTIES_PART4: Dynasty[] = [wudai, song, yuan]
