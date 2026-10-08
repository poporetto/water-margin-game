// On-screen controls for phones and tablets: an 8-way D-pad, A (confirm), B (cancel), Menu, Dash, and L/R page
// buttons. They appear the first time the screen is touched (or at once on a touch-only device), and the canvas is
// laid out around them: in portrait the game sits at the top with the pad below; in landscape the pad and buttons sit
// in the bars beside the game, or over its lower corners when the screen is too narrow for bars.
'use strict';
(function () {
  var I = WM.input;
  if (typeof document === 'undefined' || !document.addEventListener) { WM.touch = { on: false, enable: function () {} }; return; }   // headless tools
  var T = WM.touch = { on: false };
  var root, pad, knob;

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }

  function build() {
    root = el('div', 'tc'); root.id = 'touch';
    pad = el('div', 'tc-pad'); knob = el('div', 'tc-knob'); pad.appendChild(knob);
    ['up', 'down', 'left', 'right'].forEach(function (d) { pad.appendChild(el('div', 'tc-arrow tc-' + d)); });
    root.appendChild(pad);
    var btns = el('div', 'tc-btns');
    [['ok', 'A', 'tc-a'], ['cancel', 'B', 'tc-b'], ['dash', 'Dash', 'tc-dash'], ['menu', 'Menu', 'tc-menu'], ['pageL', 'L', 'tc-l'], ['pageR', 'R', 'tc-r']].forEach(function (b) {
      var e = el('div', 'tc-btn ' + b[2], b[1]); e.dataset.btn = b[0]; btns.appendChild(e);
    });
    root.appendChild(btns);
    document.body.appendChild(root);
    bindPad(); bindButtons(btns);
  }

  // ---------- the D-pad: slide your thumb anywhere over it; 8 directions ----------
  function bindPad() {
    var id = null, dirs = {};
    function setDirs(nd) {
      ['up', 'down', 'left', 'right'].forEach(function (d) {
        if (nd[d] && !dirs[d]) I.press(d, 'touch');
        else if (!nd[d] && dirs[d]) I.release(d);
      });
      dirs = nd;
    }
    function move(t) {
      var r = pad.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var dx = t.clientX - cx, dy = t.clientY - cy, dist = Math.sqrt(dx * dx + dy * dy), dead = r.width * 0.12;
      var lim = r.width * 0.32, k = dist > lim ? lim / dist : 1;
      knob.style.transform = 'translate(' + (dx * k) + 'px,' + (dy * k) + 'px)';
      if (dist < dead) return setDirs({});
      var a = Math.atan2(dy, dx), oct = Math.round(a / (Math.PI / 4));   // -4..4, 0 = right
      var nd = {};
      if (oct === 0) nd.right = 1; else if (oct === 1) { nd.right = 1; nd.down = 1; } else if (oct === 2) nd.down = 1;
      else if (oct === 3) { nd.down = 1; nd.left = 1; } else if (oct === 4 || oct === -4) nd.left = 1;
      else if (oct === -3) { nd.left = 1; nd.up = 1; } else if (oct === -2) nd.up = 1; else if (oct === -1) { nd.up = 1; nd.right = 1; }
      setDirs(nd);
    }
    function end() { id = null; knob.style.transform = ''; setDirs({}); }
    pad.addEventListener('touchstart', function (e) { e.preventDefault(); var t = e.changedTouches[0]; id = t.identifier; move(t); }, { passive: false });
    pad.addEventListener('touchmove', function (e) { e.preventDefault(); for (var i = 0; i < e.changedTouches.length; i++) if (e.changedTouches[i].identifier === id) move(e.changedTouches[i]); }, { passive: false });
    ['touchend', 'touchcancel'].forEach(function (ev) {
      pad.addEventListener(ev, function (e) { e.preventDefault(); for (var i = 0; i < e.changedTouches.length; i++) if (e.changedTouches[i].identifier === id) end(); }, { passive: false });
    });
  }

  // ---------- buttons (multi-touch: hold Dash with one thumb while steering with the other) ----------
  function bindButtons(box) {
    box.querySelectorAll('.tc-btn').forEach(function (b) {
      var name = b.dataset.btn;
      b.addEventListener('touchstart', function (e) { e.preventDefault(); b.classList.add('on'); I.press(name, 'touch'); if (navigator.vibrate) navigator.vibrate(8); }, { passive: false });
      ['touchend', 'touchcancel'].forEach(function (ev) { b.addEventListener(ev, function (e) { e.preventDefault(); b.classList.remove('on'); I.release(name); }, { passive: false }); });
    });
  }

  T.enable = function () {
    if (T.on) return;
    T.on = true;
    if (!root) build();
    document.body.classList.add('touch');
    I.lastDevice = 'touch';
    if (WM.fit) WM.fit();
  };
  // a real keyboard press hides nothing — but a touch shows the controls
  window.addEventListener('touchstart', function () { T.enable(); WM.audio && WM.audio.unlock(); }, { passive: true });
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('DOMContentLoaded', T.enable);
    if (document.readyState !== 'loading') setTimeout(T.enable, 0);
  }
  // stop the page from scrolling, bouncing or zooming under the player's thumbs
  document.addEventListener('touchmove', function (e) { if (T.on) e.preventDefault(); }, { passive: false });
  document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
  document.addEventListener('dblclick', function (e) { e.preventDefault(); });
})();
