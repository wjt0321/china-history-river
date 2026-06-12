/**
 * 朝代数据 Part 2：秦、汉、三国
 */
import type { Dynasty } from '@/types/dynasty'

// ===================================================================
// 4. 秦
// ===================================================================
const qin: Dynasty = {
  id: 'qin',
  name: '秦',
  pinyin: 'qín',
  startYear: -221,
  endYear: -207,
  capital: '咸阳',
  founder: '秦始皇嬴政',
  lastRuler: '子婴',
  peakArea: 440,
  peakYear: -210,
  peakPopulation: 2000,
  oneLineTag: '中国第一个大一统中央集权王朝',
  summary: '公元前 221 年，秦始皇嬴政灭六国，建立中国历史上第一个大一统中央集权王朝。书同文、车同轨、统一度量衡，奠定两千年帝制格局。立国仅 15 年而亡。',
  riseReasons: [
    { reason: '商鞅变法', desc: '前 356 年起，秦孝公任用商鞅变法，秦由弱变强', source: '《史记·秦本纪》' },
    { reason: '七代积累', desc: '从秦孝公至秦王政，**七代君主持续图强**', source: '《史记·秦始皇本纪》' },
    { reason: '地理优势', desc: '据崤函之固，关中沃野千里，进可攻退可守', source: '《史记·刘敬叔孙通列传》' },
    { reason: '六国内斗', desc: '合纵 5 次失败，苏秦死后齐国退出', source: '《史记·田敬仲完世家》' },
    { reason: '客卿制度', desc: '李斯、尉缭、王翦、蒙恬来自六国', source: '《史记·秦始皇本纪》' },
  ],
  fallReasons: [
    { reason: '暴政', desc: '"收泰半之赋"，"赭衣塞路，囹圄成市"', source: '《汉书·食货志》' },
    { reason: '滥用民力', desc: '长城、阿房宫、骊山陵、驰道四大工程并行', source: '《史记·秦始皇本纪》' },
    { reason: '焚书坑儒', desc: '前 213-前 212 年思想控制极端化', source: '《史记·秦始皇本纪》' },
    { reason: '秦二世昏庸', desc: '赵高李斯矫诏立胡亥，**诛杀 32 位兄弟姐妹**', source: '《史记·李斯列传》' },
    { reason: '六国遗民', desc: '项梁项羽、张良、田荣复辟', source: '《史记·项羽本纪》' },
  ],
  emperors: [
    { name: '秦始皇嬴政', reign: '前 246 - 前 210', years: 37, role: '千古一帝', achievements: ['统一六国', '统一度量衡', '统一文字', '北击匈奴', '南征百越'], faults: ['焚书坑儒', '滥用民力', '求长生'] },
    { name: '秦二世胡亥', reign: '前 209 - 前 207', years: 3, role: '亡国之君', achievements: [], faults: ['诛杀 32 兄弟姐妹', '诛蒙恬蒙毅', '重赵高', '自取灭亡'] },
    { name: '秦王子婴', reign: '前 207', years: 0.1, role: '末代秦王', achievements: ['诛赵高', '投降刘邦'] },
  ],
  events: [
    { year: -356, title: '商鞅第一次变法', desc: '秦孝公任商鞅，废井田、奖军功', location: '咸阳', coords: [108.7, 34.3], source: '《史记·商君列传》' },
    { year: -350, title: '商鞅第二次变法', desc: '废封建、立县制、徙都咸阳', location: '咸阳', coords: [108.7, 34.3], source: '《史记·商君列传》' },
    { year: -238, title: '嬴政亲政', desc: '22 岁，铲除嫪毐、吕不韦', location: '咸阳', coords: [108.7, 34.3], source: '《史记·吕不韦列传》' },
    { year: -230, title: '灭韩', desc: '秦灭六国开始', location: '新郑', coords: [113.7, 34.4], source: '《史记·秦始皇本纪》' },
    { year: -221, title: '统一六国', desc: '灭齐，**中国第一个大一统王朝建立**', location: '咸阳', coords: [108.7, 34.3], source: '《史记·秦始皇本纪》' },
    { year: -220, title: '修驰道', desc: '"车同轨"，咸阳通全国', location: '咸阳', coords: [108.7, 34.3], source: '《史记·秦始皇本纪》' },
    { year: -215, title: '北击匈奴', desc: '蒙恬收河南地，**筑万里长城**', location: '河套', coords: [108.8, 40.8], source: '《史记·蒙恬列传》' },
    { year: -213, title: '焚书', desc: '除秦纪、医药、卜筮、种树外皆焚', location: '咸阳', coords: [108.7, 34.3], source: '《史记·秦始皇本纪》' },
    { year: -212, title: '坑儒', desc: '活埋 460 余方士儒生', location: '咸阳', coords: [108.7, 34.3], source: '《史记·秦始皇本纪》' },
    { year: -210, title: '嬴政卒', desc: '第五次东巡途中病逝，年 50', location: '沙丘', coords: [115.2, 36.9], source: '《史记·秦始皇本纪》' },
    { year: -209, title: '大泽乡起义', desc: '陈胜吴广，"王侯将相宁有种乎"', location: '大泽乡', coords: [117.0, 33.6], source: '《史记·陈涉世家》' },
    { year: -207, title: '秦亡', desc: '子婴降于刘邦', location: '咸阳', coords: [108.7, 34.3], source: '《史记·高祖本纪》' },
  ],
  economy: {
    territory: 440,
    population: 2000,
    farmland: '约 2 亿亩',
    currency: '圆形方孔"半两钱"',
    roads: '驰道 9000 余里；直道 700 余里',
    others: [
      { label: '统一度量衡', value: '1 斗 = 10 升 = 100 合' },
      { label: '全国设郡', value: '36 郡（后增至 40 余）' },
    ],
  },
  battles: [
    { year: -260, name: '长平之战', desc: '秦赵决战，**坑杀赵卒 40 万**', keyFigures: ['白起', '赵括'] },
    { year: -230, name: '灭韩之战', desc: '秦统一序幕', keyFigures: ['内史腾'] },
    { year: -223, name: '灭楚之战', desc: '王翦率 60 万大军破楚', keyFigures: ['王翦', '项燕'] },
    { year: -215, name: '北击匈奴', desc: '蒙恬收河套', keyFigures: ['蒙恬'] },
    { year: -214, name: '南征百越', desc: '设桂林、象郡、南海三郡', keyFigures: ['屠睢', '赵佗'] },
    { year: -207, name: '巨鹿之战', desc: '项羽破釜沉舟击败王离', keyFigures: ['项羽', '王离'] },
  ],
  culture: {
    literature: ['《吕氏春秋》（吕不韦主编）', '《谏逐客书》（李斯）'],
    technology: ['统一度量衡', '车同轨', '郑国渠（前 246）', '灵渠（前 214）'],
    engineering: ['万里长城（西起临洮东至辽东）', '秦直道', '驰道', '阿房宫（未成）'],
    art: ['秦兵马俑（世界第八大奇迹）', '铜车马', '秦公簋', '小篆'],
    institutions: ['郡县制（全国 36 郡）', '三公九卿', '秦律', '军功爵制'],
  },
  foreignRelations: [
    { direction: '北', target: '匈奴', events: ['前 215 年蒙恬北击', '修万里长城'] },
    { direction: '南', target: '百越', events: ['前 214 年南征', '设桂林、象郡、南海'] },
    { direction: '东', target: '海东诸国', events: ['徐福东渡（传说至日本）'] },
  ],
  territoryEvolution: [
    { year: -246, range: '关中 + 巴蜀', event: '即位初仅秦国本土' },
    { year: -221, range: '统一六国', event: '10 年并吞韩赵魏楚燕齐' },
    { year: -215, range: '北至河套、阴山', event: '蒙恬收河南地' },
    { year: -214, range: '南至今越南北部', event: '南征百越' },
    { year: -210, range: '极盛 440 万 km²', event: '东至海，西至陇西，北至阴山，南至越南北部' },
  ],
  evaluations: [
    { author: '李白', quote: '秦王扫六合，虎视何雄哉', source: '《古风·秦王扫六合》' },
    { author: '毛泽东', quote: '百代都行秦政法', source: '《七律·读〈封建论〉呈郭老》' },
    { author: '司马迁', quote: '秦以刑杀为威，天下震恐', source: '《史记·秦始皇本纪》' },
  ],
  relatedPersons: [
    { name: '吕不韦', role: '丞相', events: '主编《吕氏春秋》', source: '《史记·吕不韦列传》' },
    { name: '李斯', role: '丞相', events: '统一文字（小篆），沙丘之变', source: '《史记·李斯列传》' },
    { name: '王翦', role: '秦将', events: '灭赵、灭楚，**功冠诸将**', source: '《史记·白起王翦列传》' },
    { name: '蒙恬', role: '秦将', events: '北击匈奴、修长城', source: '《史记·蒙恬列传》' },
    { name: '赵高', role: '宦官', events: '沙丘之变核心，**秦亡主谋之一**', source: '《史记·李斯列传》' },
    { name: '章邯', role: '末将', events: '镇压陈胜项羽，后投降', source: '《史记·项羽本纪》' },
  ],
  geoFile: 'qin.json',
  color: '#8B3535',
  figureIds: ['thirteen-emperors'],
  sceneIds: ['han-palace'],
}

// ===================================================================
// 5. 汉
// ===================================================================
const han: Dynasty = {
  id: 'han',
  name: '汉',
  pinyin: 'hàn',
  startYear: -202,
  endYear: 220,
  capital: '长安 / 洛阳',
  founder: '汉高祖刘邦',
  lastRuler: '汉献帝刘协',
  peakArea: 1020,
  peakYear: 50,
  peakPopulation: 5600,
  oneLineTag: '汉族、汉字、汉文化的命名朝代',
  summary: '汉朝是中国历史上最重要的朝代之一。"汉族"、"汉字"、"汉语"因汉朝而得名。丝绸之路通西域，奠定东亚文明圈。',
  riseReasons: [
    { reason: '楚汉之争', desc: '刘邦击败项羽，建立汉朝', source: '《史记·高祖本纪》' },
    { reason: '秦末暴政', desc: '陈胜吴广起义瓦解秦朝', source: '《史记·陈涉世家》' },
    { reason: '约法三章', desc: '刘邦入关"约法三章"，得民心', source: '《史记·高祖本纪》' },
  ],
  fallReasons: [
    { reason: '外戚宦官', desc: '东汉后期外戚与宦官轮流专权', source: '《后汉书》' },
    { reason: '黄巾起义', desc: '184 年黄巾起义瓦解东汉统治', source: '《后汉书》' },
    { reason: '群雄割据', desc: '董卓、曹操、袁绍并起，汉献帝沦为傀儡', source: '《后汉书》' },
  ],
  emperors: [
    { name: '汉高祖刘邦', reign: '前 202 - 前 195', years: 7, role: '开国之君', achievements: ['楚汉之争胜出', '约法三章', '和亲匈奴'] },
    { name: '汉文帝刘恒', reign: '前 180 - 前 157', years: 23, role: '文景之治', achievements: ['轻徭薄赋', '与民休息'] },
    { name: '汉景帝刘启', reign: '前 157 - 前 141', years: 16, role: '文景之治', achievements: ['平定七国之乱'] },
    { name: '汉武帝刘彻', reign: '前 141 - 前 87', years: 54, role: '千古一帝', achievements: ['推恩令', '独尊儒术', '张骞通西域', '北击匈奴', '盐铁官营'], faults: ['巫蛊之祸', '穷兵黩武'] },
    { name: '光武帝刘秀', reign: '25 - 57', years: 32, role: '中兴之主', achievements: ['光武中兴', '建立东汉'] },
    { name: '汉献帝刘协', reign: '189 - 220', years: 31, role: '亡国之君', achievements: [], faults: ['沦为傀儡'] },
  ],
  events: [
    { year: -206, title: '约法三章', desc: '刘邦入咸阳，"杀人者死，伤人及盗抵罪"', location: '咸阳', coords: [108.7, 34.3], source: '《史记·高祖本纪》' },
    { year: -202, title: '刘邦称帝', desc: '垓下之战败项羽后称帝', location: '定陶', coords: [115.6, 35.1], source: '《史记·高祖本纪》' },
    { year: -139, title: '张骞出使', desc: '"凿空之旅"，开辟丝绸之路', location: '长安', coords: [108.9, 34.3], source: '《史记·大宛列传》' },
    { year: -134, title: '罢黜百家', desc: '"独尊儒术，罢黜百家"', location: '长安', coords: [108.9, 34.3], source: '《汉书·董仲舒传》' },
    { year: -127, title: '推恩令', desc: '削弱诸侯王', location: '长安', coords: [108.9, 34.3], source: '《史记·汉兴以来诸侯王年表》' },
    { year: 105, title: '蔡伦造纸', desc: '"蔡侯纸"改进造纸术', location: '洛阳', coords: [112.5, 34.6], source: '《后汉书·蔡伦传》' },
    { year: 89, title: '班超平西域', desc: '东汉再通西域', location: '西域', coords: [80.0, 40.0], source: '《后汉书·班超传》' },
    { year: 184, title: '黄巾起义', desc: '瓦解东汉统治', location: '钜鹿', coords: [115.0, 37.2], source: '《后汉书》' },
    { year: 220, title: '曹丕代汉', desc: '东汉灭亡', location: '洛阳', coords: [112.5, 34.6], source: '《三国志》' },
  ],
  economy: {
    territory: 1020,
    population: 5600,
    currency: '五铢钱（自武帝起）',
    roads: '丝绸之路',
    others: [
      { label: '垦田', value: '东汉垦田 7 亿余亩' },
      { label: '铸五铢钱', value: '中央统一铸币' },
    ],
  },
  battles: [
    { year: -202, name: '垓下之战', desc: '刘邦围项羽', keyFigures: ['刘邦', '项羽', '韩信'] },
    { year: -119, name: '漠北之战', desc: '卫青霍去病大败匈奴', keyFigures: ['卫青', '霍去病'] },
    { year: -36, name: '郅支之战', desc: '陈汤斩郅支单于', keyFigures: ['陈汤'] },
  ],
  culture: {
    literature: ['《史记》（司马迁）', '《汉书》（班固）', '汉赋（司马相如、张衡）', '《九章算术》'],
    technology: ['造纸术（蔡伦改进）', '浑天仪（张衡）', '地动仪（张衡）'],
    philosophy: ['董仲舒新儒学', '谶纬之学'],
    art: ['马王堆汉墓帛画', '汉代画像石', '汉代陶俑'],
    institutions: ['郡国并行制', '刺史制度', '察举制', '盐铁官营'],
  },
  foreignRelations: [
    { direction: '北', target: '匈奴', desc: '汉初和亲，汉武帝后北击', events: ['卫青霍去病漠北之战', '昭君出塞', '陈汤斩郅支'] },
    { direction: '西', target: '西域', desc: '丝绸之路', events: ['张骞凿空', '班超平西域', '设西域都护府'] },
    { direction: '南', target: '南越', desc: '汉武帝平南越', events: ['前 111 年设九郡'] },
  ],
  territoryEvolution: [
    { year: -200, range: '约 600 万 km²', event: '西汉初' },
    { year: -100, range: '极盛约 1020 万 km²', event: '含西域都护府' },
  ],
  evaluations: [
    { author: '班固', quote: '汉承百王之弊，高祖拨乱反正', source: '《汉书·高帝纪》' },
    { author: '陈汤', quote: '明犯强汉者，虽远必诛', source: '上书汉元帝' },
  ],
  geoFile: 'han.json',
  color: '#9A7B3A',
  figureIds: ['han-guangwu'],
  sceneIds: ['han-palace'],
}

// ===================================================================
// 6. 三国
// ===================================================================
const sanguo: Dynasty = {
  id: 'sanguo',
  name: '三国',
  pinyin: 'sān guó',
  startYear: 220,
  endYear: 280,
  capital: '魏洛阳 / 蜀成都 / 吴建业',
  founder: '曹丕 / 刘备 / 孙权',
  lastRuler: '曹奂 / 刘禅 / 孙皓',
  oneLineTag: '烽火连天孕育璀璨叙事与文学',
  summary: '魏蜀吴鼎立 60 年。烽火连天却孕育了最璀璨的英雄叙事与文学，《三国演义》使其成为中国民间文化最深的一部分。',
  riseReasons: [
    { reason: '东汉瓦解', desc: '黄巾起义、董卓乱政瓦解东汉', source: '《三国志》' },
    { reason: '群雄并起', desc: '曹操、刘备、孙权三分天下', source: '《三国志》' },
  ],
  fallReasons: [
    { reason: '蜀汉后主昏庸', desc: '刘禅"乐不思蜀"', source: '《三国志》' },
    { reason: '曹魏权臣夺权', desc: '司马氏代魏', source: '《晋书》' },
    { reason: '东吴内乱', desc: '孙皓暴政', source: '《三国志》' },
  ],
  emperors: [
    { name: '曹丕', reign: '220 - 226', years: 6, role: '魏文帝', achievements: ['代汉建魏', '九品中正制'] },
    { name: '曹操', reign: '前 196 - 220', years: 24, role: '魏武帝（追谥）', achievements: ['挟天子以令诸侯', '官渡之战', '统一北方'], faults: ['屠城'] },
    { name: '刘备', reign: '221 - 223', years: 2, role: '蜀昭烈帝', achievements: ['三顾茅庐', '建立蜀汉'] },
    { name: '诸葛亮', reign: '227 - 234', years: 7, role: '蜀丞相', achievements: ['隆中对', '五次北伐', '鞠躬尽瘁'] },
    { name: '孙权', reign: '222 - 252', years: 30, role: '吴大帝', achievements: ['建立东吴', '赤壁之战'] },
  ],
  events: [
    { year: 200, title: '官渡之战', desc: '曹操以少胜多击败袁绍', location: '官渡', coords: [113.9, 34.7], source: '《三国志》' },
    { year: 208, title: '赤壁之战', desc: '孙刘联军大败曹操', location: '赤壁', coords: [113.9, 29.7], source: '《三国志》' },
    { year: 220, title: '曹丕代汉', desc: '魏国建立', location: '洛阳', coords: [112.5, 34.6], source: '《三国志》' },
    { year: 221, title: '刘备称帝', desc: '蜀汉建立', location: '成都', coords: [104.1, 30.7], source: '《三国志》' },
    { year: 229, title: '孙权称帝', desc: '东吴建立，三国鼎立成形', location: '建业', coords: [118.8, 32.1], source: '《三国志》' },
    { year: 263, title: '蜀汉灭亡', desc: '魏灭蜀', location: '成都', coords: [104.1, 30.7], source: '《三国志》' },
    { year: 265, title: '司马代魏', desc: '西晋建立', location: '洛阳', coords: [112.5, 34.6], source: '《晋书》' },
    { year: 280, title: '西晋灭吴', desc: '三国归晋', location: '建业', coords: [118.8, 32.1], source: '《晋书》' },
  ],
  economy: { territory: 280 },
  battles: [
    { year: 200, name: '官渡之战', desc: '曹操以少胜多', keyFigures: ['曹操', '袁绍'] },
    { year: 208, name: '赤壁之战', desc: '孙刘联军大败曹操', keyFigures: ['周瑜', '诸葛亮', '曹操'] },
    { year: 222, name: '夷陵之战', desc: '陆逊火烧连营', keyFigures: ['陆逊', '刘备'] },
    { year: 234, name: '五丈原', desc: '诸葛亮最后一次北伐', keyFigures: ['诸葛亮', '司马懿'] },
    { year: 263, name: '灭蜀之战', desc: '邓艾偷渡阴平', keyFigures: ['邓艾', '钟会'] },
  ],
  culture: {
    literature: ['《三国志》（陈寿）', '建安七子', '曹植', '阮籍、嵇康（竹林七贤）'],
    technology: ['马钧改进指南车', '连弩（诸葛亮）', '翻车（龙骨水车）'],
    art: ['铜雀台', '画像石（武梁祠）'],
  },
  foreignRelations: [
    { direction: '北', target: '鲜卑、乌丸', events: ['曹操征乌丸'] },
    { direction: '南', target: '山越', events: ['孙权平山越'] },
  ],
  territoryEvolution: [
    { year: 229, range: '魏蜀吴三分', event: '三国鼎立' },
  ],
  evaluations: [
    { author: '陈寿', quote: '魏略曰：诸葛亮...可谓识治之良才', source: '《三国志》' },
    { author: '苏轼', quote: '大江东去，浪淘尽，千古风流人物', source: '《念奴娇·赤壁怀古》' },
  ],
  geoFile: 'sanguo.json',
  color: '#7A3333',
  figureIds: ['sanguo-zhuge'],
  sceneIds: ['scene-dunhuang'],
}

export const DYNASTIES_PART2: Dynasty[] = [qin, han, sanguo]
