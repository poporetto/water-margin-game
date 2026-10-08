// Main loop and scene management.
'use strict';
(function () {
  var G = WM.gfx, I = WM.input;
  WM.time = 0;
  var scene = null;

  WM.scenes = WM.scenes || {};
  WM.setScene = function (s, arg, noEnter) {
    if (scene && scene.exit && !noEnter) scene.exit();
    scene = s;
    WM.scene = s;
    if (s.enter && !noEnter) s.enter(arg);
  };

  // Promise helpers for fades used by scripts and transitions.
  var tweens = [];
  WM.tween = function (dur, fn) {
    return new Promise(function (res) { tweens.push({ t: 0, dur: dur, fn: fn, res: res }); });
  };
  WM.fadeOut = function (dur, col) { G.fadeColor = col || '#000'; var f0 = G.fade; return WM.tween(dur == null ? 0.35 : dur, function (k) { G.fade = f0 + (1 - f0) * k; }); };
  WM.fadeIn = function (dur) { var f0 = G.fade; return WM.tween(dur == null ? 0.35 : dur, function (k) { G.fade = f0 * (1 - k); }); };
  WM.wait = function (sec) { return WM.tween(sec, function () {}); };

  var last = 0, acc = 0;
  function frame(ts) {
    requestAnimationFrame(frame);
    var now = ts / 1000;
    var dt = Math.min(0.05, now - (last || now));
    last = now;
    step(dt);
  }
  // One simulation + render step; exposed for automated testing (WM.step).
  function step(dt) {
    WM.time += dt;
    I.beginFrame();
    // tweens
    for (var i = tweens.length - 1; i >= 0; i--) {
      var tw = tweens[i]; tw.t += dt;
      var k = Math.min(1, tw.t / tw.dur);
      tw.fn(k);
      if (k >= 1) { tweens.splice(i, 1); tw.res(); }
    }
    if (G.shake > 0) G.shake = Math.max(0, G.shake - dt * 8);
    if (G.flash > 0) G.flash = Math.max(0, G.flash - dt * 3);
    if (WM.state && scene && scene.countsTime) WM.state.playtime += dt;
    try {
      if (WM.ui.busy()) WM.ui.update(dt);
      else if (scene && scene.update) scene.update(dt);
      if (WM.ui.busy() && scene && scene.updateBackground) scene.updateBackground(dt);
      G.ctx.setTransform(1, 0, 0, 1, 0, 0);
      if (scene && scene.draw) scene.draw();
      WM.ui.draw();
      WM.ui.drawToasts(dt);
      G.overlay();
      if (WM.debug && WM.debug.draw) WM.debug.draw();
    } catch (e) {
      console.error(e);
      WM.lastError = e;
      G.ctx.fillStyle = '#400'; G.ctx.fillRect(0, WM.H - 40, WM.W, 40);
      G.text('Error: ' + e.message, 10, WM.H - 32, { size: 18 });
    }
    I.endFrame(dt);
  }
  WM.step = function (dt, n) { for (var i = 0; i < (n || 1); i++) step(dt || 1 / 60); };

  WM.boot = function () {
    var cv = document.getElementById('game');
    G.init(cv);
    // Fit the 4:3 canvas to the window. With touch controls on: in portrait the game sits at the top and the pad goes
    // below it; in landscape the pad and buttons sit in the side bars (or over the game's lower corners if there is
    // no room for bars).
    function fit() {
      var vw = window.innerWidth, vh = window.innerHeight, b = document.body, w;
      b.classList.remove('portrait', 'landscape', 'overlay');
      if (!(WM.touch && WM.touch.on)) w = Math.min(vw, vh * 4 / 3);
      else if (vh > vw) {
        b.classList.add('portrait');
        w = Math.min(vw, (vh - Math.max(230, vw * 0.62)) * 4 / 3);
      } else {
        b.classList.add('landscape');
        var side = Math.min(200, vw * 0.215);
        w = Math.min(vw - 2 * side, vh * 4 / 3);
        if (w < vh * 4 / 3 * 0.8) { w = Math.min(vw, vh * 4 / 3); b.classList.add('overlay'); }
      }
      w = Math.max(160, Math.floor(w));
      cv.style.width = w + 'px';
      cv.style.height = Math.floor(w * 3 / 4) + 'px';
    }
    WM.fit = fit;
    window.addEventListener('resize', fit); window.addEventListener('orientationchange', function () { setTimeout(fit, 200); }); fit();
    // optional art overrides listed in assets/manifest.js
    var man = WM.ASSETS || {};
    (man.portraits || []).forEach(function (id) { WM.portraits.tryOverride(id); });
    (man.sprites || []).forEach(function (id) { WM.sprites.tryOverride(id); });
    if (WM.validateData) WM.validateData();
    WM.setScene(WM.scenes.title);
    requestAnimationFrame(frame);
  };
})();
