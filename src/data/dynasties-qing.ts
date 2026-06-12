// 清朝完整数据 - 占位
import type { Dynasty } from '@/types/dynasty'

export const qing: Dynasty = {
  id: 'qing',
  name: '清',
  pinyin: 'qīng',
  startYear: 1636,
  endYear: 1912,
  capital: '盛京 / 北京',
  founder: '清太祖努尔哈赤（追尊）',
  lastRuler: '清逊帝溥仪',
  peakArea: 1316,
  peakYear: 1820,
  peakPopulation: 43000,
  oneLineTag: '中国最后一个封建王朝',
  summary: '清朝是中国最后一个封建王朝。康乾盛世后由盛转衰，1912 年宣统退位，两千余年帝制终结。',
  riseReasons: [
    { reason: '后金崛起', desc: '1616 年努尔哈赤统一女真各部，建立后金', source: '《清史稿》' },
    { reason: '改国号清', desc: '1636 年皇太极改国号"大清"', source: '《清史稿》' },
    { reason: '征服朝鲜漠南蒙古', desc: '皇太极两征朝鲜，三征察哈尔', source: '《清史稿》' },
    { reason: '吴三桂引清', desc: '1644 年山海关之战引清军入关', source: '《清史稿》' },
    { reason: '八旗制度', desc: '军政合一，战斗力强', source: '《清史稿》' },
  ],  fallReasons: [
    { reason: '闭关锁国', desc: '乾隆后期全面闭关，与世界脱节', source: '《清史稿》' },
    { reason: '列强侵略', desc: '鸦片战争以来一连串战败', source: '《清史稿》' },
    { reason: '太平天国', desc: '1851-1864 年内乱，**动摇国本**', source: '《清史稿》' },
    { reason: '戊戌变法失败', desc: '1898 年百日维新，戊戌六君子殉国', source: '《清史稿》' },
    { reason: '辛亥革命', desc: '1911 年武昌起义，**帝制终结**', source: '《清史稿》' },
  ],  emperors: [
    { name: '清太祖努尔哈赤', reign: '1616 - 1626', years: 10, role: '后金建立者', achievements: ['统一女真', '建立后金', '八旗制度'] },
    { name: '清太宗皇太极', reign: '1626 - 1643', years: 17, role: '改国号大清', achievements: ['改国号大清', '征服朝鲜', '征服漠南蒙古'] },
    { name: '清世祖顺治', reign: '1643 - 1661', years: 18, role: '入关第一帝', achievements: ['清军入关', '统一中国'] },
    { name: '清圣祖康熙', reign: '1661 - 1722', years: 61, role: '千古一帝', achievements: ['擒鳌拜', '平三藩', '统一台湾', '三征噶尔丹', '尼布楚条约'] },
    { name: '清世宗雍正', reign: '1722 - 1735', years: 13, role: '改革皇帝', achievements: ['摊丁入亩', '火耗归公', '设立军机处', '改土归流', '秘密立储制'] },
    { name: '清高宗乾隆', reign: '1735 - 1796', years: 60, role: '康乾盛世顶峰', achievements: ['《四库全书》', '十全武功'], faults: ['闭关锁国', '大兴文字狱', '宠信和珅'] },
    { name: '清仁宗嘉庆', reign: '1796 - 1820', years: 25, role: '由盛转衰', achievements: ['诛和珅'], faults: ['白莲教起义', '鸦片走私'] },
    { name: '清宣宗道光', reign: '1820 - 1850', years: 30, role: '鸦片战争', achievements: [], faults: ['鸦片战争', '签订《南京条约》'] },
    { name: '清文宗咸丰', reign: '1850 - 1861', years: 11, role: '太平天国', achievements: [], faults: ['太平天国', '英法联军', '火烧圆明园'] },
    { name: '清穆宗同治', reign: '1861 - 1875', years: 13, role: '同治中兴', achievements: ['洋务运动', '平定太平天国'] },
    { name: '清德宗光绪', reign: '1875 - 1908', years: 33, role: '戊戌变法', achievements: ['戊戌变法'], faults: ['戊戌变法失败', '被慈禧幽禁'] },
    { name: '清逊帝溥仪', reign: '1908 - 1912', years: 3, role: '亡国之君', achievements: [], faults: ['沦为伪满洲国傀儡'] },
  ],  events: [
    { year: 1616, title: '后金建立', desc: '努尔哈赤建立后金', location: '赫图阿拉', coords: [125.0, 41.7], source: '《清史稿》' },
    { year: 1636, title: '改国号清', desc: '皇太极改国号"大清"', location: '沈阳', coords: [123.4, 41.8], source: '《清史稿》' },
    { year: 1644, title: '清军入关', desc: '吴三桂引清军入关', location: '山海关', coords: [119.8, 40.0], source: '《清史稿》' },
    { year: 1683, title: '统一台湾', desc: '施琅攻台', location: '台南', coords: [120.2, 23.0], source: '《清史稿》' },
    { year: 1689, title: '《尼布楚条约》', desc: '中俄第一份边界条约', location: '尼布楚', coords: [116.5, 51.9], source: '《清史稿》' },
    { year: 1722, title: '康熙逝世', desc: '在位 61 年', location: '北京', coords: [116.4, 39.9], source: '《清史稿》' },
    { year: 1729, title: '设军机处', desc: '雍正设立军机处', location: '北京', coords: [116.4, 39.9], source: '《清史稿》' },
    { year: 1796, title: '白莲教起义', desc: '**康乾盛世终结**', location: '湖北', coords: [110.0, 31.0], source: '《清史稿》' },
    { year: 1840, title: '鸦片战争', desc: '**中国近代史开端**', location: '广州', coords: [113.3, 23.1], source: '《清史稿》' },
    { year: 1842, title: '《南京条约》', desc: '中国近代第一份不平等条约', location: '南京', coords: [118.8, 32.1], source: '《清史稿》' },
    { year: 1851, title: '太平天国', desc: '金田起义', location: '金田', coords: [110.1, 23.5], source: '《清史稿》' },
    { year: 1860, title: '火烧圆明园', desc: '英法联军暴行', location: '北京', coords: [116.4, 39.9], source: '《清史稿》' },
    { year: 1894, title: '甲午战争', desc: '清朝惨败于日本', location: '黄海', coords: [123.0, 38.0], source: '《清史稿》' },
    { year: 1898, title: '戊戌变法', desc: '百日维新失败', location: '北京', coords: [116.4, 39.9], source: '《清史稿》' },
    { year: 1900, title: '八国联军', desc: '《辛丑条约》签订', location: '北京', coords: [116.4, 39.9], source: '《清史稿》' },
    { year: 1911, title: '辛亥革命', desc: '武昌起义', location: '武昌', coords: [114.3, 30.6], source: '《清史稿》' },
    { year: 1912, title: '宣统退位', desc: '**两千余年帝制终结**', location: '北京', coords: [116.4, 39.9], source: '《清史稿》' },
  ],  economy: { territory: 1316, population: 43000 },
  battles: [
    { year: 1644, name: '山海关之战', desc: '清军入关', keyFigures: ['多尔衮', '吴三桂', '李自成'] },
    { year: 1683, name: '统一台湾', desc: '施琅攻台', keyFigures: ['施琅'] },
    { year: 1688, name: '三征噶尔丹', desc: '平准噶尔', keyFigures: ['康熙', '噶尔丹'] },
    { year: 1757, name: '平准噶尔', desc: '乾隆平准', keyFigures: ['乾隆', '兆惠'] },
    { year: 1840, name: '鸦片战争', desc: '**中国近代史开端**', keyFigures: ['林则徐', '关天培'] },
    { year: 1851, name: '太平天国', desc: '洪秀全起义', keyFigures: ['洪秀全', '曾国藩', '李鸿章'] },
    { year: 1860, name: '英法联军', desc: '火烧圆明园', keyFigures: ['英法联军', '僧格林沁'] },
    { year: 1894, name: '甲午战争', desc: '清朝惨败', keyFigures: ['李鸿章', '丁汝昌', '邓世昌'] },
    { year: 1900, name: '八国联军', desc: '攻陷北京', keyFigures: ['八国联军', '慈禧'] },
  ],  culture: {
    literature: ['《红楼梦》（曹雪芹）', '《聊斋志异》（蒲松龄）', '《儒林外史》（吴敬梓）', '《四库全书》', '《古文观止》', '桐城派'],
    art: ['扬州八怪（郑板桥等）', '清宫戏画（郎世宁）', '景泰蓝', '珐琅彩瓷'],
    technology: ['《天工开物》', '西方科技传入', '京师同文馆', '江南制造总局', '福州船政局', '开平煤矿'],
    philosophy: ['清代考据学（乾嘉学派）', '戴震《孟子字义疏证》'],
    institutions: ['军机处', '八旗制度', '改土归流', '摊丁入亩', '文字狱', '秘密立储', '总理衙门', '垂帘听政'],
  },  foreignRelations: [
    { direction: '北', target: '沙俄', desc: '边界冲突', events: ['雅克萨之战', '《尼布楚条约》', '《瑷珲条约》', '《北京条约》'] },
    { direction: '西', target: '英法美', desc: '鸦片战争以来一系列不平等条约', events: ['鸦片战争', '英法联军', '八国联军', '《辛丑条约》'] },
    { direction: '东', target: '日本', desc: '甲午战争', events: ['甲午战争', '《马关条约》'] },
    { direction: '南', target: '南洋', desc: '移民与贸易', events: ['下南洋', '新加坡华人社会'] },
  ],  territoryEvolution: [
    { year: 1680, range: '约 1000 万 km²', event: '三藩之乱平定' },
    { year: 1820, range: '极盛 1316 万 km²', event: '含蒙古、新疆、西藏、外东北、外蒙' },
    { year: 1900, range: '约 1140 万 km²', event: '外东北 100 万 km² 割让沙俄' },
  ],  evaluations: [
    { author: '近现代史家', quote: '康乾盛世实为回光返照', source: '史学界共识' },
    { author: '梁启超', quote: '**实亡于嘉道中衰，鸦片战争为分水岭**', source: '《中国历史研究法》' },
    { author: '陈寅恪', quote: '满洲文化不及中华文化之精深', source: '《寒柳堂集》' },
  ],
  relatedPersons: [
    { name: '康熙', role: '千古一帝', events: '在位 61 年', source: '《清史稿》' },
    { name: '雍正', role: '改革皇帝', events: '设立军机处', source: '《清史稿》' },
    { name: '乾隆', role: '盛世顶峰', events: '《四库全书》', source: '《清史稿》' },
    { name: '曾国藩', role: '湘军统帅', events: '平定太平天国', source: '《清史稿》' },
    { name: '李鸿章', role: '直隶总督', events: '洋务运动代表', source: '《清史稿》' },
    { name: '林则徐', role: '钦差大臣', events: '虎门销烟', source: '《清史稿》' },
    { name: '左宗棠', role: '陕甘总督', events: '收复新疆', source: '《清史稿》' },
    { name: '张之洞', role: '湖广总督', events: '洋务运动', source: '《清史稿》' },
    { name: '慈禧', role: '皇太后', events: '**垂帘听政 47 年**', source: '《清史稿》' },
    { name: '和珅', role: '权臣', events: '**清朝第一贪官**', source: '《清史稿》' },
  ],  geoFile: 'qing.json',
  color: '#9A7B2A',
  figureIds: ['kangxi'],
  sceneIds: ['forbidden-city'],
}









