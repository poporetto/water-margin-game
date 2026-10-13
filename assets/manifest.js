// Portrait palette: muted yellow paper for the 108 Stars (including Lu Da), blue for others.
// List character ids here when you drop in replacement art:
//   assets/portraits/<id>.png  - any size, shown in a 144x168 frame (bottom-aligned)
//   assets/sprites/<id>.png    - 3 columns (stand, step, step) x 4 rows (down, left, right, up)
// Example: WM.ASSETS = { portraits: ['linchong', 'songjiang'], sprites: ['linchong'] };
WM.ASSETS = { portraits: ['songjiang', 'linchong', 'luzhishen', 'wusong', 'wuyong', 'huarong'], sprites: [] };
// Cells are read left-to-right, then top-to-bottom.
WM.ASSETS.portraitSheets = {};
WM.ASSETS.portraitGroups = {
  prologue: ['hongxin', 'abbot', 'oxboy_boy', 'daoistA'],
  chapter1: ['shijin', 'wangjin', 'gaoqiu', 'wangmother', 'shitaigong', 'zhuwu',
    'chenda', 'yangchun', 'wangsi', 'liji', 'luda', 'lizhong', 'dutyA',
    'gaoofficer', 'waiter', 'recorder'],
  chapter2: ['luda', 'luzhishen', 'shijin', 'lizhong', 'waiter', 'oldjin', 'cuilian',
    'zhengtu', 'innwaiter', 'zhaoyuanwai', 'zhizhen', 'wutaimonk', 'peddler',
    'liutaigong', 'zhoutong', 'oldmonk', 'cuidaocheng', 'qiuxiaoyi', 'zhiqing',
    'zhangsan', 'lisi', 'linchong', 'jiner', 'smith', 'monk', 'scholar'],
  chapter3: ['linchong', 'luzhishen', 'gaoqiu', 'gaoofficer', 'zhangsan', 'jiner', 'waiter',
    'gaoyanei', 'linwife', 'zhangjiaotou', 'luqian', 'fuan', 'swordseller',
    'dongchao', 'xueba', 'hongjiaotou', 'warden', 'lixiaoer', 'lixiaoerwife',
    'overseer', 'oldsoldier', 'wanglun', 'gaoofficer2', 'chaijin', 'yangzhi',
    'songwan', 'duqian', 'zhugui', 'servant', 'outlaw'],
  chapter4: ['yangzhi', 'gaoqiu', 'niuer', 'zhoujin', 'liangzhongshu', 'kfinnkeep', 'suochao', 'villager'],
  chapter5: ['chaogai', 'liutang', 'leiheng', 'gongsunsheng', 'ruanxiaoer', 'ruanxiaowu', 'ruanxiaoqi', 'baisheng', 'caozheng', 'hetao', 'laoduguan', 'denglong', 'huangan', 'chaoservant', 'soldier', 'erlongguard', 'songjiang', 'wuyong', 'yangzhi', 'luzhishen', 'linchong', 'wanglun', 'duqian', 'songwan', 'zhugui'],
  chapter6: ['yanpo', 'yanpoxi', 'tangniuer', 'songtaigong', 'oldwang', 'songqing', 'zhutong', 'wusong', 'songjiang', 'liutang', 'chaijin', 'servant']
};
Object.keys(WM.ASSETS.portraitGroups).reduce(function (ids, group) {
  return ids.concat(WM.ASSETS.portraitGroups[group]);
}, []).forEach(function (id) {
  WM.ASSETS.portraitSheets[id] = {
    columns: 3, rows: 2,
    expressions: ['normal', 'angry', 'sad', 'smile', 'shock', 'concerned']
  };
});
