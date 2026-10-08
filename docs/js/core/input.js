// Keyboard + gamepad input. Logical buttons: up down left right ok cancel menu dash.
'use strict';
(function () {
  var KEYMAP = {
    ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
    ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
    KeyZ: 'ok', Enter: 'ok', Space: 'ok', NumpadEnter: 'ok',
    KeyX: 'cancel', Escape: 'cancel', Backspace: 'cancel',
    KeyC: 'menu', Tab: 'menu',
    ShiftLeft: 'dash', ShiftRight: 'dash',
    KeyQ: 'pageL', KeyE: 'pageR',
    F2: 'debug'
  };
  var held = {}, pressed = {}, repeatT = {};
  var REPEAT_DELAY = 0.32, REPEAT_RATE = 0.075;

  var I = WM.input = {
    held: held,
    // pressed(): true on the frame a button goes down (or auto-repeats for directions).
    pressed: function (b) { return !!pressed[b]; },
    down: function (b) { return !!held[b]; },
    consume: function (b) { pressed[b] = false; },
    clear: function () { for (var k in pressed) pressed[k] = false; },
    anyOk: function () { return pressed.ok || pressed.cancel; },
    lastDevice: 'keyboard'
  };

  function press(b) {
    if (!held[b]) { pressed[b] = true; repeatT[b] = REPEAT_DELAY; }
    held[b] = true;
    WM.audio && WM.audio.unlock();
  }
  function release(b) { held[b] = false; }
  I.press = function (b, device) { press(b); if (device) I.lastDevice = device; };   // used by the touch controls
  I.release = release;

  window.addEventListener('keydown', function (e) {
    var b = KEYMAP[e.code];
    if (!b) return;
    e.preventDefault();
    if (e.repeat) return;
    press(b);
    I.lastDevice = 'keyboard';
  });
  window.addEventListener('keyup', function (e) {
    var b = KEYMAP[e.code];
    if (!b) return;
    e.preventDefault();
    release(b);
  });
  window.addEventListener('blur', function () { for (var k in held) held[k] = false; });

  // Gamepad (standard mapping): A=ok, B=cancel, Y/Start=menu, X/RB=dash
  var padPrev = {};
  function pollPad() {
    if (!navigator.getGamepads) return;
    var pads = navigator.getGamepads();
    var p = null;
    for (var i = 0; i < pads.length; i++) if (pads[i]) { p = pads[i]; break; }
    if (!p) return;
    var st = {
      up: (p.buttons[12] && p.buttons[12].pressed) || p.axes[1] < -0.5,
      down: (p.buttons[13] && p.buttons[13].pressed) || p.axes[1] > 0.5,
      left: (p.buttons[14] && p.buttons[14].pressed) || p.axes[0] < -0.5,
      right: (p.buttons[15] && p.buttons[15].pressed) || p.axes[0] > 0.5,
      ok: p.buttons[0] && p.buttons[0].pressed,
      cancel: p.buttons[1] && p.buttons[1].pressed,
      menu: (p.buttons[3] && p.buttons[3].pressed) || (p.buttons[9] && p.buttons[9].pressed),
      dash: (p.buttons[2] && p.buttons[2].pressed) || (p.buttons[5] && p.buttons[5].pressed),
      pageL: p.buttons[4] && p.buttons[4].pressed,
      pageR: p.buttons[5] && p.buttons[5].pressed
    };
    for (var k in st) {
      if (st[k] && !padPrev[k]) { press(k); I.lastDevice = 'pad'; }
      else if (!st[k] && padPrev[k]) release(k);
      padPrev[k] = st[k];
    }
  }

  // Called once per frame after the game update.
  I.endFrame = function (dt) {
    for (var k in pressed) pressed[k] = false;
    var dirs = ['up', 'down', 'left', 'right'];
    for (var i = 0; i < dirs.length; i++) {
      var d = dirs[i];
      if (held[d]) {
        repeatT[d] -= dt;
        if (repeatT[d] <= 0) { pressed[d] = true; repeatT[d] = REPEAT_RATE; }
      }
    }
  };
  I.beginFrame = function () { pollPad(); };
})();
