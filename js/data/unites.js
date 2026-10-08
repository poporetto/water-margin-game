// Unite attacks: combination techniques for heroes bound by blood, oath or history in the novel.
'use strict';
(function () {
  function U(id, name, members, target, mult, desc, extra) { WM.data.unites.push(Object.assign({ id: id, name: name, members: members, target: target, mult: mult, desc: desc }, extra || {})); }
  U('ruan', 'Three Ruan of Shijie Village', ['ruanxiaoer', 'ruanxiaowu', 'ruanxiaoqi'], 'all', 0.75, 'The fishermen brothers drag the enemy into the water.', { fx: 'water', sfx: 'splash' });
  U('xie', 'Hunters of Dengzhou', ['xiezhen', 'xiebao'], 'one', 1.5, 'The brothers pin their prey between two hunting forks.', { unbalanced: true });
  U('sunfamily', 'Dengzhou Jailbreak', ['sunli', 'sunxin', 'gudasao'], 'all', 0.7, 'Sun Li, Sun Xin and Gu Dasao storm in together.');
  U('kong', 'White Tiger Mountain', ['kongming', 'kongliang'], 'one', 1.4, 'The Kong brothers strike as one.');
  U('tong', 'River Dragons', ['tongwei', 'tongmeng'], 'one', 1.4, 'The Tong brothers surface on either side.', { fx: 'water', sfx: 'splash' });
  U('zhangbros', 'Brothers of the Xunyang', ['zhangheng', 'zhangshun'], 'all', 0.8, 'One on the boat, one beneath the waves.', { fx: 'water', sfx: 'splash' });
  U('mu', 'Masters of Jieyang', ['muhong', 'muchun'], 'one', 1.4, 'The Mu brothers crush the foe.');
  U('erlong', 'Monks of Mount Erlong', ['luzhishen', 'wusong'], 'all', 0.9, 'The Flowery Monk and the Pilgrim sweep the field with staff and blades.', { unbalanced: true });
  U('swornbro', 'Wild Boar Forest', ['luzhishen', 'linchong'], 'one', 1.7, 'The oath sworn in the forest: staff and spear together.');
  U('tigers5', 'Five Tiger Generals', ['guansheng', 'linchong', 'qinming', 'huyanzhuo', 'dongping'], 'all', 1.1, 'The Five Tigers charge as one.', { unbalanced: true, fx: 'burst' });
  U('timelyrain', 'Black Whirlwind', ['songjiang', 'likui'], 'all', 0.9, 'Li Kui rampages at his elder brother\'s word.', { unbalanced: true });
  U('shaohua', 'Three of Mount Shaohua', ['zhuwu', 'chenda', 'yangchun'], 'all', 0.7, 'Zhu Wu\'s plan, Chen Da\'s spear, Yang Chun\'s blade.');
  U('ninedragons', 'Nine Dragons and Shaohua', ['shijin', 'zhuwu', 'chenda', 'yangchun'], 'all', 0.85, 'Shi Jin leads his sworn brothers.', { unbalanced: true });
  U('sworn2', 'Cuiping Mountain', ['yangxiong', 'shixiu'], 'one', 1.5, 'The sworn brothers of Jizhou, Yang Xiong and Shi Xiu.');
  U('couple1', 'Cross Slope Inn', ['zhangqing2', 'sunerniang'], 'all', 0.7, 'The innkeepers of Cross Slope serve their speciality.', { fx: 'wind', sfx: 'wind' });
  U('couple2', 'Stumpy Tiger and Ten Feet of Blue', ['wangying', 'husanniang'], 'one', 1.5, 'Husband and wife.');
  U('halberds', 'Tangled Halberds', ['lufang', 'guosheng', 'huarong'], 'one', 1.9, 'Red and white halberds lock together — Hua Rong\'s arrow parts the tassels and strikes home.');
  U('mangdang', 'Shields of Mangdang', ['fanrui', 'xiangchong', 'ligun'], 'all', 0.75, 'Flying knives and javelins from behind the shields as Fan Rui calls the wind.', { fx: 'wind', sfx: 'wind' });
  U('jadeqilin', 'Master and Servant', ['lujunyi', 'yanqing'], 'one', 1.8, 'Lu Junyi\'s spear and Yan Qing\'s crossbow.');
  U('divinemarch', 'Eight Hundred Li a Day', ['daizong', 'likui'], 'one', 1.6, 'Dai Zong\'s charms carry Li Kui too fast to stop.');
  U('tigers2', 'Tiger-Slayers', ['wusong', 'likui'], 'one', 1.8, 'Two men who have killed tigers with their own hands.');
  U('dongchang', 'Stones of Dongchang', ['zhangqing', 'gongwang', 'dingdesun'], 'all', 0.75, 'Stones, spears and forks fly together.', { fx: 'burst' });
  U('caibros', 'Executioners of Daming', ['caifu', 'caiqing'], 'one', 1.4, 'The Cai brothers.');
  U('zou', 'Dragons of Dengyun', ['zouyuan', 'zourun'], 'one', 1.4, 'Uncle and nephew of Dengyun Mountain.');
  U('zhu', 'Brothers Zhu', ['zhugui', 'zhufu'], 'all', 0.6, 'The tavern-keeping brothers share their drugged wine.', { fx: 'wind', sfx: 'wind' });
  U('thunder2', 'Master and Disciple', ['gongsunsheng', 'fanrui'], 'all', 1.0, 'Gongsun Sheng and his disciple join their rites.', { fx: 'thunder', sfx: 'thunder' });
  U('qingfeng', 'Qingfeng Brothers', ['huarong', 'qinming', 'huangxin'], 'all', 0.8, 'The officers of Qingzhou who became outlaws together.');
  U('archers', 'Arrow and Stone', ['huarong', 'zhangqing'], 'all', 0.85, 'The greatest archer and the featherless arrow.', { fx: 'burst' });
})();
