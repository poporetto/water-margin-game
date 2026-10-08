// The walkable world map of the Song realm. Locations unlock with story flags ('loc:<id>').
'use strict';
(function () {
  var U = WM.util, S = WM.S;
  var W = 150, H = 112;
  var LOC = WM.data.locations = {};

  // id, name, x, y, icon, target map, spawn x, spawn y
  function loc(id, name, x, y, icon, map, sx, sy, o) { LOC[id] = Object.assign({ id: id, name: name, x: x, y: y, icon: icon, map: map, sx: sx, sy: sy }, o || {}); }
  loc('longhu', 'Dragon-Tiger Mountain', 84, 104, 'temple', 'longhu', 10, 28);
  loc('kaifeng', 'Eastern Capital (Kaifeng)', 62, 58, 'city', 'kaifeng', 20, 38);
  loc('shivillage', 'Shi Family Village', 12, 54, 'village', 'shivillage', 14, 24);
  loc('shaohua', 'Mount Shaohua', 18, 46, 'mountain', 'shaohua', 10, 22);
  loc('weizhou', 'Weizhou', 8, 40, 'town', 'weizhou', 15, 25);
  loc('wutai', 'Mount Wutai', 30, 18, 'temple', 'wutai_town', 12, 22);
  loc('yanmen', 'Yanmen County', 22, 22, 'town', 'yanmen', 12, 20);
  loc('peach', 'Peach Blossom Village', 42, 34, 'village', 'peach', 12, 20);
  loc('waguan', 'Waguan Monastery', 52, 44, 'ruin', 'waguan', 12, 22);
  loc('boarforest', 'Wild Boar Forest', 70, 46, 'forest', 'boarforest', 4, 12);
  loc('chaimanor', 'Chai Jin\'s Manor', 92, 22, 'manor', 'chaimanor', 14, 22);
  loc('cangzhou', 'Cangzhou', 98, 16, 'town', 'cangzhou', 14, 24);
  loc('zhugui', 'Zhu Gui\'s Tavern', 82, 44, 'inn', 'zhugui', 8, 12);
  loc('liangshan', 'Liangshan Marsh', 96, 44, 'fortress', 'liangshan', 20, 30);
  loc('daming', 'Daming Prefecture', 72, 32, 'city', 'daming', 20, 36);
  loc('dongxi', 'East Creek Village', 88, 56, 'village', 'dongxi', 12, 20);
  loc('shijie', 'Shijie Village', 100, 54, 'village', 'shijie', 4, 14);
  loc('huangni', 'Yellow Earth Ridge', 78, 40, 'pass', 'huangni', 4, 14);
  loc('erlong', 'Mount Erlong', 126, 30, 'mountain', 'erlong', 12, 22);
  loc('yuncheng', 'Yuncheng County', 84, 52, 'town', 'yuncheng', 16, 26);
  loc('songfarm', 'Song Family Farm', 80, 56, 'village', 'songfarm', 10, 16);
  loc('jingyang', 'Jingyang Ridge', 76, 48, 'pass', 'jingyang', 4, 18);
  loc('yanggu', 'Yanggu County', 80, 46, 'town', 'yanggu', 16, 26);
  loc('mengzhou', 'Mengzhou', 40, 52, 'town', 'mengzhou', 16, 26);
  loc('crossslope', 'Cross Slope', 46, 54, 'inn', 'crossslope', 8, 12);
  loc('qingfeng', 'Qingfeng Fort', 124, 42, 'fort', 'qingfeng', 14, 24);
  loc('qingzhou', 'Qingzhou', 118, 36, 'city', 'qingzhou', 18, 30);
  loc('jieling', 'Jieling Ridge', 76, 90, 'inn', 'jieling', 8, 14);
  loc('jieyang', 'Jieyang Town', 66, 90, 'town', 'jieyang', 14, 24);
  loc('jiangzhou', 'Jiangzhou', 70, 100, 'city', 'jiangzhou', 20, 34);
  loc('whitedragon', 'White Dragon Temple', 78, 102, 'temple', 'whitedragon', 10, 16);
  loc('wuweijun', 'Wuweijun', 84, 98, 'town', 'wuweijun', 14, 22);
  loc('huandao', 'Huandao Village', 82, 58, 'temple', 'huandao', 10, 18);
  loc('yishui', 'Yishui County', 110, 50, 'village', 'yishui', 12, 20);
  loc('jizhou_n', 'Jizhou of the North', 78, 10, 'city', 'jizhou_n', 18, 30);
  loc('cuiping', 'Cuiping Mountain', 84, 8, 'mountain', 'cuiping', 10, 20);
  loc('erxian', 'Erxian Mountain', 70, 8, 'temple', 'erxian', 10, 22);
  loc('zhujia', 'Zhu Family Village', 104, 38, 'fort', 'zhujia', 4, 24);
  loc('lijia', 'Li Family Manor', 110, 40, 'manor', 'lijia', 12, 20);
  loc('dengzhou', 'Dengzhou', 138, 22, 'town', 'dengzhou', 14, 24);
  loc('gaotang', 'Gaotang', 84, 24, 'city', 'gaotang', 18, 30);
  loc('huazhou', 'Huazhou', 22, 58, 'city', 'huazhou', 18, 30);
  loc('xiyue', 'Mount Xiyue', 20, 64, 'temple', 'xiyue', 10, 20);
  loc('mangdang', 'Mount Mangdang', 100, 74, 'mountain', 'mangdang', 12, 22);
  loc('zengtou', 'Zengtou City', 112, 20, 'fort', 'zengtou', 4, 20);
  loc('dongping', 'Dongping', 104, 32, 'city', 'dongping', 18, 30);
  loc('dongchang', 'Dongchang', 84, 34, 'city', 'dongchang', 18, 30);
  loc('youzhou', 'Youzhou (Liao)', 74, 3, 'fort', 'youzhou', 14, 22);
  loc('hedong', 'Hedong (Tian Hu)', 24, 28, 'fort', 'hedong', 14, 22);
  loc('huaixi', 'Huaixi (Wang Qing)', 48, 80, 'fort', 'huaixi', 14, 22);
  loc('runzhou', 'Runzhou', 110, 96, 'city', 'runzhou', 18, 30);
  loc('hangzhou', 'Hangzhou', 120, 106, 'city', 'hangzhou', 18, 30);
  loc('muzhou', 'Muzhou', 104, 104, 'fort', 'muzhou', 14, 22);
  loc('qingxi', 'Qingxi (Fang La)', 96, 108, 'fort', 'qingxi', 14, 24);
  loc('liuhe', 'Liuhe Pagoda', 124, 108, 'temple', 'liuhe', 10, 18);
  loc('liaoerwa', 'Liaoerwa', 100, 84, 'marsh', 'liaoerwa', 10, 18);

  // ---------- terrain ----------
  function vnoise(x, y, s, seed) {
    var x0 = Math.floor(x / s), y0 = Math.floor(y / s), fx = x / s - x0, fy = y / s - y0;
    var a = U.hash2(x0, y0, seed), b = U.hash2(x0 + 1, y0, seed), c = U.hash2(x0, y0 + 1, seed), d = U.hash2(x0 + 1, y0 + 1, seed);
    var sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    return (a * (1 - sx) + b * sx) * (1 - sy) + (c * (1 - sx) + d * sx) * sy;
  }
  function polyline(g, pts, ch, width, wob) {
    for (var i = 0; i < pts.length - 1; i++) {
      var a = pts[i], b = pts[i + 1];
      var n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])) * 2;
      for (var k = 0; k <= n; k++) {
        var t = k / n, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
        var off = wob ? Math.sin((x + y) * 0.35) * wob : 0;
        for (var dy = 0; dy < width; dy++) for (var dx = 0; dx < width; dx++) g.set(Math.round(x + dx), Math.round(y + dy + off), ch);
      }
    }
  }
  var RIVERS = {
    yellow: [[0, 46], [16, 48], [30, 49], [46, 50], [58, 52], [68, 50], [76, 46], [84, 38], [92, 30], [102, 22], [114, 16], [130, 12], [150, 10]],
    yangtze: [[0, 96], [20, 95], [40, 94], [56, 96], [70, 97], [86, 96], [100, 93], [114, 92], [130, 95], [150, 94]],
    huai: [[40, 79], [60, 78], [76, 80], [90, 80], [106, 78], [124, 76], [142, 78]]
  };
  WM.world = { W: W, H: H, LOC: LOC, RIVERS: RIVERS };

  function build() {
    var g = WM.mapLib.grid(W, H, '.');
    // base vegetation
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
      var n = vnoise(x, y, 7, 11) * 0.7 + vnoise(x, y, 3, 12) * 0.3;
      var m = vnoise(x, y, 9, 21) * 0.75 + vnoise(x, y, 3, 22) * 0.25;
      var west = x < 40 ? (40 - x) / 40 : 0;
      var north = y < 20 ? (20 - y) / 20 : 0;
      var south = y > 86 ? 1 : 0;
      if (m + west * 0.35 + north * 0.15 > 0.78) g.set(x, y, 'M');
      else if (n > 0.66) g.set(x, y, south ? 'T' : (north || west > 0.3 ? 'P' : 'T'));
      else if (n > 0.6) g.set(x, y, ',');
      else if (south && U.hash2(x, y, 5) > 0.93) g.set(x, y, 'b');
    }
    // sea along the east and the south-east coast
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      var coast = 143 - Math.round(Math.sin(y * 0.13) * 3) - (y > 60 ? Math.round((y - 60) * 0.05) : 0) + (y < 30 ? 2 : 0);
      if (x >= coast) g.set(x, y, x >= coast + 2 ? 'w' : '~');
    }
    // rivers
    polyline(g, RIVERS.yellow, '~', 2, 1.2);
    polyline(g, RIVERS.yangtze, '~', 3, 1.5);
    polyline(g, RIVERS.huai, '~', 2, 1);
    // Liangshan Marsh: 800 li of water around the fortress mountain
    for (y = 30; y < 60; y++) for (x = 80; x < 114; x++) {
      var dx = (x - 96) / 11, dy = (y - 44) / 7.5;
      var d = dx * dx + dy * dy + (vnoise(x, y, 3, 31) - 0.5) * 0.35;
      if (d < 1) g.set(x, y, d < 0.75 ? 'w' : U.hash2(x, y, 33) > 0.5 ? 'r' : '~');
    }
    g.rect(94, 42, 5, 3, 'M'); g.set(95, 41, 'M'); g.set(97, 41, 'M');
    // Liaoerwa: the reedy marsh near Chuzhou where the story ends
    for (y = 80; y < 90; y++) for (x = 94; x < 108; x++) { var dd = Math.pow((x - 100) / 5, 2) + Math.pow((y - 85) / 3.5, 2); if (dd < 1) g.set(x, y, U.hash2(x, y, 41) > 0.45 ? 'r' : '~'); }
    // West Lake at Hangzhou
    for (y = 106; y < 111; y++) for (x = 114; x < 119; x++) g.set(x, y, '~');

    // roads between locations (dirt), with bridges over water
    var R = [
      ['kaifeng', 'mengzhou'], ['mengzhou', 'crossslope'], ['mengzhou', 'shivillage'], ['shivillage', 'shaohua'], ['shivillage', 'huazhou'], ['huazhou', 'xiyue'],
      ['shaohua', 'weizhou'], ['weizhou', 'yanmen'], ['yanmen', 'wutai'], ['wutai', 'peach'], ['peach', 'waguan'], ['waguan', 'kaifeng'], ['wutai', 'hedong'],
      ['kaifeng', 'boarforest'], ['boarforest', 'daming'], ['daming', 'gaotang'], ['gaotang', 'chaimanor'], ['chaimanor', 'cangzhou'],
      ['daming', 'huangni'], ['huangni', 'zhugui'], ['huangni', 'jingyang'], ['jingyang', 'yanggu'], ['yanggu', 'yuncheng'], ['yuncheng', 'songfarm'],
      ['yuncheng', 'dongxi'], ['dongxi', 'shijie'], ['songfarm', 'huandao'], ['kaifeng', 'yuncheng'], ['daming', 'dongchang'], ['dongchang', 'zhugui'],
      ['zhujia', 'lijia'], ['lijia', 'yishui'], ['dongping', 'zhujia'], ['dongping', 'zengtou'], ['zengtou', 'cangzhou'], ['dongping', 'qingzhou'],
      ['qingzhou', 'qingfeng'], ['qingzhou', 'erlong'], ['qingzhou', 'kongmanor'], ['erlong', 'dengzhou'], ['yishui', 'qingfeng'], ['shijie', 'mangdang'], ['mangdang', 'liaoerwa'],
      ['kaifeng', 'huaixi'], ['huaixi', 'jieyang'], ['jieyang', 'jieling'], ['jieling', 'jiangzhou'], ['jiangzhou', 'whitedragon'], ['whitedragon', 'wuweijun'],
      ['jiangzhou', 'longhu'], ['liaoerwa', 'runzhou'], ['runzhou', 'hangzhou'], ['hangzhou', 'liuhe'], ['hangzhou', 'muzhou'], ['muzhou', 'qingxi'],
      ['gaotang', 'jizhou_n'], ['jizhou_n', 'cuiping'], ['jizhou_n', 'erxian'], ['jizhou_n', 'youzhou'], ['mangdang', 'jieling']
    ];
    R.forEach(function (r) {
      var a = LOC[r[0]], b = LOC[r[1]];
      var x0 = a.x, y0 = a.y + 1, x1 = b.x, y1 = b.y + 1;
      var midx = x0, step = function (x, y) {
        var c = g.get(x, y);
        if (c === '~' || c === 'w' || c === 'r') g.set(x, y, 'B'); else if (c !== 'B') g.set(x, y, ':');
      };
      var sx = Math.sign(x1 - x0), sy = Math.sign(y1 - y0);
      var x = x0, y = y0;
      while (x !== x1 || y !== y1) {
        // alternate to make diagonal-ish staircase roads
        if (x !== x1 && (y === y1 || (Math.abs(x1 - x) >= Math.abs(y1 - y)))) x += sx; else y += sy;
        step(x, y);
      }
    });
    // keep the marsh roads from crossing the whole marsh: Liangshan is reached by boat from Zhu Gui's tavern
    for (y = 36; y < 53; y++) for (x = 86; x < 107; x++) if (g.get(x, y) === 'B' || g.get(x, y) === ':') { var dx2 = (x - 96) / 11, dy2 = (y - 44) / 7.5; if (dx2 * dx2 + dy2 * dy2 < 0.95) g.set(x, y, 'w'); }

    // location icons
    for (var id in LOC) {
      var L = LOC[id];
      if (L.cond && !L.cond(S)) continue;
      var shown = S.has('loc:' + id);
      if (!shown) continue;
      var ic = L.icon, lx = L.x, ly = L.y;
      if (ic === 'city') { g.rect(lx - 1, ly - 1, 3, 1, '^'); g.set(lx - 1, ly, '#'); g.set(lx + 1, ly, '#'); g.set(lx, ly, 'G'); }
      else if (ic === 'town') { g.rect(lx - 1, ly - 1, 3, 1, '^'); g.set(lx - 1, ly, 'W'); g.set(lx + 1, ly, 'W'); g.set(lx, ly, 'D'); }
      else if (ic === 'village' || ic === 'manor') { g.rect(lx - 1, ly - 1, 2, 1, ic === 'manor' ? '^' : 'z'); g.set(lx - 1, ly, 'W'); g.set(lx, ly, 'D'); }
      else if (ic === 'temple') { g.rect(lx - 1, ly - 1, 3, 1, 'v'); g.set(lx - 1, ly, 'R'); g.set(lx + 1, ly, 'R'); g.set(lx, ly, 'D'); }
      else if (ic === 'fort') { g.rect(lx - 1, ly - 1, 3, 1, '#'); g.set(lx - 1, ly, '#'); g.set(lx + 1, ly, '#'); g.set(lx, ly, 'G'); }
      else if (ic === 'mountain') { g.set(lx - 1, ly - 1, 'M'); g.set(lx + 1, ly - 1, 'M'); g.set(lx, ly - 1, 'M'); g.set(lx, ly, ':'); g.set(lx - 1, ly, 'P'); g.set(lx + 1, ly, 'P'); }
      else if (ic === 'inn') { g.set(lx, ly - 1, 'z'); g.set(lx + 1, ly - 1, 'z'); g.set(lx, ly, 'D'); g.set(lx + 1, ly, 'O'); }
      else if (ic === 'forest' || ic === 'pass' || ic === 'ruin' || ic === 'marsh') { g.set(lx, ly, ':'); g.set(lx, ly - 1, ic === 'forest' ? 'T' : ic === 'ruin' ? 'e' : ic === 'marsh' ? 'r' : 'm'); }
      else if (ic === 'fortress') { /* Liangshan: the island itself */ g.set(lx, ly + 1, 'D'); g.set(lx - 1, ly + 1, 'Y'); g.set(lx + 1, ly + 1, 'Y'); g.rect(lx - 1, ly, 3, 1, '^'); }
      // clear approach tile
      var below = g.get(lx, ly + 1);
      if (ic !== 'fortress' && (below === 'M' || below === 'T' || below === 'P' || below === 'b' || below === 'w')) g.set(lx, ly + 1, ':');
    }
    return g.rows();
  }

  function exits() {
    var out = [];
    for (var id in LOC) {
      (function (L) {
        var md = WM.data.maps[L.map], sp = (md && (md.entry || md.spawn)) || [L.sx, L.sy];
        var ex = { x: L.x, y: L.y + (L.icon === 'fortress' ? 1 : 0), to: L.map, tx: sp[0], ty: sp[1], dir: 'up',
          cond: function (S2) { return S2.has('loc:' + L.id) && WM.data.maps[L.map]; },
          blocked: function (S2) { return { text: S2.has('loc:' + L.id) ? L.name + '. (Not yet passable.)' : L.name + '. There is no reason to go there now.' }; } };
        out.push(ex);
      })(LOC[id]);
    }
    return out;
  }

  WM.defMap('world', {
    name: '', world: true, theme: 'spring', music: 'world',
    cacheKey: function () { return Object.keys(LOC).filter(function (id) { return S.has('loc:' + id); }).join(','); },
    rows: build,
    get exits() { return exits(); },
    battleBg: 'plains',
    encounters: {
      rate: 0.05,
      troops: function (S2) {
        var ch = WM.state.chapter;
        var key = 'world' + Math.min(9, Math.floor(ch / 2.5));
        return WM.data.worldTroops[key] || WM.data.worldTroops.world0;
      }
    }
  });
  WM.data.worldTroops = {
    world0: [['bandit', 'bandit'], ['wolf', 'wolf'], ['bandit', 'banditArcher'], ['boar'], ['snake', 'snake']],
    world1: [['bandit2', 'bandit', 'banditArcher'], ['wolf', 'wolf', 'wolf'], ['boar', 'boar'], ['eagle', 'eagle']],
    world2: [['roadbandit', 'roadbandit', 'roadarcher'], ['wolf2', 'wolf2'], ['monkey', 'monkey', 'monkey'], ['constable', 'constable', 'soldier']],
    world3: [['roadbrute', 'roadbandit', 'roadarcher'], ['bear'], ['wolf2', 'wolf2', 'wolf2'], ['soldier', 'soldier', 'archer']],
    world4: [['soldier2', 'soldier2', 'archer2'], ['boar2', 'boar2'], ['snake2', 'snake2'], ['roadbrute', 'roadbrute', 'roadarcher']],
    world5: [['soldier2', 'archer2', 'officer2'], ['crocodile'], ['toad', 'toad', 'toad'], ['boar2', 'bear']],
    world6: [['soldier3', 'soldier3', 'archer3'], ['soldier3', 'archer3', 'officer3']],
    world7: [['soldier3', 'soldier3', 'archer3', 'archer3'], ['officer3', 'officer3']],
    world8: [['soldier4', 'soldier4', 'archer4'], ['officer4', 'soldier4']],
    world9: [['soldier4', 'soldier4', 'archer4', 'officer4']]
  };

  // Exit from a location map back to the world, placing the player just below its icon.
  WM.toWorld = function (locId, x, y, w, h) {
    var L = LOC[locId];
    return { x: x, y: y, w: w || 1, h: h || 1, to: 'world', tx: L.x, ty: L.y + (L.icon === 'fortress' ? 2 : 1), dir: 'down' };
  };
  WM.unlock = function () { for (var i = 0; i < arguments.length; i++) S.flag('loc:' + arguments[i], true); };
})();
