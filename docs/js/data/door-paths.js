// Every house is reached by a path: from each door on an outdoor map, a beaten-earth path as wide as the door runs to
// the nearest road, by the shortest way with the fewest turns, clearing the trees, bamboo and rocks on its line and
// just before the door; and lanterns are kept to streets and gateways. Runs after the maps are registered (and after doors are centred, where that pass is loaded).
'use strict';
(function () {
  var maps = WM.data.maps;
  var ROAD = ':=BG';                 // a road, paving, a bridge or a gateway
  var ON_ROAD = ROAD + '3LI';        // and what stands on one (a censer, a lantern, a notice board) without breaking it
  var CARVE = '.,f:TPbem';           // ground a path may be laid across (trees and rocks on it are cleared)
  var CLEAR = 'TPbem';               // what is cleared (never the story's willows and white poplars)
  var MAX = 30;                      // a house further than this from any road keeps its own doorstep
  var is = function (set, ch) { return !!ch && set.indexOf(ch) >= 0; };
  Object.keys(maps).forEach(function (id) {
    var def = maps[id];
    if (def.interior || def.world || !Array.isArray(def.rows)) return;
    var rows = def.rows.map(function (r) { return r.split(''); }), h = rows.length;
    var get = function (x, y) { var r = rows[y]; if (!r || x < 0 || x >= r.length) return null; return r[x] === ' ' ? (def.fill || '.') : r[x]; };
    var events = {}; (WM.data.events[id] || []).forEach(function (e) { if (typeof e.x === 'number' && (e.npc || e.char)) events[e.x + ',' + e.y] = true; });
    // the road network: runs of road too long to be a doorstep (a door's own apron does not count)
    var comp = {}, n = 0, size = [];
    for (var y = 0; y < h; y++) for (var x = 0; x < rows[y].length; x++) {
      if (comp[x + ',' + y] != null || !is(ON_ROAD, get(x, y))) continue;
      var q = [[x, y]], c = 0; comp[x + ',' + y] = n;
      while (q.length) { var p = q.pop(); c++; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var k = (p[0] + d[0]) + ',' + (p[1] + d[1]); if (comp[k] == null && is(ON_ROAD, get(p[0] + d[0], p[1] + d[1]))) { comp[k] = n; q.push([p[0] + d[0], p[1] + d[1]]); } }); }
      size.push(c); n++;
    }
    var isRoad = function (x, y) { var k = comp[x + ',' + y]; return k != null && size[k] > 6 && is(ROAD, get(x, y)); };
    var changed = false;
    // a cheapest path (each step 1, a turn 0.5, a tree 1 more) from (sx, sy) to the road network
    function route(sx, sy) {
      var best = {}, open = [[0, sx, sy, -1, null]];
      best[sx + ',' + sy + ',-1'] = 0;
      while (open.length) {
        open.sort(function (a, b) { return a[0] - b[0]; });
        var cur = open.shift(), cost = cur[0], x = cur[1], y = cur[2], dir = cur[3];
        if (isRoad(x, y)) { var out = []; for (var s = cur; s; s = s[4]) out.push([s[1], s[2]]); return out; }
        if (cost > MAX) return null;
        [[0, 1], [1, 0], [-1, 0], [0, -1]].forEach(function (d, i) {
          var nx = x + d[0], ny = y + d[1], ch = get(nx, ny);
          if (ch == null || (!isRoad(nx, ny) && (!is(CARVE, ch) || events[nx + ',' + ny]))) return;
          var nc = cost + 1 + (dir >= 0 && dir !== i ? 0.5 : 0) + (is(CLEAR, ch) ? 1 : 0), k = nx + ',' + ny + ',' + i;
          if (best[k] != null && best[k] <= nc) return;
          best[k] = nc; open.push([nc, nx, ny, i, cur]);
        });
      }
      return null;
    }
    for (y = 0; y < h; y++) for (x = 0; x < rows[y].length; x++) {
      if (!is('Dd', get(x, y)) || get(x - 1, y) === get(x, y)) continue;   // the left tile of each door
      var w = 1; while (get(x + w, y) === get(x, y)) w++;
      if (!is('WOR', get(x - 1, y)) && !is('WOR', get(x + w, y))) continue;   // a house front only
      // clear the trees and rocks just before the door
      for (var yy = y + 1; yy <= y + 2; yy++) for (var xx = x - 1; xx <= x + w; xx++) if (is(CLEAR, get(xx, yy))) { rows[yy][xx] = '.'; changed = true; }
      // a path from each door tile, so a double door has a path two wide, even on both sides
      for (var i = 0; i < w; i++) {
        var sx = x + i, sy = y + 1, st = get(sx, sy);
        if (!is(CARVE, st) && !isRoad(sx, sy)) continue;
        var path = route(sx, sy);
        if (!path) continue;
        path.forEach(function (p) { if (!isRoad(p[0], p[1])) { rows[p[1]][p[0]] = ':'; changed = true; } });
      }
    }
    // Where a dirt road crosses a paved street, the paving runs on through the crossing.
    for (y = 0; y < h; y++) for (x = 0; x < rows[y].length; x++) {
      if (get(x, y) !== ':') continue;
      if ((get(x, y - 1) === '=' && get(x, y + 1) === '=') || (get(x - 1, y) === '=' && get(x + 1, y) === '=')) { rows[y][x] = '='; changed = true; }
    }
    // A lantern stands along a street or beside a gateway; one pressed against the side of an ordinary house (its roof
    // or plaster wall) looks dropped there at random, and goes. (Red gate walls and stone city walls keep theirs.)
    for (y = 0; y < h; y++) for (x = 0; x < rows[y].length; x++) {
      if (get(x, y) !== 'L' || !(is('WO^vzZ', get(x - 1, y)) || is('WO^vzZ', get(x + 1, y)))) continue;
      if (def.keepFlankingLanterns) {   // (a map that says so keeps the lanterns that face each other across a street)
        var across = false;
        for (var dd = -8; dd <= 8 && !across; dd++) if (dd && get(x + dd, y) === 'L' && is(':=', get(x + (dd > 0 ? 1 : -1), y))) across = true;
        if (across) continue;
      }
      rows[y][x] = [get(x, y + 1), get(x - 1, y), get(x + 1, y)].indexOf('=') >= 0 ? '=' : '.'; changed = true;
    }
    if (changed) { def.rows = rows.map(function (r) { return r.join(''); }); delete def._baked; }
  });
})();
