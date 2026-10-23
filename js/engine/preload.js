// Background loading: painted portraits are large downloads, fetched on first use. Played from a web server, that
// meant a pause the first time anyone spoke. So while the game is played, this fetches ahead, a couple at a time: the
// portraits of everyone a scene on this map (or a map one or two doors away) names, the party's own, the opening of
// the next chapter, and the painted battle backdrop for where you are. A line of dialogue then finds its portrait
// already there.
'use strict';
(function () {
  var P = WM.preload = { MAX: 2, busy: 0, queue: [], seen: {}, loaded: {} };
  var PT = function () { return WM.portraits; };

  // every quoted id in a function's source that names a portrait sheet: speakers, spawns, keepers kept in a variable
  var ID = /'([a-z][a-z0-9_]*)(?::[a-z]+)?'/g, WARP = /warp\(\s*'([a-z0-9_]+)'/g;
  var cache = {};
  function scanMap(id) {
    if (cache[id]) return cache[id];
    var faces = {}, maps = {};
    var add = function (src) {
      var m; ID.lastIndex = 0;
      while ((m = ID.exec(src))) faces[m[1]] = true;
      WARP.lastIndex = 0;
      while ((m = WARP.exec(src))) maps[m[1]] = true;
    };
    (WM.data.events[id] || []).forEach(function (ev) {
      if (ev.npc) faces[ev.npc] = true;
      if (ev.run) add(String(ev.run));
      if (ev.idle) Object.keys(ev.idle).forEach(function (k) { faces[k] = true; });
    });
    var def = WM.data.maps[id];
    // (not through the world map: every town is one step from it, so it is never a way to somewhere near)
    if (!def || !def.world) (def && def.exits || []).forEach(function (x) { if (x.to) maps[x.to] = true; });
    Object.keys(maps).forEach(function (m) { var d = WM.data.maps[m]; if (!d || d.world) delete maps[m]; });
    return (cache[id] = { faces: Object.keys(faces), maps: Object.keys(maps), bg: def && def.battleBg });
  }

  function want(id) {
    var pt = PT(); if (!pt || !id) return;
    id = pt.resolveId(id);
    if (P.seen[id]) return;
    var spec = pt.sheetSpec(id);
    if (!spec || pt.sheetSettled[id]) return;
    P.seen[id] = true;
    P.queue.push({ url: pt.sheetUrl(id, spec), done: function () { pt.tryExpressionSheet(id, spec); } });
  }
  function wantBg(type) {
    var names = (WM.battle && WM.battle.backgroundStatus) ? WM.battle.backgroundStatus().map(function (b) { return b.name; }) : [];
    if (!type || names.indexOf(type) < 0 || P.seen['bg:' + type]) return;
    P.seen['bg:' + type] = true;
    P.queue.push({ url: WM.battle.backgroundRoot + type + WM.battle.backgroundExt });
  }

  // one at a time per slot; each finished download is kept (so the browser serves it again from memory) and the
  // portrait sheet is cut into its expressions there and then, not in the middle of a scene
  function pump() {
    while (P.busy < P.MAX && P.queue.length) {
      var job = P.queue.shift(), img = new Image();
      P.busy++;
      img.onload = img.onerror = (function (job, img) {
        return function (e) {
          P.busy--;
          if (e.type === 'load') { P.loaded[job.url] = img; if (job.done) job.done(); }
          setTimeout(pump, 30);
        };
      })(job, img);
      img.src = job.url;
    }
  }

  var lastKey = '';
  P.tick = function () {
    var S = WM.state;
    if (!S || !S.map || !WM.data.events) return;
    var key = S.map + '|' + (S.party || []).join(',') + '|' + S.chapter;
    if (key === lastKey) return;
    lastKey = key;
    // nearest first: the party, this map, then the maps it leads to, then theirs
    (S.party || []).forEach(want);
    var here = scanMap(S.map), ring = here.maps.slice(), next = [];
    here.faces.forEach(want); wantBg(here.bg);
    ring.forEach(function (m) { var r = scanMap(m); r.faces.forEach(want); r.maps.forEach(function (n) { if (n !== S.map) next.push(n); }); });
    var ch = WM.data.chapters && WM.data.chapters[(S.chapter || 0) + 1];
    if (ch && ch.begin) { ID.lastIndex = 0; var m, src = String(ch.begin); while ((m = ID.exec(src))) want(m[1]); }
    next.forEach(function (m) { scanMap(m).faces.forEach(want); });
    ring.forEach(function (m) { wantBg(scanMap(m).bg); });
    pump();
  };
  var timer = setInterval(function () { try { P.tick(); } catch (e) { if (window.console) console.warn('preload', e); } }, 700);
  if (timer && timer.unref) timer.unref();   // (the headless tools in Node must still be able to finish)
})();
