/**
 * 朝代数据 Part 3：晋/南北朝、隋、唐
 */
import type { Dynasty } from '@/types/dynasty'

// ===================================================================
// 7. 晋与南北朝
// ===================================================================
const jin: Dynasty = {
  id: 'jin-nanbeichao',
  name: '晋与南北朝',
  pinyin: 'jìn yǔ nán běi cháo',
  startYear: 266,
  endYear: 589,
  capital: '洛阳 / 建康',
  founder: '司马炎',
  lastRuler: '陈叔宝',
  oneLineTag: '中国最长的分裂期，胡汉融合',
  summary: '从西晋统一到隋朝统一，中国经历 270 余年分裂。胡汉融合，佛教广泛传播，孕育隋唐盛世的母体。',
  riseReasons: [
    { reason: '司马代魏', desc: '265 年司马炎代魏建晋', source: '《晋书》' },
    { reason: '灭东吴', desc: '280 年灭东吴，三国归晋', source: '《晋书》' },
  ],
  fallReasons: [
    { reason: '八王之乱', desc: '291-306 年八王内乱消耗西晋', source: '《晋书》' },
    { reason: '五胡乱华', desc: '匈奴、羯、鲜卑、氐、羌南迁', source: '《晋书》' },
    { reason: '南北朝对峙', desc: '南朝 4 代（宋齐梁陈）更迭', source: '《南史》' },
  ],
  emperors: [
    { name: '晋武帝司马炎', reign: '265 - 290', years: 25, role: '开国之君', achievements: ['灭东吴'] },
    { name: '晋惠帝司马衷', reign: '290 - 307', years: 17, role: '昏君', achievements: [], faults: ['"何不食肉糜"'] },
    { name: '晋元帝司马睿', reign: '317 - 323', years: 6, role: '东晋开国', achievements: ['东晋建立'] },
    { name: '宋武帝刘裕', reign: '420 - 422', years: 2, role: '南朝宋开国', achievements: ['代晋建宋', '北伐'] },
    { name: '梁武帝萧衍', reign: '502 - 549', years: 47, role: '崇佛皇帝', achievements: ['崇佛', '《文选》'], faults: ['"侯景之乱"'] },
    { name: '陈后主陈叔宝', reign: '582 - 589', years: 7, role: '亡国之君', achievements: [], faults: ['《玉树后庭花》'] },
    { name: '北魏孝文帝', reign: '471 - 499', years: 28, role: '汉化改革者', achievements: ['迁都洛阳', '改汉姓', '禁胡语'] },
  ],
  events: [
    { year: 266, title: '司马炎代魏', desc: '西晋建立', location: '洛阳', coords: [112.5, 34.6], source: '《晋书》' },
    { year: 280, title: '灭东吴', desc: '三国归晋', location: '建业', coords: [118.8, 32.1], source: '《晋书》' },
    { year: 311, title: '永嘉之乱', desc: '匈奴刘曜攻陷洛阳', location: '洛阳', coords: [112.5, 34.6], source: '《晋书》' },
    { year: 317, title: '东晋建立', desc: '司马睿在建康即位', location: '建康', coords: [118.8, 32.1], source: '《晋书》' },
    { year: 383, title: '淝水之战', desc: '东晋以少胜多，前秦瓦解', location: '寿县', coords: [116.8, 32.6], source: '《晋书》' },
    { year: 420, title: '刘裕代晋', desc: '南朝开始', location: '建康', coords: [118.8, 32.1], source: '《宋书》' },
    { year: 494, title: '北魏孝文帝改革', desc: '迁都洛阳，全面汉化', location: '洛阳', coords: [112.5, 34.6], source: '《魏书》' },
    { year: 589, title: '隋灭陈', desc: '南北朝结束', location: '建康', coords: [118.8, 32.1], source: '《隋书》' },
  ],
  economy: { territory: 380 },
  battles: [
    { year: 383, name: '淝水之战', desc: '东晋以少胜多', keyFigures: ['谢安', '谢玄', '苻坚'] },
    { year: 383, name: '参合陂之战', desc: '北魏击败后燕', keyFigures: ['拓跋珪', '慕容宝'] },
  ],
  culture: {
    literature: ['《文选》（萧统）', '《世说新语》', '陶渊明', '谢灵运'],
    philosophy: ['玄学（王弼、何晏）', '佛教（道安、慧远、鸠摩罗什）'],
    art: ['云冈石窟（北魏）', '龙门石窟（北魏）', '敦煌莫高窟（北魏）', '王羲之书法'],
    technology: ['祖冲之圆周率', '贾思勰《齐民要术》', '郦道元《水经注》'],
  },
  foreignRelations: [
    { direction: '北', target: '五胡', desc: '匈奴、羯、鲜卑、氐、羌', events: ['五胡乱华'] },
  ],
  territoryEvolution: [
    { year: 280, range: '统一 380 万 km²', event: '西晋统一' },
    { year: 400, range: '南北朝对峙', event: '南北分立' },
  ],
  evaluations: [
    { author: '房玄龄', quote: '江左三百年之政弊', source: '《晋书·卷末》' },
  ],
  geoFile: 'jin-nanbeichao.json',
  color: '#8B6B4A',
  figureIds: ['jin-wangxizhi'],
  sceneIds: ['scene-dunhuang'],
}

// ===================================================================
// 8. 隋
// ===================================================================
const sui: Dynasty = {
  id: 'sui',
  name: '隋',
  pinyin: 'suí',
  startYear: 581,
  endYear: 618,
  capital: '大兴（长安）',
  founder: '隋文帝杨坚',
  lastRuler: '隋炀帝杨广',
  oneLineTag: '结束分裂的短命王朝',
  summary: '隋朝结束 270 余年分裂。开皇之治与大运河，前者福泽万世，后者功过千秋。享国仅 37 年。',
  riseReasons: [
    { reason: '北周禅让', desc: '581 年杨坚代北周建隋', source: '《隋书》' },
    { reason: '开皇之治', desc: '隋文帝勤政，开皇年间盛世', source: '《隋书》' },
  ],
  fallReasons: [
    { reason: '三征高句丽', desc: '612-614 年三次征高句丽皆败', source: '《隋书》' },
    { reason: '滥用民力', desc: '大运河、东都、长城，民力枯竭', source: '《隋书》' },
    { reason: '三下江都', desc: '隋炀帝三下江都游玩', source: '《隋书》' },
    { reason: '瓦岗军起义', desc: '611 年王薄起义，翟让瓦岗军', source: '《旧唐书》' },
  ],
  emperors: [
    { name: '隋文帝杨坚', reign: '581 - 604', years: 23, role: '开国之君', achievements: ['结束分裂', '开皇之治', '三省六部制'] },
    { name: '隋炀帝杨广', reign: '604 - 618', years: 14, role: '亡国之君', achievements: ['开凿大运河', '进士科'], faults: ['三征高丽', '滥用民力', '三下江都'] },
  ],
  events: [
    { year: 589, title: '隋灭陈', desc: '南北朝结束，重新统一', location: '建康', coords: [118.8, 32.1], source: '《隋书》' },
    { year: 605, title: '开凿大运河', desc: '贯通南北的大工程开始', location: '洛阳', coords: [112.5, 34.6], source: '《隋书》' },
    { year: 610, title: '营建东都', desc: '洛阳成为政治副中心', location: '洛阳', coords: [112.5, 34.6], source: '《隋书》' },
    { year: 611, title: '王薄起义', desc: '"知世郎"反隋', location: '邹平', coords: [117.7, 36.9], source: '《旧唐书》' },
    { year: 612, title: '一征高句丽', desc: '113 万大军出征大败', location: '辽东', coords: [125.0, 41.0], source: '《隋书》' },
    { year: 618, title: '江都之变', desc: '宇文化及杀杨广，隋亡', location: '江都', coords: [119.4, 32.4], source: '《隋书》' },
  ],
  economy: {
    territory: 467,
    population: 4600,
    roads: '大运河（永济渠、通济渠、邗沟、江南河）',
    others: [
      { label: '大运河', value: '全长 2700 公里' },
      { label: '科举雏形', value: '进士科' },
    ],
  },
  battles: [
    { year: 589, name: '隋灭陈', desc: '结束南北朝', keyFigures: ['杨广', '韩擒虎', '贺若弼'] },
    { year: 612, name: '一征高句丽', desc: '113 万大军大败', keyFigures: ['杨广', '高元'] },
    { year: 618, name: '瓦岗军袭击', desc: '瓦岗军袭击洛阳', keyFigures: ['李密', '翟让'] },
  ],
  culture: {
    institutions: ['三省六部制', '科举制（进士科）', '府兵制改革', '均田制'],
    engineering: ['大运河（永济渠、通济渠、邗沟、江南河）', '东都洛阳', '赵州桥（李春）'],
    art: ['敦煌莫高窟隋代壁画', '展子虔《游春图》'],
  },
  foreignRelations: [
    { direction: '北', target: '突厥', desc: '分化东西突厥', events: ['东突厥启民可汗归附'] },
    { direction: '东', target: '高句丽', desc: '三征皆败', events: ['三征高句丽'] },
    { direction: '西', target: '西域', desc: '裴矩《西域图记》', events: ['丝路繁荣'] },
  ],
  territoryEvolution: [
    { year: 610, range: '极盛约 467 万 km²', event: '统一全境' },
  ],
  evaluations: [
    { author: '魏徵', quote: '其内盛而外衰，祸始于炀帝', source: '《隋书》' },
  ],
  geoFile: 'sui.json',
  color: '#5A4A8B',
  figureIds: ['sui-yangdi'],
  sceneIds: ['scene-dunhuang'],
}

// ===================================================================
// 9. 唐
// ===================================================================
const tang: Dynasty = {
  id: 'tang',
  name: '唐',
  pinyin: 'táng',
  startYear: 618,
  endYear: 907,
  capital: '长安',
  founder: '唐高祖李渊',
  lastRuler: '唐哀帝李柷',
  peakArea: 1237,
  peakYear: 700,
  peakPopulation: 8000,
  oneLineTag: '中华文明的黄金时代',
  summary: '唐朝是中国古代最辉煌的朝代。万国来朝，长安是当时世界最大都市。开元盛世达到顶峰，安史之乱后由盛转衰。',
  riseReasons: [
    { reason: '李渊晋阳起兵', desc: '617 年李渊在晋阳起兵', source: '《旧唐书》' },
    { reason: '瓦岗军瓦解隋', desc: '隋朝内乱提供机遇', source: '《旧唐书》' },
    { reason: '李氏家世', desc: '李渊祖父李虎为西魏八柱国之一', source: '《旧唐书》' },
  ],
  fallReasons: [
    { reason: '安史之乱', desc: '755 年安禄山叛乱，唐由盛转衰', source: '《旧唐书》' },
    { reason: '藩镇割据', desc: '安史之乱后藩镇不奉朝命', source: '《新唐书》' },
    { reason: '黄巢起义', desc: '875 年黄巢起义瓦解唐朝', source: '《旧唐书》' },
    { reason: '朱温代唐', desc: '907 年朱温代唐建后梁', source: '《新五代史》' },
  ],
  emperors: [
    { name: '唐高祖李渊', reign: '618 - 626', years: 8, role: '开国之君', achievements: ['建唐', '统一全国'] },
    { name: '唐太宗李世民', reign: '626 - 649', years: 23, role: '天可汗', achievements: ['贞观之治', '灭突厥', '被尊"天可汗"'] },
    { name: '武则天武曌', reign: '690 - 705', years: 15, role: '中国唯一女皇', achievements: ['建武周', '开创殿试'] },
    { name: '唐玄宗李隆基', reign: '712 - 756', years: 44, role: '开元盛世', achievements: ['开元盛世', '安史之乱'], faults: ['安史之乱'] },
    { name: '唐肃宗李亨', reign: '756 - 762', years: 6, role: '平叛', achievements: ['平定安史之乱'] },
    { name: '唐宪宗李纯', reign: '805 - 820', years: 15, role: '元和中兴', achievements: ['元和中兴'] },
    { name: '唐哀帝李柷', reign: '904 - 907', years: 3, role: '亡国之君', achievements: [] },
  ],
  events: [
    { year: 618, title: '李渊称帝', desc: '建唐', location: '长安', coords: [108.9, 34.3], source: '《旧唐书》' },
    { year: 627, title: '贞观之治', desc: '李世民缔造治世典范', location: '长安', coords: [108.9, 34.3], source: '《旧唐书》' },
    { year: 690, title: '武则天称帝', desc: '中国唯一女皇', location: '洛阳', coords: [112.5, 34.6], source: '《旧唐书》' },
    { year: 713, title: '开元盛世', desc: '唐朝国力达到顶峰', location: '长安', coords: [108.9, 34.3], source: '《旧唐书》' },
    { year: 753, title: '鉴真东渡', desc: '中日文化交流里程碑', location: '扬州', coords: [119.4, 32.4], source: '《唐大和上东征传》' },
    { year: 755, title: '安史之乱', desc: '安禄山叛乱，**唐由盛转衰**', location: '范阳', coords: [116.4, 39.9], source: '《旧唐书》' },
    { year: 875, title: '黄巢起义', desc: '瓦解唐朝', location: '曹州', coords: [115.5, 35.2], source: '《旧唐书》' },
    { year: 907, title: '朱温代唐', desc: '唐亡，五代开始', location: '开封', coords: [114.3, 34.8], source: '《新五代史》' },
  ],
  economy: {
    territory: 1237,
    population: 8000,
    currency: '开元通宝',
    others: [
      { label: '长安城', value: '面积 84 平方公里，世界最大都市' },
      { label: '安西都护府', value: '管辖西域' },
    ],
  },
  battles: [
    { year: 627, name: '灭东突厥之战', desc: '李靖灭东突厥', keyFigures: ['李靖', '颉利可汗'] },
    { year: 645, name: '白江口之战', desc: '中日第一次大规模交战', keyFigures: ['刘仁轨', '阿倍比罗夫'] },
    { year: 755, name: '安史之乱', desc: '**唐朝转折点**', keyFigures: ['安禄山', '郭子仪', '李光弼'] },
    { year: 763, name: '吐蕃攻长安', desc: '吐蕃攻陷长安', keyFigures: ['吐蕃', '郭子仪'] },
  ],
  culture: {
    literature: ['李白（诗仙）', '杜甫（诗圣）', '白居易', '王维', '韩愈（古文运动）', '柳宗元'],
    art: ['阎立本《步辇图》《历代帝王图》', '吴道子（画圣）', '周昉《簪花仕女图》', '唐三彩'],
    technology: ['雕版印刷术（唐晚期）', '火药应用于军事', '天文：黄道游仪（僧一行）', '医药：《千金方》（孙思邈）'],
    philosophy: ['韩愈道统说', '禅宗六祖慧能'],
    institutions: ['三省六部制成熟', '科举制完善', '府兵制→募兵制', '节度使'],
  },
  foreignRelations: [
    { direction: '北', target: '突厥', desc: '灭东突厥', events: ['630 年李靖灭东突厥'] },
    { direction: '西', target: '西域', desc: '丝绸之路黄金期', events: ['安西四镇', '玄奘西行', '王玄策出使天竺'] },
    { direction: '南', target: '南诏', desc: '南诏时叛时附', events: ['天宝战争'] },
    { direction: '东', target: '日本', desc: '中日文化交流高峰', events: ['鉴真东渡', '遣唐使', '白江口之战'] },
    { direction: '东', target: '朝鲜', desc: '中朝宗藩体系', events: ['新罗统一朝鲜半岛'] },
  ],
  territoryEvolution: [
    { year: 700, range: '极盛 1237 万 km²', event: '含漠北、辽东、西域' },
    { year: 800, range: '约 800 万 km²', event: '吐蕃、回纥独立' },
  ],
  evaluations: [
    { author: '李隆基前期', quote: '开元盛世', source: '《旧唐书》' },
    { author: '杜甫', quote: '朱门酒肉臭，路有冻死骨', source: '《自京赴奉先县咏怀五百字》' },
  ],
  geoFile: 'tang.json',
  color: '#B8943A',
  figureIds: ['tang-taizong'],
  sceneIds: ['qianli-rivers'],
}

export const DYNASTIES_PART3: Dynasty[] = [jin, sui, tang]
