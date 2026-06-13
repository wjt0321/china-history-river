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
  qin: asset('/images/scenes/han-palace.jpg'),
  han: asset('/images/scenes/han-palace.jpg'),
  sanguo: asset('/images/scenes/scene-sanguo-chibi.jpg'),
  'jin-nanbeichao': asset('/images/scenes/scene-dunhuang.jpg'),
  sui: asset('/images/scenes/scene-dunhuang.jpg'),
  tang: asset('/images/scenes/qianli-rivers.jpg'),
  wudai: asset('/images/scenes/scene-wudai-yeyan.jpg'),
  song: asset('/images/scenes/qingming-river.jpg'),
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
  qin: '《汉宫春晓图》局部',
  han: '《汉宫春晓图》局部',
  sanguo: '赤壁之战 · 三国古战场画作（公有领域）',
  'jin-nanbeichao': '敦煌莫高窟壁画',
  sui: '敦煌莫高窟壁画',
  tang: '王希孟《千里江山图》',
  wudai: '顾闳中《韩熙载夜宴图》（公有领域）',
  song: '《清明上河图》局部',
  yuan: '明长城（八达岭）',
  ming: '明长城（八达岭）',
  qing: '紫禁城',
}
