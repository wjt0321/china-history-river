/**
 * DetailPanel 共享资源映射
 * 人物图 / 场景图 / 题跋
 */

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

export const FIGURE_IMAGES: Record<string, string> = {
  xia: asset('/images/figures/xia-yu.jpg'),
  shang: asset('/images/figures/shang-tang.jpg'),
  zhou: asset('/images/figures/zhou-wuwang.jpg'),
  qin: asset('/images/figures/thirteen-emperors.jpg'),
  han: asset('/images/figures/han-guangwu.jpg'),
  sanguo: asset('/images/figures/sanguo-zhuge.jpg'),
  'jin-nanbeichao': asset('/images/figures/jin-wangxizhi.jpg'),
  sui: asset('/images/figures/sui-yangdi.jpg'),
  tang: asset('/images/figures/tang-taizong.jpg'),
  song: asset('/images/figures/song-taizu.jpg'),
  yuan: asset('/images/figures/kublai.jpg'),
  ming: asset('/images/figures/zhuyuanzhang.jpg'),
  qing: asset('/images/figures/kangxi.jpg'),
}

export const SCENE_IMAGES: Record<string, string> = {
  xia: asset('/images/scenes/scene-xia-erlitou.jpg'),
  shang: asset('/images/scenes/scene-shang-ding.jpg'),
  zhou: asset('/images/scenes/scene-zhou-bells.jpg'),
  // 秦无专属 PD 图，借"明长城"题材代表秦筑长城（史实关联，非秦代原物）
  qin: asset('/images/scenes/scene-greatwall.jpg'),
  han: asset('/images/scenes/han-palace.jpg'),
  sanguo: asset('/images/scenes/scene-sanguo-chibi.jpg'),
  'jin-nanbeichao': asset('/images/scenes/scene-dunhuang.jpg'),
  // 隋无专属 PD 图，复用敦煌壁画（隋代莫高窟开凿盛期，史实关联）
  sui: asset('/images/scenes/scene-dunhuang.jpg'),
  tang: asset('/images/scenes/qianli-rivers.jpg'),
  wudai: asset('/images/scenes/scene-wudai-yeyan.jpg'),
  song: asset('/images/scenes/qingming-river.jpg'),
  // 元无专属 PD 图，复用长城题材（元代居庸关/长城沿线军事意象）
  yuan: asset('/images/scenes/scene-greatwall.jpg'),
  ming: asset('/images/scenes/scene-greatwall.jpg'),
  qing: asset('/images/scenes/forbidden-city.jpg'),
}

export const FIGURE_CAPTIONS: Record<string, string> = {
  xia: '大禹像（公有领域 · Wikimedia Commons）',
  shang: '商汤王像',
  zhou: '周武王像',
  qin: '阎立本《历代帝王图》',
  han: '南薰殿旧藏 · 汉光武帝',
  sanguo: '诸葛亮像',
  'jin-nanbeichao': '王羲之《快雪时晴帖》',
  sui: '历代帝王图系列 · 隋炀帝',
  tang: '唐太宗李世民',
  song: '宋太祖赵匡胤',
  yuan: '元世祖忽必烈',
  ming: '明太祖朱元璋',
  qing: '清圣祖玄烨',
}

export const SCENE_CAPTIONS: Record<string, string> = {
  xia: '二里头遗址 · 夏代青铜爵（公有领域）',
  shang: '后母戊鼎 · 商代青铜礼器（公有领域）',
  zhou: '曾侯乙编钟 · 战国早期青铜礼乐重器（公有领域）',
  qin: '长城题材（公有领域）· 秦筑长城为标志事件，图为后世遗存',
  han: '《汉宫春晓图》局部（公有领域）',
  sanguo: '赤壁之战 · 三国古战场画作（公有领域）',
  'jin-nanbeichao': '敦煌莫高窟壁画（公有领域）',
  sui: '敦煌莫高窟壁画（公有领域）· 隋代为莫高窟开凿盛期',
  tang: '王希孟《千里江山图》（公有领域）',
  wudai: '顾闳中《韩熙载夜宴图》（公有领域）',
  song: '《清明上河图》局部（公有领域）',
  yuan: '长城题材（公有领域）· 元代居庸关内外为军事要冲',
  ming: '明长城（八达岭，公有领域）',
  qing: '紫禁城（公有领域）',
}
