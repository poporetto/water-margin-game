// Portrait palette: muted yellow paper for the 108 Stars (including Lu Da), blue for others.
// List character ids here when you drop in replacement art:
//   assets/portraits/<id>.png  - any size, shown in a 144x168 frame (bottom-aligned)
//   assets/sprites/<id>.png    - 3 columns (stand, step, step) x 4 rows (down, left, right, up)
// Example: WM.ASSETS = { portraits: ['linchong', 'songjiang'], sprites: ['linchong'] };
WM.ASSETS = { portraits: ['songjiang', 'linchong', 'luzhishen', 'wusong', 'wuyong', 'huarong'], sprites: ['songjiang', 'linchong-official', 'linchong-exile', 'luzhishen', 'luda'] };
// Approved Classic walk: 192x256 physical cells at the existing 24x32 world size.
WM.ASSETS.spriteScales = { songjiang: 8, 'linchong-official': 8, 'linchong-exile': 8, luzhishen: 8, luda: 8 };
// Cells are read left-to-right, then top-to-bottom.
WM.ASSETS.portraitSheets = {};
WM.ASSETS.portraitGroups = {
  generic: ['shopkeep', 'oldwoman', 'constable', 'villager2', 'farmer', 'woman2', 'child', 'merchant', 'official', 'bandit', 'boatman', 'gambler', 'workman'],
  courtAndTownsfolk: ['huizong', 'lishishi', 'yangjian', 'zhangganban', 'hexuantong', 'wangqing', 'rationclerk', 'villager2', 'farmer', 'woman2', 'child', 'merchant', 'official', 'bandit', 'boatman', 'gambler', 'workman'],
  prologue: ['hongxin', 'abbot', 'oxboy_boy', 'daoistA'],
  chapter1: ['shijin', 'wangjin', 'gaoqiu', 'wangmother', 'shitaigong', 'zhuwu',
    'chenda', 'yangchun', 'wangsi', 'liji', 'luda', 'lizhong', 'dutyA',
    'gaoofficer', 'waiter', 'recorder'],
  chapter2: ['luda', 'luzhishen', 'shijin', 'lizhong', 'waiter', 'oldjin', 'cuilian',
    'zhengtu', 'innwaiter', 'zhaoyuanwai', 'zhizhen', 'wutaimonk', 'peddler',
    'liutaigong', 'zhoutong', 'oldmonk', 'cuidaocheng', 'qiuxiaoyi', 'zhiqing',
    'zhangsan', 'lisi', 'linchong', 'jiner', 'smith', 'monk', 'scholar', 'oldwoman', 'shopkeep'],
  chapter3: ['linchong', 'luzhishen', 'gaoqiu', 'gaoofficer', 'zhangsan', 'jiner', 'waiter',
    'gaoyanei', 'linwife', 'zhangjiaotou', 'luqian', 'fuan', 'swordseller',
    'dongchao', 'xueba', 'hongjiaotou', 'warden', 'lixiaoer', 'lixiaoerwife',
    'overseer', 'oldsoldier', 'wanglun', 'gaoofficer2', 'chaijin', 'yangzhi',
    'songwan', 'duqian', 'zhugui', 'servant', 'outlaw'],
  chapter4: ['innkeep', 'yangzhi', 'gaoqiu', 'niuer', 'zhoujin', 'liangzhongshu', 'kfinnkeep', 'suochao', 'villager'],
  chapter5: ['chaogai', 'liutang', 'leiheng', 'gongsunsheng', 'ruanxiaoer', 'ruanxiaowu', 'ruanxiaoqi', 'baisheng', 'caozheng', 'hetao', 'laoduguan', 'denglong', 'huangan', 'chaoservant', 'soldier', 'erlongguard', 'songjiang', 'wuyong', 'yangzhi', 'luzhishen', 'linchong', 'wanglun', 'duqian', 'songwan', 'zhugui'],
  chapter6: ['yanpo', 'yanpoxi', 'tangniuer', 'songtaigong', 'oldwang', 'songqing', 'zhutong', 'wusong', 'songjiang', 'liutang', 'chaijin', 'servant'],
  chapter7: ['wusong', 'songjiang', 'tavernkeep', 'tigerhunter', 'wudalang', 'panjinlian', 'wangpo', 'ximenqing', 'yunge', 'hejiu', 'yangguofficial', 'sunerniang', 'zhangqing2', 'shien', 'shienfather', 'jiangmenshen', 'zhangdujian', 'zhangtuanlian', 'yulan', 'daoistwang', 'woman', 'kongming', 'kongliang'],
  chapter8: ['guard', 'songjiang', 'huarong', 'yanshun', 'wangying', 'zhengtianshou', 'qinming', 'huangxin', 'lufang', 'guosheng', 'shiyong', 'liugao', 'liuwife', 'qingzhouprefect', 'zhaoneng', 'songtaigong', 'songqing'],
  chapter9: ['songjiang', 'chaogai', 'wuyong', 'huarong', 'liutang', 'yanshun', 'ruanxiaoqi', 'lufang', 'zhugui', 'villager', 'woman', 'soldier', 'daizong', 'likui', 'zhangshun', 'zhangheng', 'lijun', 'tongwei', 'tongmeng', 'muhong', 'muchun', 'xueyong', 'lili', 'xiaorang', 'jindajian', 'houjian', 'oupeng', 'jiangjing', 'malin', 'taozongwang', 'escortzhang', 'mutaigong', 'caijiu', 'huangwenbing', 'executioner'],
  chapter10: ['songjiang', 'likui', 'zhaoneng', 'gongsunsheng', 'chaogai', 'zhugui', 'songqing', 'songtaigong', 'woman', 'jademaiden', 'xuannu', 'likuimother', 'lida', 'ligui', 'squirecao', 'zhufu', 'liyun', 'constable'],
  chapter11: ['songjiang', 'daizong', 'wuyong', 'chaogai', 'yanglin', 'dengfei', 'mengkang', 'peixuan', 'yangxiong', 'shixiu', 'shiqian', 'duxing', 'liying', 'zhangbao', 'pangong', 'qiaoyun', 'yinger', 'peiruhai', 'hudao', 'zhubiao', 'innkeep'],
  chapter12: ['yuehe', 'sunli', 'shixiu', 'songjiang', 'yanglin', 'zhongli', 'likui', 'huarong', 'duxing', 'wuyong', 'xiebao', 'xiezhen', 'maotaigong', 'maozhong', 'gudasao', 'sunxin', 'zouyuan', 'baoji', 'hucheng', 'luantingyu', 'squirezhu', 'zhubiao', 'xiaorang', 'liying', 'husanniang', 'wangying', 'zhulong', 'zhuhu', 'linchong', 'qinming', 'oupeng', 'dengfei', 'lufang', 'muhong', 'yangxiong', 'zourun', 'malin', 'guosheng', 'muchun'],
  chapter13: ["baixiuying", "baiyuqiao", "leimother", "yintianxi", "chaihuangcheng", "gaolian", "luozhenren", "gongsunmother", "linren", "cangzhouboy", "songjiang", "gongsunsheng", "leiheng", "zhutong", "wuyong", "likui", "chaijin", "oldman", "daizong", "tanglong", "linchong", "qinming", "huarong", "lufang", "guosheng", "yanglin", "baisheng"],
  chapter14: ["murong", "kongbin", "xuwife", "wuyong", "songjiang", "lingzhen", "tanglong", "shiqian", "xuning", "linchong", "luzhishen", "kongliang", "wusong", "yangzhi", "huyanzhuo", "qinming", "huarong", "lufang", "guosheng", "sunli", "sunxin", "ruanxiaoer", "ruanxiaowu", "ruanxiaoqi", "hantao", "leiheng", "zhutong", "husanniang", "pengqi"],
  chapter15: ["wusong","guard","heprefect","suyuanjing","fanrui","zhuwu","luzhishen","wuyong","songjiang","shijin","gongsunsheng","xiangchong","ligun","huarong","xuning","chenda","yangchun","leiheng","zhutong"],
  chapter16: ["zengkui","zengtu","shiwengong","fahuamonk","duanjingzhu","chaogai","songjiang","wuyong","linchong","liutang","ruanxiaoer","huyanzhuo","baisheng"],
  chapter17: ["ligu","jiashi","zhangwang","liqiaonu","wangfather","lujunyi","likui","luzhishen","wusong","linchong","guansheng","songjiang","jiaoting","shantinggui","wuyong","qinming","hantao","huarong","husanniang","sunerniang","gudasao","lingzhen","suochao","xuanzan","haosiwen","leiheng","fanrui","shiqian","xiezhen","xiebao","andaoquan","wangdingliu","yanqing","caifu","caiqing","weidingguo","baoxu","zhugui","guard","gongsunsheng","lijun","constable","dongchao","xueba","shixiu","chaogai","zhangshun","chaijin","yuehe","zouyuan","zourun","duanjingzhu"],
  chapter18: ["shiqian","liruilan","chengprefect","zengnong","lujunyi","shiwengong","xuning","dongping","songjiang","wuyong","gongsunsheng","fanrui","yanqing","huarong","lufang","guosheng","zhutong","leiheng","xiezhen","xiebao","zengtu","linchong","ruanxiaoer","ruanxiaowu","ruanxiaoqi","zhangshun","zhangheng","zhangqing","guansheng","yubaosi","gongwang","dingdesun","huangfuduan","zhugui","likui","shijin","husanniang","gudasao","luzhishen","wusong"]
};
Object.keys(WM.ASSETS.portraitGroups).reduce(function (ids, group) {
  return ids.concat(WM.ASSETS.portraitGroups[group]);
}, []).forEach(function (id) {
  WM.ASSETS.portraitSheets[id] = {
    columns: 3, rows: 2,
    expressions: ['normal', 'angry', 'sad', 'smile', 'shock', 'concerned']
  };
});
// Revised Chapter 16 sheets have a different physical expression order.
['duanjingzhu', 'fahuamonk'].forEach(function (id) {
  WM.ASSETS.portraitSheets[id].expressions = ['angry', 'sad', 'smile', 'shock', 'concerned', 'normal'];
});
// people who share a painted sheet: the innkeeper of every town is the one painted for Chapter 4's Kaifeng inn
WM.ASSETS.portraitSheets.innkeep = Object.assign({}, WM.ASSETS.portraitSheets.kfinnkeep, { file: 'kfinnkeep' });

// Lin Chong changes costume at the sentencing scene; separate caches prevent stale expressions.
WM.ASSETS.portraitSheets.linchong.file = "linchong-official";
WM.ASSETS.portraitVariants = {
  linchong_official: Object.assign({}, WM.ASSETS.portraitSheets.linchong),
  linchong_exile: Object.assign({}, WM.ASSETS.portraitSheets.linchong, { file: "linchong-exile" })
};

WM.ASSETS.portraitGroups.linchongOutfits = ["linchong_official", "linchong_exile"];
