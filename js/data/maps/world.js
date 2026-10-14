// The walkable world map of the Song realm. Locations unlock with story flags ('loc:<id>').
'use strict';
(function () {
  var U = WM.util, S = WM.S;
  var W = 136, H = 124;
  var LOC = WM.data.locations = {};

  // ---------- where things are ----------
  // Every place at its real longitude and latitude (the story's own villages, ridges and inns set along the roads
  // it travels), projected onto the map with a radial warp centred on Liangshan: bearings stay true, but the
  // crowded heart of the story (Shandong and southern Hebei) gets room, and the far provinces draw in.
  var GEO = {
    longhu: [117.0, 28.1], kaifeng: [114.35, 34.8], shivillage: [110.05, 34.7], shaohua: [110.35, 34.42], weizhou: [106.7, 35.5],
    wutai: [113.6, 39.0], yanmen: [112.9, 39.15], peach: [113.3, 37.2], waguan: [113.8, 35.9], boarforest: [114.75, 35.35],
    chaimanor: [116.45, 38.05], cangzhou: [116.85, 38.3], zhugui: [115.7, 35.85], liangshan: [116.1, 35.8], daming: [115.2, 36.3],
    dongxi: [115.85, 35.35], shijie: [116.4, 35.6], huangni: [114.95, 35.65], erlong: [118.25, 36.6], yuncheng: [115.95, 35.58],
    songfarm: [116.15, 35.42], jingyang: [115.65, 36.05], yanggu: [115.78, 36.2], mengzhou: [112.8, 34.9], crossslope: [113.15, 35.05],
    qingfeng: [118.2, 36.3], qingzhou: [118.47, 36.7], kongmanor: [118.65, 36.42], qingfengshan: [118.05, 36.45],
    jieling: [116.6, 29.5], jieyang: [116.25, 29.55], jiangzhou: [116.0, 29.72], whitedragon: [115.8, 29.5], wuweijun: [117.9, 31.3],
    huandao: [116.05, 35.22], yishui: [118.6, 35.8], jizhou_n: [117.4, 40.05], cuiping: [117.2, 39.95], erxian: [117.6, 40.2],
    zhujia: [116.5, 36.2], zhuinn: [116.3, 36.25], yinma: [117.15, 39.7], wugang: [116.95, 39.45], lingzhou: [116.55, 37.35],
    taishan: [117.1, 36.25], lijia: [116.7, 36.32], dengzhou: [120.75, 37.8], gaotang: [116.23, 36.86], huazhou: [109.75, 34.5],
    xiyue: [110.08, 34.45], mangdang: [116.4, 34.15], zengtou: [116.35, 36.95], dongping: [116.45, 35.92], dongchang: [115.98, 36.45],
    youzhou: [116.4, 39.9], hedong: [113.0, 36.6], huaixi: [114.0, 32.1], runzhou: [119.45, 32.2], hangzhou: [120.15, 30.27],
    muzhou: [119.3, 29.55], qingxi: [118.95, 29.6], liuhe: [120.12, 30.18], liaoerwa: [118.3, 32.3]
  };
  var CEN = [116.1, 35.8], A = 21, POW = 0.55, GX = 76, GY = 54, KX = 0.82;   // a degree of longitude is shorter than one of latitude
  function proj(lon, lat) {
    var dx = (lon - CEN[0]) * KX, dy = -(lat - CEN[1]), r = Math.sqrt(dx * dx + dy * dy);
    if (r === 0) return [GX, GY];
    var rr = A * Math.pow(r, POW);
    return [GX + dx / r * rr, GY + dy / r * rr];
  }
  function unproj(x, y) {   // the longitude and latitude under a tile
    var dx = x - GX, dy = y - GY, rr = Math.sqrt(dx * dx + dy * dy);
    if (rr === 0) return CEN.slice();
    var r = Math.pow(rr / A, 1 / POW);
    return [CEN[0] + dx / rr * r / KX, CEN[1] - dy / rr * r];
  }
  // places too close to read apart are nudged until each icon (3 wide, with a way in below) has its own ground
  var POS = (function () {
    var pos = {}, k;
    for (k in GEO) pos[k] = proj(GEO[k][0], GEO[k][1]);
    var ks = Object.keys(pos);
    for (var it = 0; it < 400; it++) {
      var moved = false;
      for (var i = 0; i < ks.length; i++) for (var j = i + 1; j < ks.length; j++) {
        var a = pos[ks[i]], b = pos[ks[j]], dx = b[0] - a[0], dy = b[1] - a[1];
        if (Math.abs(dx) < 5 && Math.abs(dy) < 4) {
          var d = Math.sqrt(dx * dx + dy * dy) || 0.01;
          a[0] -= dx / d * 0.25; a[1] -= dy / d * 0.25; b[0] += dx / d * 0.25; b[1] += dy / d * 0.25; moved = true;
        }
      }
      if (!moved) break;
    }
    for (k in pos) pos[k] = [Math.round(pos[k][0]), Math.round(pos[k][1])];
    return pos;
  })();
  WM.worldPos = function (id) { return POS[id].slice(); };
  // the tile on the road just below a place, where a traveller stands (story warps to the world map use this)
  WM.worldAt = function (id) { var L = LOC[id], p = L ? [L.x, L.y] : POS[id]; return [p[0], p[1] + (L && L.icon === 'fortress' ? 2 : 1)]; };

  // id, name, icon, target map, spawn x, spawn y
  function loc(id, name, icon, map, sx, sy, o) { var p = POS[id]; LOC[id] = Object.assign({ id: id, name: name, x: p[0], y: p[1], icon: icon, map: map, sx: sx, sy: sy }, o || {}); }
  loc('longhu', 'Dragon-Tiger Mountain', 'temple', 'longhu', 10, 28);
  loc('kaifeng', 'Eastern Capital (Kaifeng)', 'city', 'kaifeng', 20, 38);
  loc('shivillage', 'Shi Family Village', 'village', 'shivillage', 14, 24);
  loc('shaohua', 'Mount Shaohua', 'mountain', 'shaohua', 10, 22);
  loc('weizhou', 'Weizhou', 'town', 'weizhou', 15, 25);
  loc('wutai', 'Mount Wutai', 'temple', 'wutai_town', 12, 22);
  loc('yanmen', 'Yanmen County', 'town', 'yanmen', 12, 20);
  loc('peach', 'Peach Blossom Village', 'village', 'peach', 12, 20);
  loc('waguan', 'Waguan Monastery', 'ruin', 'waguan', 12, 22);
  loc('boarforest', 'Wild Boar Forest', 'forest', 'boarforest', 4, 12);
  loc('chaimanor', 'Chai Jin\'s Manor', 'manor', 'chaimanor', 14, 22);
  loc('cangzhou', 'Cangzhou', 'town', 'cangzhou', 14, 24);
  loc('zhugui', 'Zhu Gui\'s Tavern', 'inn', 'zhugui', 8, 12);
  loc('liangshan', 'Liangshan Marsh', 'fortress', 'liangshan', 20, 30);
  loc('daming', 'Daming Prefecture', 'city', 'daming', 20, 36);
  loc('dongxi', 'East Creek Village', 'village', 'dongxi', 12, 20);
  loc('shijie', 'Shijie Village', 'village', 'shijie', 4, 14);
  loc('huangni', 'Yellow Earth Ridge', 'pass', 'huangni', 4, 14);
  loc('erlong', 'Mount Erlong', 'mountain', 'erlong', 12, 22);
  loc('yuncheng', 'Yuncheng County', 'town', 'yuncheng', 16, 26);
  loc('songfarm', 'Song Family Farm', 'village', 'songfarm', 10, 16);
  loc('jingyang', 'Jingyang Ridge', 'pass', 'jingyang', 4, 18);
  loc('yanggu', 'Yanggu County', 'town', 'yanggu', 16, 26);
  loc('mengzhou', 'Mengzhou', 'town', 'mengzhou', 16, 26);
  loc('crossslope', 'Cross Slope', 'inn', 'crossslope', 8, 12);
  loc('qingfeng', 'Qingfeng Fort', 'fort', 'qingfeng', 14, 24);
  loc('qingzhou', 'Qingzhou', 'city', 'qingzhou', 18, 30);
  loc('jieling', 'Jieling Ridge', 'inn', 'jieling', 8, 14);
  loc('jieyang', 'Jieyang Town', 'town', 'jieyang', 14, 24);
  loc('jiangzhou', 'Jiangzhou', 'city', 'jiangzhou', 20, 34);
  loc('whitedragon', 'White Dragon Temple', 'temple', 'whitedragon', 10, 16);
  loc('wuweijun', 'Wuweijun', 'town', 'wuweijun', 14, 22);
  loc('huandao', 'Huandao Village', 'temple', 'huandao', 10, 18);
  loc('yishui', 'Yishui County', 'village', 'yishui', 12, 20);
  loc('jizhou_n', 'Jizhou of the North', 'city', 'jizhou_n', 18, 30);
  loc('cuiping', 'Cuiping Mountain', 'mountain', 'cuiping', 10, 20);
  loc('erxian', 'Erxian Mountain', 'temple', 'erxian', 10, 22);
  loc('zhujia', 'Zhu Family Village', 'fort', 'zhujia', 4, 24);
  loc('zhuinn', 'Inn below Dulong Ridge', 'inn', 'zhuinn', 0, 14);
  loc('yinma', 'Yinma River', 'mountain', 'yinma', 0, 12);
  loc('wugang', 'Wugang Market', 'village', 'wugang', 0, 10);
  loc('lingzhou', 'Lingzhou', 'city', 'lingzhou', 1, 14);
  loc('taishan', 'Mount Tai', 'temple', 'taishan', 17, 28);
  loc('lijia', 'Li Family Manor', 'manor', 'lijia', 12, 20);
  loc('dengzhou', 'Dengzhou', 'town', 'dengzhou', 14, 24);
  loc('gaotang', 'Gaotang', 'city', 'gaotang', 18, 30);
  loc('huazhou', 'Huazhou', 'city', 'huazhou', 18, 30);
  loc('xiyue', 'Mount Xiyue', 'temple', 'xiyue', 10, 20);
  loc('mangdang', 'Mount Mangdang', 'mountain', 'mangdang', 12, 22);
  loc('zengtou', 'Zengtou City', 'fort', 'zengtou', 4, 20);
  loc('dongping', 'Dongping', 'city', 'dongping', 18, 30);
  loc('dongchang', 'Dongchang', 'city', 'dongchang', 18, 30);
  loc('youzhou', 'Youzhou (Liao)', 'fort', 'youzhou', 14, 22);
  loc('hedong', 'Hedong (Tian Hu)', 'fort', 'hedong', 14, 22);
  loc('huaixi', 'Huaixi (Wang Qing)', 'fort', 'huaixi', 14, 22);
  loc('runzhou', 'Runzhou', 'city', 'runzhou', 18, 30);
  loc('hangzhou', 'Hangzhou', 'city', 'hangzhou', 18, 30);
  loc('muzhou', 'Muzhou', 'fort', 'muzhou', 14, 22);
  loc('qingxi', 'Qingxi (Fang La)', 'fort', 'qingxi', 14, 24);
  loc('liuhe', 'Liuhe Pagoda', 'temple', 'liuhe', 10, 18);
  loc('liaoerwa', 'Liaoerwa', 'marsh', 'liaoerwa', 10, 18);

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
  // rivers and coast in longitude/latitude, projected like everything else
  var RIVERS = {
    // the Yellow River on its late Northern Song course: past Tongguan, north of Kaifeng, east of Daming, into the Bohai
    yellow: [[106.6, 36.1], [108.4, 35.2], [110.3, 34.66], [111.6, 34.8], [113.0, 34.95], [114.3, 35.1], [114.9, 35.55], [115.25, 36.0], [115.6, 36.7], [116.3, 37.6], [117.1, 38.4], [117.7, 38.85]],
    wei: [[106.6, 34.6], [108.0, 34.3], [109.2, 34.45], [110.3, 34.62]],
    huai: [[112.6, 32.9], [114.0, 32.55], [115.5, 32.5], [116.8, 32.85], [118.0, 33.1], [119.2, 33.6], [120.4, 34.15]],
    yangtze: [[106.6, 29.7], [108.4, 30.4], [110.5, 30.75], [112.2, 30.3], [113.1, 29.55], [114.3, 30.6], [115.3, 29.95], [116.0, 29.82], [116.9, 30.45], [118.2, 31.3], [118.8, 32.05], [119.45, 32.3], [120.4, 32.0], [121.3, 31.75]],
    qiantang: [[118.6, 29.65], [119.3, 29.65], [119.8, 29.95], [120.15, 30.2], [120.9, 30.35]]
  };
  // the coastline, north to south: the Bohai gulf, the Shandong peninsula, the Yellow Sea, Hangzhou Bay
  var COAST = [[119.9, 41.5], [119.5, 40.0], [118.6, 39.3], [117.8, 39.0], [117.75, 38.6], [118.3, 38.1], [118.9, 37.6], [119.5, 37.15], [120.1, 37.4], [120.7, 37.95],
    [121.5, 37.6], [122.6, 37.4], [122.5, 36.9], [121.4, 36.75], [120.4, 36.1], [119.6, 35.4], [119.3, 34.7], [120.3, 34.0], [120.9, 32.6], [121.9, 31.75],
    [121.6, 31.05], [121.0, 30.65], [120.4, 30.35], [121.2, 30.1], [122.0, 29.8], [121.7, 28.6], [121.3, 27.4]];
  // mountain country: [lon, lat, radius in degrees]
  var HILLS = [[112.4, 37.3, 1.5], [113.4, 38.7, 0.9], [112.0, 35.4, 0.8], [108.6, 33.8, 1.5], [110.05, 34.25, 0.35], [107.0, 35.0, 0.9],
    [116.4, 40.65, 0.9], [118.0, 40.6, 0.8], [117.1, 36.15, 0.3], [118.05, 35.75, 0.65], [115.6, 31.2, 0.9], [117.3, 28.7, 1.0], [119.2, 29.9, 0.55], [113.6, 33.9, 0.5]];
  WM.world = { W: W, H: H, LOC: LOC, RIVERS: RIVERS, proj: proj, unproj: unproj };

  function inPoly(x, y, pts) {
    var inside = false;
    for (var i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      var xi = pts[i][0], yi = pts[i][1], xj = pts[j][0], yj = pts[j][1];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }

  function build() {
    var g = WM.mapLib.grid(W, H, '.');
    // the land: plains in the middle, pine and steppe to the north, broadleaf and bamboo south of the Yangtze,
    // and mountain country where the real ranges are
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
      var ll = unproj(x, y), lon = ll[0], lat = ll[1];
      var n = vnoise(x, y, 7, 11) * 0.7 + vnoise(x, y, 3, 12) * 0.3;
      var hill = 0;
      HILLS.forEach(function (h) { var d = Math.sqrt(Math.pow((lon - h[0]) * KX, 2) + Math.pow(lat - h[1], 2)) / h[2]; if (d < 1) hill = Math.max(hill, 1 - d); });
      var rough = vnoise(x, y, 4, 21);
      if (hill > 0 && rough + hill * 0.9 > 0.75) g.set(x, y, 'M');
      else if (lat < 30.6) { if (n > 0.58) g.set(x, y, U.hash2(x, y, 5) > 0.55 ? 'b' : 'T'); else if (n > 0.52) g.set(x, y, ','); }
      else if (lat > 38.6) { if (n > 0.62) g.set(x, y, 'P'); else if (n > 0.56) g.set(x, y, ','); }
      else if (lon < 111) { if (n > 0.68) g.set(x, y, 'P'); else if (n > 0.6) g.set(x, y, ','); }
      else if (n > 0.7) g.set(x, y, 'T'); else if (n > 0.64) g.set(x, y, ',');
    }
    // the sea
    var sea = COAST.map(function (q) { return proj(q[0], q[1]); });
    sea.push([W + 20, H + 20], [W + 20, -20]);
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) if (inPoly(x + 0.5, y + 0.5, sea)) g.set(x, y, 'w');
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {   // a band of shallows along the shore
      if (g.get(x, y) !== 'w') continue;
      for (var oy = -1; oy <= 1; oy++) for (var ox = -1; ox <= 1; ox++) { var q = g.get(x + ox, y + oy); if (q && q !== 'w' && q !== '~') { g.set(x, y, '~'); oy = 2; break; } }
    }
    // rivers
    var P = function (pts) { return pts.map(function (q) { return proj(q[0], q[1]); }); };
    polyline(g, P(RIVERS.yellow), '~', 2, 0.8);
    polyline(g, P(RIVERS.wei), '~', 1, 0.5);
    polyline(g, P(RIVERS.huai), '~', 2, 0.6);
    polyline(g, P(RIVERS.yangtze), '~', 3, 0.9);
    polyline(g, P(RIVERS.qiantang), '~', 2, 0.4);
    // Liangshan Marsh: eight hundred li of water round the fortress mountain
    var LS = LOC.liangshan;
    for (y = LS.y - 8; y <= LS.y + 8; y++) for (x = LS.x - 11; x <= LS.x + 11; x++) {
      var dx = (x - LS.x) / 8.5, dy = (y - LS.y) / 6, d = dx * dx + dy * dy + (vnoise(x, y, 3, 31) - 0.5) * 0.35;
      if (d < 1) g.set(x, y, d < 0.72 ? 'w' : U.hash2(x, y, 33) > 0.5 ? 'r' : '~');
    }
    g.rect(LS.x - 2, LS.y - 2, 5, 3, 'M'); g.set(LS.x - 1, LS.y - 3, 'M'); g.set(LS.x + 1, LS.y - 3, 'M');
    // Liaoerwa: the reedy marsh near Chuzhou where the story ends
    var LW = LOC.liaoerwa;
    for (y = LW.y - 3; y <= LW.y + 5; y++) for (x = LW.x - 6; x <= LW.x + 6; x++) { var dd = Math.pow((x - LW.x) / 5, 2) + Math.pow((y - LW.y - 1) / 3.5, 2); if (dd < 1) g.set(x, y, U.hash2(x, y, 41) > 0.45 ? 'r' : '~'); }
    // West Lake, just west of Hangzhou
    var HZ = LOC.hangzhou;
    for (y = HZ.y + 1; y < HZ.y + 4; y++) for (x = HZ.x - 7; x < HZ.x - 3; x++) g.set(x, y, '~');

    // roads between locations (dirt), with bridges over water
    var R = [
      ['kaifeng', 'mengzhou'], ['mengzhou', 'crossslope'], ['mengzhou', 'shivillage'], ['shivillage', 'shaohua'], ['shivillage', 'huazhou'], ['huazhou', 'xiyue'],
      ['shaohua', 'weizhou'], ['weizhou', 'yanmen'], ['yanmen', 'wutai'], ['wutai', 'peach'], ['peach', 'waguan'], ['waguan', 'kaifeng'], ['wutai', 'hedong'],
      ['kaifeng', 'boarforest'], ['boarforest', 'daming'], ['daming', 'gaotang'], ['gaotang', 'chaimanor'], ['chaimanor', 'cangzhou'],
      ['daming', 'huangni'], ['huangni', 'zhugui'], ['huangni', 'jingyang'], ['jingyang', 'yanggu'], ['yanggu', 'yuncheng'], ['yuncheng', 'songfarm'],
      ['yuncheng', 'dongxi'], ['dongxi', 'shijie'], ['songfarm', 'huandao'], ['kaifeng', 'yuncheng'], ['daming', 'dongchang'], ['dongchang', 'zhugui'],
      ['zhujia', 'lijia'], ['lijia', 'yishui'], ['dongping', 'zhujia'], ['dongping', 'zengtou'], ['zengtou', 'cangzhou'], ['dongping', 'qingzhou'],
      ['qingzhou', 'qingfeng'], ['qingzhou', 'erlong'], ['qingzhou', 'kongmanor'], ['qingfeng', 'qingfengshan'], ['erlong', 'dengzhou'], ['yishui', 'qingfeng'], ['shijie', 'mangdang'], ['mangdang', 'liaoerwa'],
      ['kaifeng', 'huaixi'], ['huaixi', 'jieyang'], ['jieyang', 'jieling'], ['jieling', 'jiangzhou'], ['jiangzhou', 'whitedragon'], ['whitedragon', 'wuweijun'],
      ['jiangzhou', 'longhu'], ['liaoerwa', 'runzhou'], ['runzhou', 'hangzhou'], ['hangzhou', 'liuhe'], ['hangzhou', 'muzhou'], ['muzhou', 'qingxi'],
      ['gaotang', 'jizhou_n'], ['jizhou_n', 'cuiping'], ['jizhou_n', 'erxian'], ['jizhou_n', 'youzhou'], ['mangdang', 'jieling'], ['jizhou_n', 'yinma'], ['yinma', 'chaimanor'], ['zhuinn', 'zhujia'], ['zhuinn', 'dongchang'], ['jizhou_n', 'wugang'], ['wugang', 'gaotang'], ['lingzhou', 'daming'], ['lingzhou', 'zengtou'], ['taishan', 'dongping']
    ];
    // the ground each place's buildings will stand on: a road steps round it rather than under a wall
    var FP = {};
    for (var fid in LOC) if (LOC[fid].icon !== 'fortress') for (var fy = -1; fy <= 0; fy++) for (var fx = -1; fx <= 1; fx++) FP[(LOC[fid].x + fx) + ',' + (LOC[fid].y + fy)] = 1;
    // Only the roads that lead somewhere the traveller knows: a road out to a place not yet heard of is left
    // off, unless it runs on through that place to somewhere known (pruned from the dead ends inwards).
    var known = function (id) { return S.has('loc:' + id) && (!LOC[id].cond || LOC[id].cond(S)); };
    var live = R.filter(function (r) { return LOC[r[0]] && LOC[r[1]]; }), pruned = true;
    while (pruned) {
      pruned = false;
      var deg = {}; live.forEach(function (r) { deg[r[0]] = (deg[r[0]] || 0) + 1; deg[r[1]] = (deg[r[1]] || 0) + 1; });
      live = live.filter(function (r) { var dead = (!known(r[0]) && deg[r[0]] < 2) || (!known(r[1]) && deg[r[1]] < 2); if (dead) pruned = true; return !dead; });
    }
    // Each road follows the lie of the land (round hills, across rivers by the shortest bridge) and joins a road
    // already laid where it can, so roads meet and share a way rather than running side by side.
    var cost = function (x, y) {
      if (FP[x + ',' + y]) return Infinity;
      var c = g.get(x, y);
      if (c === ':' || c === 'B') return 1;
      var dl = (x - LS.x) / 8.5, dm = (y - LS.y) / 6; if (dl * dl + dm * dm < 1.1) return Infinity;   // the marsh is crossed by boat
      var k = c === 'w' ? 60 : c === '~' || c === 'r' ? 14 : c === 'M' ? 9 : c === 'T' || c === 'P' || c === 'b' ? 4 : 3;
      for (var d = 0; d < 4; d++) { var n = g.get(x + [1, -1, 0, 0][d], y + [0, 0, 1, -1][d]); if (n === ':' || n === 'B') { k += 3; break; } }   // never a road hugging a road
      return k;
    };
    var route = function (x0, y0, x1, y1) {
      var L2 = Math.max(1, Math.hypot(x1 - x0, y1 - y0)), off = function (px, py) { return Math.abs((px - x0) * (y1 - y0) - (py - y0) * (x1 - x0)) / L2; };
      var N = W * H, dist = new Float64Array(N).fill(Infinity), prev = new Int32Array(N).fill(-1), heap = [];
      var push = function (i, f) { heap.push([f, i]); var j = heap.length - 1; while (j > 0) { var p = (j - 1) >> 1; if (heap[p][0] <= heap[j][0]) break; var t = heap[p]; heap[p] = heap[j]; heap[j] = t; j = p; } };
      var pop = function () { var top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; var j = 0; for (;;) { var l = 2 * j + 1, r2 = l + 1, m2 = j; if (l < heap.length && heap[l][0] < heap[m2][0]) m2 = l; if (r2 < heap.length && heap[r2][0] < heap[m2][0]) m2 = r2; if (m2 === j) break; var t = heap[m2]; heap[m2] = heap[j]; heap[j] = t; j = m2; } } return top; };
      var s0 = y0 * W + x0, goal = y1 * W + x1; dist[s0] = 0; push(s0, 0);
      while (heap.length) {
        var it = pop(), i = it[1]; if (i === goal) break;
        if (it[0] > dist[i] + Math.abs(i % W - x1) + Math.abs((i / W | 0) - y1)) continue;
        var cx = i % W, cy = i / W | 0;
        for (var d = 0; d < 4; d++) {
          var nx = cx + [1, -1, 0, 0][d], ny = cy + [0, 0, 1, -1][d]; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
          var j = ny * W + nx, k = j === goal ? 1 : cost(nx, ny); if (k === Infinity) continue;
          k += off(nx, ny) * 0.35;   // keep near the straight way between the two places
          if (dist[i] + k < dist[j]) { dist[j] = dist[i] + k; prev[j] = i; push(j, dist[j] + Math.abs(nx - x1) + Math.abs(ny - y1)); }
        }
      }
      if (prev[goal] < 0 && goal !== s0) return null;
      var out = []; for (var q = goal; q >= 0; q = prev[q]) out.push([q % W, q / W | 0]); return out;
    };
    var under = {};   // what each road tile was laid over
    var roadSteps = function (x0, y0, x1, y1) {   // walking only on road already laid
      var isR = function (x, y) { var c = g.get(x, y); return c === ':' || c === 'B'; };
      if (!isR(x0, y0) || !isR(x1, y1)) return Infinity;
      var seen = {}, q = [[x0, y0, 0]]; seen[x0 + ',' + y0] = 1;
      for (var h = 0; h < q.length; h++) {
        var p = q[h]; if (p[0] === x1 && p[1] === y1) return p[2];
        for (var d = 0; d < 4; d++) { var nx = p[0] + [1, -1, 0, 0][d], ny = p[1] + [0, 0, 1, -1][d], k = nx + ',' + ny; if (!seen[k] && isR(nx, ny)) { seen[k] = 1; q.push([nx, ny, p[2] + 1]); } }
      }
      return Infinity;
    };
    live.map(function (r) { var a = LOC[r[0]], b = LOC[r[1]]; return { a: a, b: b, d: Math.abs(a.x - b.x) + Math.abs(a.y - b.y) }; })
      .sort(function (p, q) { return p.d - q.d; })   // the short local roads first, so the long ones can join them
      .forEach(function (rd) {
        // two places already joined by roads that don't go far out of the way need no road of their own (no loops)
        var bySoFar = roadSteps(rd.a.x, rd.a.y + 1, rd.b.x, rd.b.y + 1);
        if (bySoFar <= rd.d * 1.7 + 4) return;
        var path = route(rd.a.x, rd.a.y + 1, rd.b.x, rd.b.y + 1);
        if (!path) return;
        path.forEach(function (p) { var c = g.get(p[0], p[1]), k = p[0] + ',' + p[1]; if (!(k in under)) under[k] = c; if (c === '~' || c === 'w' || c === 'r') g.set(p[0], p[1], 'B'); else if (c !== 'B') g.set(p[0], p[1], ':'); });
      });
    // no road that stops in the middle of nowhere: cut back every loose end that isn't at a known place's door
    var door = {}; for (var did in LOC) if (known(did)) door[LOC[did].x + ',' + (LOC[did].y + 1)] = 1;
    var isRd = function (x, y) { var c = g.get(x, y); return c === ':' || c === 'B'; };
    for (var cut = true; cut;) {
      cut = false;
      for (var uk in under) {
        var xy = uk.split(','), ux = +xy[0], uy = +xy[1];
        if (!isRd(ux, uy) || door[uk]) continue;
        var nb = 0; for (var d4 = 0; d4 < 4; d4++) if (isRd(ux + [1, -1, 0, 0][d4], uy + [0, 0, 1, -1][d4])) nb++;
        if (nb < 2) { g.set(ux, uy, under[uk]); cut = true; }
      }
    }
    // keep the marsh roads from crossing the whole marsh: Liangshan is reached by boat from Zhu Gui's tavern
    for (y = LS.y - 8; y <= LS.y + 8; y++) for (x = LS.x - 11; x <= LS.x + 11; x++) if (g.get(x, y) === 'B' || g.get(x, y) === ':') { var dx2 = (x - LS.x) / 8.5, dy2 = (y - LS.y) / 6; if (dx2 * dx2 + dy2 * dy2 < 0.9) g.set(x, y, 'w'); }

    // every place's doorstep is open ground, known or not, so anyone leaving it steps out onto the land
    for (var aid in LOC) {
      var A2 = LOC[aid]; if (A2.icon === 'fortress') continue;
      var at = g.get(A2.x, A2.y + 1);
      if (known(aid) && at !== ':' && at !== 'B' && WM.tiles.solid(at)) g.set(A2.x, A2.y + 1, WM.tiles.isWaterChar(at) ? 'B' : ':');   // a place not yet known keeps its ground as it is
    }
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
      // a ruined monastery: the hall's roof half fallen in, one wall a heap of rubble, a dead tree in the yard
      else if (ic === 'ruin') { g.set(lx - 1, ly - 1, 'v'); g.set(lx, ly - 1, 'v'); g.set(lx + 1, ly - 1, 'e'); g.set(lx - 1, ly, 'R'); g.set(lx, ly, 'D'); g.set(lx + 1, ly, 'm'); }
      // a ridge: two peaks with the road through the gap between them, and a wine-shop flag at the roadside
      else if (ic === 'pass') { g.set(lx - 1, ly - 1, 'M'); g.set(lx + 1, ly - 1, 'M'); g.set(lx - 1, ly, 'M'); g.set(lx, ly - 1, ':'); g.set(lx, ly, ':'); g.set(lx + 1, ly, 'J'); }
      else if (ic === 'forest' || ic === 'marsh') { g.set(lx, ly, ':'); g.set(lx, ly - 1, ic === 'forest' ? 'T' : ic === 'marsh' ? 'r' : 'm'); }
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
      if (!WM.data.maps[LOC[id].map]) continue;   // campaign sites fought as wars only (Youzhou, Hedong, Huaixi, Runzhou, Muzhou)
      (function (L) {
        var md = WM.data.maps[L.map], sp = (md && (md.entry || md.spawn)) || [L.sx, L.sy];
        var ex = { x: L.x, y: L.y + (L.icon === 'fortress' ? 1 : 0), to: L.map, tx: sp[0], ty: sp[1], dir: 'up', passable: true,
          cond: function (S2) { return S2.has('loc:' + L.id) && WM.data.maps[L.map]; },
          blocked: function (S2) { return { text: S2.has('loc:' + L.id) ? L.name + '. (Not yet passable.)' : L.name + '. There is no reason to go there now.' }; } };
        out.push(ex);
      })(LOC[id]);
    }
    return out;
  }

  WM.defMap('world', {
    name: '', world: true, theme: 'world', music: 'world',
    cacheKey: function () { return Object.keys(LOC).filter(function (id) { return S.has('loc:' + id) && (!LOC[id].cond || LOC[id].cond(S)); }).join(','); },   // the places shown, and so the roads drawn
    rows: build,
    get exits() { return exits(); },
    battleBg: 'plains',
    encounters: {
      rate: 0.05,
      troops: function (S2) {
        // the roads grow more dangerous as the story goes on, but never far beyond the party that walks them
        var T = WM.data.worldTroops, n = Math.min(9, Math.floor(WM.state.chapter / 2.5)), lv = WM.S.partyAvgLv();
        var top = function (k) { return Math.max.apply(null, T['world' + k].reduce(function (a, t) { return a.concat(t); }, []).map(function (id) { return WM.data.enemies[id].lv; })); };
        while (n > 0 && top(n) > lv + 2) n--;
        return T['world' + n];
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
