// WebAudio synth: pentatonic music written in jianpu (numbered notation) + procedural SFX.
// Instruments approximate dizi and xiao (flutes), guzheng, guqin, pipa and ruan (plucked), erhu (bowed), sheng (mouth
// organ), bells, wooden fish, clapper, drums and gong.
'use strict';
(function () {
  var A = WM.audio = { musicVol: 0.55, sfxVol: 0.7, current: null, enabled: true };
  var ctx = null, master = null, musicBus = null, sfxBus = null, noiseBuf = null;

  A.unlock = function () {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0.8; master.connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.gain.value = A.musicVol; musicBus.connect(master);
    sfxBus = ctx.createGain(); sfxBus.gain.value = A.sfxVol; sfxBus.connect(master);
    // gentle room reverb on music
    var conv = ctx.createConvolver();
    var len = ctx.sampleRate * 1.6, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var ch = 0; ch < 2; ch++) { var d = ir.getChannelData(ch); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    conv.buffer = ir;
    var wet = ctx.createGain(); wet.gain.value = 0.22;
    musicBus.connect(conv); conv.connect(wet); wet.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    var nd = noiseBuf.getChannelData(0); for (i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    if (A.pending) { var p = A.pending; A.pending = null; A.play(p); }
  };
  A.setVolumes = function (m, s) {
    A.musicVol = m; A.sfxVol = s;
    if (musicBus) musicBus.gain.value = m;
    if (sfxBus) sfxBus.gain.value = s;
  };

  // ---------- instruments ----------
  function env(g, t, a, peak, dec, sus, rel, dur) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak * sus), t + a + dec);
    g.gain.setValueAtTime(Math.max(0.0001, peak * sus), t + Math.max(a + dec, dur));
    g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(a + dec, dur) + rel);
  }
  var INST = {
    zheng: function (f, t, dur, vol, out) { // plucked string with bright attack and slight pitch bend
      var o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), flt = ctx.createBiquadFilter();
      o.type = 'triangle'; o2.type = 'sawtooth';
      o.frequency.setValueAtTime(f * 1.012, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.05);
      o2.frequency.setValueAtTime(f * 1.012, t); o2.frequency.exponentialRampToValueAtTime(f, t + 0.05);
      flt.type = 'lowpass'; flt.frequency.setValueAtTime(f * 8, t); flt.frequency.exponentialRampToValueAtTime(f * 1.5, t + 0.4);
      var g2 = ctx.createGain(); g2.gain.value = 0.25;
      o.connect(flt); o2.connect(g2); g2.connect(flt); flt.connect(g); g.connect(out);
      env(g, t, 0.004, vol, 0.9, 0.01, 0.2, 0.01);
      o.start(t); o2.start(t); o.stop(t + 1.4); o2.stop(t + 1.4);
    },
    dizi: function (f, t, dur, vol, out) { // breathy flute with delayed vibrato
      var o = ctx.createOscillator(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      lfo.frequency.value = 5.2; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(f * 0.012, t + Math.min(0.4, dur));
      lfo.connect(lg); lg.connect(o.frequency);
      var o3 = ctx.createOscillator(), g3 = ctx.createGain(); o3.type = 'sine'; o3.frequency.value = f * 2; g3.gain.value = 0.12; o3.connect(g3); g3.connect(g);
      o.connect(g); g.connect(out);
      env(g, t, 0.04, vol, 0.1, 0.8, 0.12, dur);
      // breath noise
      var n = ctx.createBufferSource(), nf = ctx.createBiquadFilter(), ng = ctx.createGain();
      n.buffer = noiseBuf; nf.type = 'bandpass'; nf.frequency.value = f * 2; nf.Q.value = 2;
      n.connect(nf); nf.connect(ng); ng.connect(out);
      env(ng, t, 0.02, vol * 0.15, 0.08, 0.2, 0.05, dur * 0.5);
      var end = t + dur + 0.3;
      o.start(t); lfo.start(t); o3.start(t); n.start(t); o.stop(end); lfo.stop(end); o3.stop(end); n.stop(end);
    },
    erhu: function (f, t, dur, vol, out) { // bowed: filtered saw, slide-in, vibrato
      var o = ctx.createOscillator(), g = ctx.createGain(), flt = ctx.createBiquadFilter(), lfo = ctx.createOscillator(), lg = ctx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(f * 0.97, t); o.frequency.linearRampToValueAtTime(f, t + 0.08);
      lfo.frequency.value = 6; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(f * 0.015, t + 0.3);
      lfo.connect(lg); lg.connect(o.frequency);
      flt.type = 'lowpass'; flt.frequency.value = f * 3.2; flt.Q.value = 3;
      o.connect(flt); flt.connect(g); g.connect(out);
      env(g, t, 0.09, vol, 0.1, 0.85, 0.15, dur);
      var end = t + dur + 0.3; o.start(t); lfo.start(t); o.stop(end); lfo.stop(end);
    },
    bass: function (f, t, dur, vol, out) {
      var o = ctx.createOscillator(), g = ctx.createGain(), flt = ctx.createBiquadFilter();
      o.type = 'triangle'; o.frequency.value = f; flt.type = 'lowpass'; flt.frequency.value = 600;
      o.connect(flt); flt.connect(g); g.connect(out);
      env(g, t, 0.01, vol, 0.25, 0.5, 0.1, dur);
      o.start(t); o.stop(t + dur + 0.3);
    },
    pipa: function (f, t, dur, vol, out) { // sharper, shorter pluck
      var o = ctx.createOscillator(), g = ctx.createGain(), flt = ctx.createBiquadFilter();
      o.type = 'square'; o.frequency.value = f; flt.type = 'lowpass'; flt.frequency.setValueAtTime(f * 6, t); flt.frequency.exponentialRampToValueAtTime(f, t + 0.15);
      o.connect(flt); flt.connect(g); g.connect(out);
      env(g, t, 0.002, vol * 0.6, 0.25, 0.01, 0.05, 0.01);
      o.start(t); o.stop(t + 0.5);
    },
    drum: function (f, t, dur, vol, out) { // tanggu: pitched thump
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(f * 2.2, t); o.frequency.exponentialRampToValueAtTime(f * 0.7, t + 0.18);
      o.connect(g); g.connect(out);
      env(g, t, 0.003, vol, 0.25, 0.01, 0.05, 0.01);
      o.start(t); o.stop(t + 0.4);
      var n = ctx.createBufferSource(), nf = ctx.createBiquadFilter(), ng = ctx.createGain();
      n.buffer = noiseBuf; nf.type = 'lowpass'; nf.frequency.value = 900; n.connect(nf); nf.connect(ng); ng.connect(out);
      env(ng, t, 0.002, vol * 0.4, 0.06, 0.01, 0.02, 0.01); n.start(t); n.stop(t + 0.15);
    },
    clap: function (f, t, dur, vol, out) { // woodblock / bangu
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'square'; o.frequency.value = 1400;
      var flt = ctx.createBiquadFilter(); flt.type = 'bandpass'; flt.frequency.value = 1800; flt.Q.value = 8;
      o.connect(flt); flt.connect(g); g.connect(out);
      env(g, t, 0.001, vol, 0.04, 0.01, 0.01, 0.01); o.start(t); o.stop(t + 0.08);
    },
    bell: function (f, t, dur, vol, out) { // 編鐘: a struck bronze bell, its partials out of tune with each other, ringing on
      [[1, 1, 1.8], [2.0, 0.45, 1.1], [2.76, 0.3, 0.8], [5.4, 0.12, 0.35]].forEach(function (p) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(f * p[0], t);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol * p[1], t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + p[2] * (dur || 1));
        o.connect(g); g.connect(out); o.start(t); o.stop(t + p[2] * (dur || 1) + 0.05);
      });
    },
    gong: function (f, t, dur, vol, out) {
      var ratios = [1, 1.47, 2.09, 2.56, 3.2];
      for (var i = 0; i < ratios.length; i++) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(f * ratios[i] * 1.02, t); o.frequency.exponentialRampToValueAtTime(f * ratios[i], t + 0.5);
        o.connect(g); g.connect(out);
        env(g, t, 0.01, vol / (i + 1.5), 2.5, 0.01, 0.5, 0.01);
        o.start(t); o.stop(t + 3.2);
      }
    },
    suona: function (f, t, dur, vol, out) { // 嗩吶: the shrill double-reed war horn: nasal, brassy, scooped up into the note, wide vibrato
      var o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), bp = ctx.createBiquadFilter(), lp = ctx.createBiquadFilter(), lfo = ctx.createOscillator(), lg = ctx.createGain();
      o.type = 'sawtooth'; o2.type = 'square';
      [o, o2].forEach(function (x) { x.frequency.setValueAtTime(f * 0.94, t); x.frequency.exponentialRampToValueAtTime(f, t + 0.06); });
      lfo.frequency.value = 5.6; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(f * 0.018, t + Math.min(0.35, dur));
      lfo.connect(lg); lg.connect(o.frequency); lg.connect(o2.frequency);
      var g2 = ctx.createGain(); g2.gain.value = 0.35;
      bp.type = 'peaking'; bp.frequency.value = 1500; bp.Q.value = 1.2; bp.gain.value = 9;   // the reed's nasal formant
      lp.type = 'lowpass'; lp.frequency.value = Math.min(9000, f * 7);
      o.connect(bp); o2.connect(g2); g2.connect(bp); bp.connect(lp); lp.connect(g); g.connect(out);
      env(g, t, 0.025, vol, 0.08, 0.85, 0.08, dur);
      var end = t + dur + 0.2; o.start(t); o2.start(t); lfo.start(t); o.stop(end); o2.stop(end); lfo.stop(end);
    },
    bigdrum: function (f, t, dur, vol, out) { // 大鼓: the great war drum: a deep boom and the slap of the hide
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(f * 1.8, t); o.frequency.exponentialRampToValueAtTime(f * 0.55, t + 0.35);
      o.connect(g); g.connect(out);
      env(g, t, 0.004, vol, 0.5, 0.01, 0.15, 0.01);
      o.start(t); o.stop(t + 0.8);
      var n = ctx.createBufferSource(), nf = ctx.createBiquadFilter(), ng = ctx.createGain();
      n.buffer = noiseBuf; nf.type = 'lowpass'; nf.frequency.value = 500; n.connect(nf); nf.connect(ng); ng.connect(out);
      env(ng, t, 0.002, vol * 0.5, 0.12, 0.01, 0.05, 0.01); n.start(t); n.stop(t + 0.3);
    },
    horn: function (f, t, dur, vol, out) { // 號角: a long low horn under the army, swelling in
      var o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), flt = ctx.createBiquadFilter();
      o.type = 'sawtooth'; o2.type = 'sawtooth'; o.frequency.value = f; o2.frequency.value = f * 1.004;
      flt.type = 'lowpass'; flt.frequency.setValueAtTime(f * 2, t); flt.frequency.linearRampToValueAtTime(f * 4, t + Math.min(0.6, dur)); flt.Q.value = 1;
      o.connect(flt); o2.connect(flt); flt.connect(g); g.connect(out);
      env(g, t, Math.min(0.35, dur * 0.4), vol, 0.2, 0.8, 0.3, dur);
      var end = t + dur + 0.5; o.start(t); o2.start(t); o.stop(end); o2.stop(end);
    },
    cymbal: function (f, t, dur, vol, out) {
      var n = ctx.createBufferSource(), nf = ctx.createBiquadFilter(), ng = ctx.createGain();
      n.buffer = noiseBuf; nf.type = 'highpass'; nf.frequency.value = 5000; n.connect(nf); nf.connect(ng); ng.connect(out);
      env(ng, t, 0.002, vol, 0.5, 0.01, 0.1, 0.01); n.start(t); n.stop(t + 0.8);
    },
    xiao: function (f, t, dur, vol, out) { // 洞簫: the end-blown vertical flute: darker and softer than the dizi, all breath, a slow swell and a late, shallow vibrato
      var o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), g2 = ctx.createGain(), lp = ctx.createBiquadFilter(), lfo = ctx.createOscillator(), lg = ctx.createGain();
      o.type = 'sine'; o2.type = 'triangle'; o.frequency.value = f; o2.frequency.value = f; g2.gain.value = 0.3;
      lfo.frequency.value = 4.6; lg.gain.setValueAtTime(0, t + Math.min(0.3, dur * 0.5)); lg.gain.linearRampToValueAtTime(f * 0.007, t + Math.min(0.9, dur));
      lfo.connect(lg); lg.connect(o.frequency); lg.connect(o2.frequency);
      lp.type = 'lowpass'; lp.frequency.value = f * 2.6;
      o.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(g); g.connect(out);
      env(g, t, 0.1, vol, 0.25, 0.8, 0.3, dur);
      var n = ctx.createBufferSource(), nf = ctx.createBiquadFilter(), ng = ctx.createGain();
      n.buffer = noiseBuf; n.loop = true; nf.type = 'bandpass'; nf.frequency.value = f * 1.5; nf.Q.value = 1.4;
      n.connect(nf); nf.connect(ng); ng.connect(out);
      env(ng, t, 0.06, vol * 0.3, 0.2, 0.4, 0.2, dur);
      var end = t + dur + 0.5;
      o.start(t); o2.start(t); lfo.start(t); n.start(t); o.stop(end); o2.stop(end); lfo.stop(end); n.stop(end);
    },
    ruan: function (f, t, dur, vol, out) { // 阮: the round-bodied moon lute: a warm, woody pluck, mellower and longer than the pipa
      var o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), g2 = ctx.createGain(), flt = ctx.createBiquadFilter();
      o.type = 'triangle'; o2.type = 'sine'; o.frequency.value = f; o2.frequency.value = f * 2; g2.gain.value = 0.22;
      flt.type = 'lowpass'; flt.Q.value = 1.5; flt.frequency.setValueAtTime(f * 6, t); flt.frequency.exponentialRampToValueAtTime(f * 1.3, t + 0.5);
      o.connect(flt); o2.connect(g2); g2.connect(flt); flt.connect(g); g.connect(out);
      env(g, t, 0.003, vol, 1.0, 0.01, 0.15, 0.01);
      o.start(t); o2.start(t); o.stop(t + 1.3); o2.stop(t + 1.3);
    },
    guqin: function (f, t, dur, vol, out) { // 古琴: the scholar's seven-string zither: low silk, a long ring, the finger sliding up into the note
      var o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), g2 = ctx.createGain(), flt = ctx.createBiquadFilter();
      o.type = 'triangle'; o2.type = 'sine';
      [o, o2].forEach(function (x, i) { var m = i ? 2 : 1; x.frequency.setValueAtTime(f * m * 0.985, t); x.frequency.exponentialRampToValueAtTime(f * m, t + 0.14); });
      g2.gain.value = 0.3;
      flt.type = 'lowpass'; flt.frequency.setValueAtTime(f * 5, t); flt.frequency.exponentialRampToValueAtTime(f * 1.6, t + 0.8);
      o.connect(flt); o2.connect(g2); g2.connect(flt); flt.connect(g); g.connect(out);
      env(g, t, 0.006, vol, 2.6, 0.02, 0.3, 0.01);
      o.start(t); o2.start(t); o.stop(t + 3.1); o2.stop(t + 3.1);
    },
    sheng: function (f, t, dur, vol, out) { // 笙: the mouth organ: a soft cluster of free reeds, swelling in and out with the breath, no vibrato
      var o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter(), pk = ctx.createBiquadFilter();
      o.type = 'sawtooth'; o2.type = 'square'; o.frequency.value = f; o2.frequency.value = f * 1.003;
      var g2 = ctx.createGain(); g2.gain.value = 0.4;
      pk.type = 'peaking'; pk.frequency.value = 1100; pk.Q.value = 1; pk.gain.value = 5;
      lp.type = 'lowpass'; lp.frequency.value = Math.min(6000, f * 3);
      o.connect(pk); o2.connect(g2); g2.connect(pk); pk.connect(lp); lp.connect(g); g.connect(out);
      env(g, t, Math.min(0.12, dur * 0.4), vol, 0.15, 0.8, 0.2, dur);
      var end = t + dur + 0.3; o.start(t); o2.start(t); o.stop(end); o2.stop(end);
    },
    muyu: function (f, t, dur, vol, out) { // 木魚: the hollow wooden fish of the temples: a round, knocking tock (f sets its size)
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(f * 1.25, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.02);
      o.connect(g); g.connect(out);
      env(g, t, 0.001, vol, 0.12, 0.01, 0.03, 0.01); o.start(t); o.stop(t + 0.2);
      var n = ctx.createBufferSource(), nf = ctx.createBiquadFilter(), ng = ctx.createGain();
      n.buffer = noiseBuf; nf.type = 'bandpass'; nf.frequency.value = f * 3; nf.Q.value = 4; n.connect(nf); nf.connect(ng); ng.connect(out);
      env(ng, t, 0.001, vol * 0.5, 0.015, 0.01, 0.01, 0.01); n.start(t); n.stop(t + 0.05);
    },
    paiban: function (f, t, dur, vol, out) { // 拍板: the clapper of hardwood slats that marks the beat: a dry, bright crack
      var n = ctx.createBufferSource(), nf = ctx.createBiquadFilter(), ng = ctx.createGain();
      n.buffer = noiseBuf; nf.type = 'bandpass'; nf.frequency.value = 2600; nf.Q.value = 2.5; n.connect(nf); nf.connect(ng); ng.connect(out);
      env(ng, t, 0.001, vol, 0.035, 0.01, 0.01, 0.01); n.start(t); n.stop(t + 0.08);
      n = ctx.createBufferSource(); var nf2 = ctx.createBiquadFilter(), ng2 = ctx.createGain();   // the second slat a hair behind
      n.buffer = noiseBuf; nf2.type = 'bandpass'; nf2.frequency.value = 3400; nf2.Q.value = 3; n.connect(nf2); nf2.connect(ng2); ng2.connect(out);
      env(ng2, t + 0.012, 0.001, vol * 0.6, 0.03, 0.01, 0.01, 0.01); n.start(t + 0.012); n.stop(t + 0.09);
    },
    xiaogu: function (f, t, dur, vol, out) { // 小鼓: a small, tight hand drum: a high tap, not a boom (f sets its pitch)
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(f * 1.6, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.05);
      o.connect(g); g.connect(out);
      env(g, t, 0.002, vol, 0.14, 0.01, 0.04, 0.01); o.start(t); o.stop(t + 0.25);
      var n = ctx.createBufferSource(), nf = ctx.createBiquadFilter(), ng = ctx.createGain();
      n.buffer = noiseBuf; nf.type = 'bandpass'; nf.frequency.value = 1800; nf.Q.value = 0.8; n.connect(nf); nf.connect(ng); ng.connect(out);
      env(ng, t, 0.001, vol * 0.35, 0.04, 0.01, 0.01, 0.01); n.start(t); n.stop(t + 0.08);
    },
    pengling: function (f, t, dur, vol, out) { // 碰鈴: a pair of tiny cup bells struck together: a high, clear ting that rings away
      [[1, 1, 2.2], [2.32, 0.4, 1.2], [4.1, 0.15, 0.6]].forEach(function (p) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = f * p[0];
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol * p[1], t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + p[2]);
        o.connect(g); g.connect(out); o.start(t); o.stop(t + p[2] + 0.05);
      });
    }
  };

  // ---------- jianpu parser ----------
  // degrees 1..7 in a major scale relative to `key`; ' raises an octave, , lowers; '-' holds, '0' rests.
  var MAJOR = [0, 2, 4, 5, 7, 9, 11];
  var KEYS = { C: 0, 'C#': 1, D: 2, Eb: 3, E: 4, F: 5, 'F#': 6, G: 7, Ab: 8, A: 9, Bb: 10, B: 11 };
  function parse(str, key, baseOct) {
    var toks = str.replace(/\|/g, ' ').trim().split(/\s+/);
    var notes = [];
    for (var i = 0; i < toks.length; i++) {
      var tk = toks[i];
      if (tk === '-') { if (notes.length) notes[notes.length - 1].len++; else notes.push({ rest: true, len: 1 }); continue; }
      if (tk === '0' || tk === '.') { notes.push({ rest: true, len: 1 }); continue; }
      var fs = tk.split('+').map(function (p) {   // '1+3+5' sounds the notes together (the sheng's chords)
        var deg = parseInt(p[0], 10), oct = baseOct, acc = 0;
        for (var k = 1; k < p.length; k++) { if (p[k] === "'") oct++; else if (p[k] === ',') oct--; else if (p[k] === '#') acc++; else if (p[k] === 'b') acc--; }
        var midi = 12 * (oct + 1) + KEYS[key] + MAJOR[deg - 1] + acc;
        return 440 * Math.pow(2, (midi - 69) / 12);
      });
      notes.push(fs.length > 1 ? { f: fs[0], fs: fs, len: 1 } : { f: fs[0], len: 1 });
    }
    return notes;
  }
  // One note of a channel, with the channel's options: a chord's notes at once, or (trem) a plucked note held by
  // the pipa's rolling tremolo instead of dying away.
  function sound(c, n, t, len, out) {
    var fs = n.fs || [n.f], vol = c.vol / Math.sqrt(fs.length), fn = INST[c.inst];
    for (var i = 0; i < fs.length; i++) {
      var f = fs[i] * (c.mul || 1);
      if (c.trem && len > 0.3) { for (var k = 0; k * 0.07 < len - 0.05; k++) fn(f, t + k * 0.07, 0.07, vol * (k ? 0.55 : 1), out); }
      else fn(f, t, len, vol, out);
    }
  }
  // a channel's own output: panned left or right if it asks to be, so a small band sits around the listener
  function chanOut(c, bus) {
    if (!c.pan || !ctx.createStereoPanner) return bus;
    var p = ctx.createStereoPanner(); p.pan.value = c.pan; p.connect(bus); return p;
  }
  // percussion line: 'x' hit, 'o' soft hit, '.' rest
  function parsePerc(str) {
    var s = str.replace(/[\s|]/g, ''), out = [];
    for (var i = 0; i < s.length; i++) out.push(s[i] === 'x' ? 1 : s[i] === 'o' ? 0.5 : 0);
    return out;
  }

  A.tracks = {}; // filled by js/data/music.js
  A.defTrack = function (id, t) { A.tracks[id] = t; };

  var sched = null;
  A.play = function (id, opt) {
    if (!id) { A.stop(); return; }
    if (A.current === id && sched) return;
    if (!ctx) { A.pending = id; A.current = id; return; }
    A.stop(true);
    var tr = A.tracks[id]; if (!tr) return;
    A.current = id;
    var step = 60 / tr.bpm / 2; // eighth notes
    var chans = tr.ch.map(function (c) {
      var seq = c.perc ? parsePerc(c.notes) : parse(c.notes, tr.key, c.oct == null ? 4 : c.oct);
      var total = 0; if (c.perc) total = seq.length; else seq.forEach(function (n) { total += n.len; });
      return { c: c, seq: seq, total: total, step: step / (c.div || 1) };   // div 2: this channel is written in sixteenths
    });
    var bus = ctx.createGain(); bus.gain.value = 0; bus.connect(musicBus);
    chans.forEach(function (ch) { ch.out = chanOut(ch.c, bus); });
    bus.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.4);
    var start = ctx.currentTime + 0.08;
    var s = { bus: bus, start: start, loop: 0, id: id };
    // per-channel cursors
    chans.forEach(function (ch) { ch.idx = 0; ch.pos = 0; });
    s.timer = setInterval(function () {
      var now = ctx.currentTime, ahead = now + 0.25, alive = false;
      chans.forEach(function (ch) {
        while (true) {
          if (tr.once && ch.pos >= ch.total) break;
          alive = true;
          var t = start + ch.pos * ch.step;
          if (t > ahead) break;
          var c = ch.c;
          if (c.perc) {
            var v = ch.seq[ch.idx % ch.seq.length];
            if (v && t >= now - 0.05) INST[c.inst](c.f || 80, t, ch.step, c.vol * v, ch.out);
            ch.pos++; ch.idx++;
          } else {
            var n = ch.seq[ch.idx % ch.seq.length];
            if (!n.rest && t >= now - 0.05) sound(c, n, t, n.len * ch.step * (c.legato || 0.95), ch.out);
            ch.pos += n.len; ch.idx++;
          }
        }
      });
      if (tr.once && !alive) clearInterval(s.timer);
    }, 60);
    sched = s;
  };
  // Render a track offline for so many seconds (debug: to listen to it as a file, or measure its loudness).
  A.renderOffline = function (id, secs) {
    var tr = A.tracks[id]; if (!tr) return Promise.reject('no track ' + id);
    var OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext, sr = 44100;
    var off = new OAC(2, Math.ceil(sr * secs), sr), keep = { ctx: ctx, noiseBuf: noiseBuf };
    ctx = off;
    noiseBuf = off.createBuffer(1, sr, sr); var nd = noiseBuf.getChannelData(0); for (var i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    var bus = off.createGain(); bus.gain.value = A.musicVol * 0.8; bus.connect(off.destination);
    var conv = off.createConvolver(), len = sr * 1.6, ir = off.createBuffer(2, len, sr);
    for (var c2 = 0; c2 < 2; c2++) { var d = ir.getChannelData(c2); for (i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    conv.buffer = ir; var wet = off.createGain(); wet.gain.value = 0.22; bus.connect(conv); conv.connect(wet); wet.connect(off.destination);
    var step = 60 / tr.bpm / 2;
    tr.ch.forEach(function (c) {
      var seq = c.perc ? parsePerc(c.notes) : parse(c.notes, tr.key, c.oct == null ? 4 : c.oct), pos = 0, k = 0;
      var cs = step / (c.div || 1), out = chanOut(c, bus);
      while (pos * cs < secs) {
        var t = 0.05 + pos * cs;
        if (c.perc) { var v = seq[k % seq.length]; if (v) INST[c.inst](c.f || 80, t, cs, c.vol * v, out); pos++; }
        else { var n = seq[k % seq.length]; if (!n.rest) sound(c, n, t, n.len * cs * (c.legato || 0.95), out); pos += n.len; }
        k++;
      }
    });
    ctx = keep.ctx; noiseBuf = keep.noiseBuf;   // the offline notes are all scheduled: the live context comes back
    return off.startRendering();
  };
  A.stop = function (quick) {
    if (!sched) { A.current = null; return; }
    var s = sched; sched = null; A.current = null;
    clearInterval(s.timer);
    try {
      s.bus.gain.cancelScheduledValues(ctx.currentTime);
      s.bus.gain.setValueAtTime(s.bus.gain.value, ctx.currentTime);
      s.bus.gain.linearRampToValueAtTime(0, ctx.currentTime + (quick ? 0.25 : 0.8));
      setTimeout(function () { s.bus.disconnect(); }, 1200);
    } catch (e) {}
  };

  // ---------- SFX ----------
  function tone(type, f0, f1, dur, vol, delay) {
    if (!ctx) return;
    var t = ctx.currentTime + (delay || 0);
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t);
    if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    o.connect(g); g.connect(sfxBus);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(dur, vol, fType, fFreq, delay, fEnd) {
    if (!ctx) return;
    var t = ctx.currentTime + (delay || 0);
    var n = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    n.buffer = noiseBuf; f.type = fType || 'lowpass'; f.frequency.setValueAtTime(fFreq || 2000, t);
    if (fEnd) f.frequency.exponentialRampToValueAtTime(fEnd, t + dur);
    n.connect(f); f.connect(g); g.connect(sfxBus);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    n.start(t); n.stop(t + dur + 0.02);
  }
  A.sfx = function (name) {
    if (!ctx) return;
    switch (name) {
      case 'cursor': tone('square', 880, 0, 0.03, 0.05); break;
      case 'ok': tone('square', 660, 0, 0.04, 0.06); tone('square', 990, 0, 0.06, 0.06, 0.04); break;
      case 'cancel': tone('square', 500, 300, 0.08, 0.06); break;
      case 'buzz': tone('sawtooth', 120, 100, 0.15, 0.08); break;
      case 'hit': noise(0.12, 0.5, 'lowpass', 3000, 0, 300); tone('square', 180, 60, 0.1, 0.15); break;
      case 'slash': noise(0.16, 0.35, 'bandpass', 4000, 0, 900); break;
      case 'crit': noise(0.2, 0.6, 'lowpass', 5000, 0, 200); tone('sawtooth', 300, 50, 0.25, 0.2); break;
      case 'miss': noise(0.12, 0.15, 'highpass', 3000); break;
      case 'block': tone('square', 1200, 900, 0.08, 0.12); tone('triangle', 2400, 0, 0.1, 0.08); break;
      case 'magic': for (var i = 0; i < 6; i++) tone('sine', 600 + i * 220, 0, 0.18, 0.06, i * 0.04); break;
      case 'fire': noise(0.6, 0.4, 'lowpass', 1500, 0, 300); break;
      case 'thunder': noise(0.7, 0.7, 'lowpass', 6000, 0, 100); tone('sawtooth', 80, 40, 0.6, 0.2); break;
      case 'water': for (i = 0; i < 5; i++) tone('sine', 900 - i * 100, 400, 0.15, 0.08, i * 0.06); break;
      case 'wind': noise(0.8, 0.3, 'bandpass', 1200, 0, 3000); break;
      case 'earth': tone('square', 70, 40, 0.5, 0.3); noise(0.5, 0.4, 'lowpass', 400); break;
      case 'heal': for (i = 0; i < 5; i++) tone('sine', 520 * Math.pow(1.25, i), 0, 0.25, 0.07, i * 0.07); break;
      case 'item': tone('triangle', 784, 0, 0.1, 0.1); tone('triangle', 1046, 0, 0.18, 0.1, 0.09); break;
      case 'door': noise(0.18, 0.25, 'lowpass', 500); tone('triangle', 140, 90, 0.15, 0.1); break;
      case 'chest': tone('triangle', 523, 0, 0.1, 0.12); tone('triangle', 659, 0, 0.1, 0.12, 0.1); tone('triangle', 784, 0, 0.25, 0.12, 0.2); break;
      case 'save': for (i = 0; i < 4; i++) tone('sine', [523, 659, 784, 1046][i], 0, 0.3, 0.08, i * 0.1); break;
      case 'encounter': tone('sawtooth', 220, 880, 0.35, 0.12); noise(0.4, 0.3, 'highpass', 2000); break;
      case 'run': noise(0.3, 0.2, 'bandpass', 1500, 0, 600); break;
      case 'levelup': for (i = 0; i < 5; i++) tone('square', [523, 659, 784, 1046, 1318][i], 0, 0.12, 0.06, i * 0.07); break;
      case 'join': {   // a hero joins: a short peal of bronze bells rising to a ringing chord, over a soft gong
        var t0 = ctx.currentTime;
        INST.gong(110, t0, 1, 0.18, sfxBus);
        [392, 440, 523, 587].forEach(function (f, k) { INST.bell(f, t0 + 0.08 + k * 0.13, 0.9, 0.11, sfxBus); });
        [784, 659, 523].forEach(function (f) { INST.bell(f, t0 + 0.68, 1.5, 0.09, sfxBus); });   // and the last stroke a chord
        break;
      }
      case 'gong': INST.gong(98, ctx.currentTime, 1, 0.35, sfxBus); break;
      case 'drum': INST.drum(70, ctx.currentTime, 1, 0.6, sfxBus); break;
      case 'arrow': noise(0.2, 0.25, 'highpass', 3000, 0, 8000); break;
      case 'step': noise(0.04, 0.05, 'lowpass', 800); break;
      case 'coins': for (i = 0; i < 4; i++) tone('square', 1800 + i * 200, 0, 0.05, 0.04, i * 0.05); break;
      case 'roar': noise(0.9, 0.5, 'lowpass', 600, 0, 150); tone('sawtooth', 110, 70, 0.9, 0.18); break;
      case 'splash': noise(0.5, 0.4, 'bandpass', 900, 0, 200); break;
      case 'cannon': noise(0.9, 0.9, 'lowpass', 2500, 0, 60); tone('sine', 60, 30, 0.8, 0.5); break;
      default: if (FX[name]) FX[name](); break;
    }
  };
  // the sounds of battle skills, one or two for each look in js/engine/battlefx.js (a launch, and the impact)
  function thud(f0, vol, d) { tone('sine', f0, f0 * 0.45, 0.25, vol, d); noise(0.15, vol * 0.8, 'lowpass', 700, d, 120); }
  function whoosh(vol, d, lo, hi, dur) { noise(dur || 0.22, vol, 'bandpass', lo || 600, d, hi || 3500); }
  function ring(f, vol, d, dur) { tone('triangle', f, f * 0.97, dur || 0.35, vol, d); tone('sine', f * 2.7, 0, (dur || 0.35) * 0.6, vol * 0.4, d); }
  var FX = {
    fx_slash: function () { whoosh(0.3, 0, 4500, 900, 0.16); ring(1900, 0.05, 0.05, 0.2); },
    fx_blade: function () { whoosh(0.4, 0, 3000, 500, 0.3); ring(1400, 0.07, 0.12, 0.45); noise(0.1, 0.3, 'lowpass', 2500, 0.12, 400); },
    fx_cross: function () { whoosh(0.3, 0, 4000, 900, 0.14); whoosh(0.3, 0.09, 4000, 900, 0.14); ring(2200, 0.07, 0.1, 0.3); ring(1700, 0.06, 0.16, 0.3); },
    fx_stab: function () { for (var i = 0; i < 4; i++) noise(0.05, 0.28, 'bandpass', 3500 - i * 300, i * 0.07); },
    fx_sweep: function () { whoosh(0.4, 0, 500, 2500, 0.35); noise(0.12, 0.3, 'lowpass', 2500, 0.28, 300); },
    fx_thrust: function () { whoosh(0.35, 0, 1200, 5000, 0.12); thud(220, 0.25, 0.1); ring(2400, 0.04, 0.1, 0.15); },
    fx_hook: function () { whoosh(0.3, 0, 1500, 600, 0.2); ring(900, 0.07, 0.15, 0.3); noise(0.2, 0.2, 'bandpass', 800, 0.22, 300); },
    fx_chop: function () { whoosh(0.4, 0, 2500, 300, 0.18); thud(110, 0.45, 0.15); noise(0.25, 0.4, 'highpass', 1500, 0.16, 400); },
    fx_smash: function () { thud(90, 0.55, 0); tone('square', 60, 35, 0.3, 0.15); noise(0.4, 0.3, 'lowpass', 500, 0.05, 100); },
    fx_fist: function () { thud(160, 0.45, 0); noise(0.05, 0.35, 'highpass', 2500, 0); },
    fx_whip: function () { whoosh(0.25, 0, 600, 2500, 0.2); noise(0.04, 0.6, 'highpass', 4000, 0.2); noise(0.06, 0.3, 'bandpass', 2500, 0.22); },
    fx_claw: function () { for (var i = 0; i < 3; i++) noise(0.09, 0.35, 'bandpass', 2600 - i * 400, i * 0.05, 700); tone('sawtooth', 160, 90, 0.2, 0.08); },
    fx_rush: function () { whoosh(0.35, 0, 400, 3000, 0.3); thud(130, 0.45, 0.22); },
    fx_roar: function () { noise(0.9, 0.5, 'lowpass', 600, 0, 150); tone('sawtooth', 110, 70, 0.9, 0.18); tone('sawtooth', 165, 100, 0.7, 0.08); },
    fx_bow: function () { tone('triangle', 260, 180, 0.12, 0.18); noise(0.18, 0.2, 'highpass', 3000, 0.02, 8000); },
    fx_arrowhit: function () { noise(0.06, 0.4, 'bandpass', 1800); thud(300, 0.2, 0); },
    fx_volley: function () { for (var i = 0; i < 7; i++) { noise(0.12, 0.15, 'highpass', 4000, i * 0.06, 8000); noise(0.05, 0.25, 'bandpass', 1600, 0.25 + i * 0.07); } },
    fx_throw: function () { whoosh(0.25, 0, 900, 4000, 0.18); },
    fx_stonehit: function () { noise(0.08, 0.5, 'bandpass', 1400); tone('square', 420, 200, 0.06, 0.12); },
    fx_knifehit: function () { for (var i = 0; i < 3; i++) ring(2600 + i * 300, 0.06, i * 0.05, 0.12); noise(0.05, 0.3, 'bandpass', 3000); },
    fx_javelinhit: function () { thud(240, 0.35, 0); ring(700, 0.05, 0.02, 0.25); },
    fx_fuse: function () { noise(0.45, 0.15, 'highpass', 5000, 0, 2500); },
    fx_boom: function () { noise(1.0, 0.9, 'lowpass', 2500, 0, 60); tone('sine', 70, 28, 0.9, 0.55); for (var i = 0; i < 5; i++) noise(0.04, 0.2, 'highpass', 3000, 0.15 + i * 0.09); },
    fx_fire: function () { noise(0.7, 0.4, 'lowpass', 1500, 0, 300); for (var i = 0; i < 6; i++) noise(0.03, 0.25, 'highpass', 2500, 0.05 + Math.random() * 0.5); },
    fx_thunder: function () { noise(0.05, 0.6, 'highpass', 3000); noise(0.9, 0.8, 'lowpass', 6000, 0.03, 80); tone('sawtooth', 70, 35, 0.8, 0.25, 0.03); },
    fx_water: function () { noise(0.6, 0.45, 'bandpass', 900, 0, 200); for (var i = 0; i < 6; i++) tone('sine', 1100 - i * 120 + Math.random() * 200, 400, 0.12, 0.05, 0.1 + i * 0.06); },
    fx_wind: function () { noise(0.9, 0.35, 'bandpass', 700, 0, 3000); noise(0.7, 0.2, 'bandpass', 2500, 0.15, 900); },
    fx_earth: function () { tone('square', 60, 35, 0.6, 0.3); noise(0.7, 0.5, 'lowpass', 350, 0, 80); for (var i = 0; i < 4; i++) noise(0.06, 0.25, 'lowpass', 1200, 0.1 + i * 0.1); },
    fx_dark: function () { tone('sawtooth', 98, 82, 0.8, 0.1); tone('sawtooth', 104, 87, 0.8, 0.1); noise(0.8, 0.25, 'lowpass', 400, 0, 150); },
    fx_sand: function () { noise(0.9, 0.35, 'highpass', 2000, 0, 5000); noise(0.9, 0.2, 'lowpass', 500); },
    fx_magic: function () { for (var i = 0; i < 7; i++) tone('sine', 700 + i * 230, 0, 0.3, 0.06, i * 0.05); },
    fx_stars: function () { for (var i = 0; i < 9; i++) { tone('triangle', 2000 - i * 120, 900, 0.18, 0.05, i * 0.07); noise(0.05, 0.2, 'bandpass', 2000, 0.25 + i * 0.07); } },
    fx_dragon: function () { tone('sawtooth', 140, 90, 0.9, 0.12); noise(0.9, 0.35, 'bandpass', 800, 0, 2500); for (var i = 0; i < 5; i++) tone('sine', 900 + i * 300, 0, 0.3, 0.05, 0.3 + i * 0.06); },
    fx_heal: function () { for (var i = 0; i < 5; i++) tone('sine', 520 * Math.pow(1.25, i), 0, 0.3, 0.07, i * 0.07); },
    fx_rain: function () { noise(0.8, 0.15, 'highpass', 3000); for (var i = 0; i < 5; i++) tone('sine', 520 * Math.pow(1.25, i), 0, 0.3, 0.06, 0.15 + i * 0.07); },
    fx_buff: function () { for (var i = 0; i < 4; i++) tone('square', [392, 494, 587, 784][i], 0, 0.14, 0.05, i * 0.07); tone('triangle', 784, 0, 0.4, 0.06, 0.28); },
    fx_banner: function () { noise(0.3, 0.3, 'bandpass', 1200, 0, 500); INST.gong(131, ctx.currentTime + 0.15, 1, 0.22, sfxBus); },
    fx_drug: function () { for (var i = 0; i < 6; i++) tone('sine', 300 + Math.random() * 200, 200, 0.15, 0.06, i * 0.09); tone('sine', 330, 220, 0.8, 0.05, 0.1); },
    fx_poison: function () { for (var i = 0; i < 7; i++) tone('sine', 180 + Math.random() * 120, 120, 0.12, 0.07, i * 0.08); },
    fx_puff: function () { noise(0.3, 0.3, 'lowpass', 1500, 0, 300); },
    fx_steal: function () { noise(0.3, 0.3, 'lowpass', 1500, 0, 300); for (var i = 0; i < 4; i++) tone('square', 1800 + i * 200, 0, 0.05, 0.04, 0.15 + i * 0.05); },
    fx_net: function () { whoosh(0.3, 0, 500, 1500, 0.3); for (var i = 0; i < 4; i++) noise(0.05, 0.15, 'bandpass', 1200, 0.25 + i * 0.05); },
    fx_charge: function () { tone('sawtooth', 150, 600, 0.45, 0.06); tone('sine', 300, 1200, 0.45, 0.06); noise(0.45, 0.12, 'bandpass', 500, 0, 3000); }
  };
  A.blip = function (kind) { if (!ctx) return; tone('triangle', kind ? 560 : 420, 0, 0.025, 0.03); };
})();
