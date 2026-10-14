// Plays the real game in headless Chrome with tools/autoplay.js and prints what it found.
//   node tools/autoplay-headless.js [from] [to] [--encounters]
// Needs the game served at http://localhost:8766 (python3 tools/serve.py 8766), or at GAME_URL, and Google Chrome installed.
'use strict';
const { spawn } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const FROM = +(args[0] || 0), TO = +(args[1] || 24), ENC = process.argv.includes('--encounters');
const PORT = 9333 + Math.floor(Math.random() * 500);
const GAME = process.env.GAME_URL || 'http://localhost:8766';   // where the game is served
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'wm-autoplay-'));
const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORT, '--user-data-dir=' + profile,
  '--no-first-run', '--mute-audio', '--window-size=1100,900', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function connect() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await (await fetch('http://127.0.0.1:' + PORT + '/json/list')).json();
      const page = list.find((t) => t.type === 'page');
      if (page) return page.webSocketDebuggerUrl;
    } catch (e) { /* not up yet */ }
    await sleep(200);
  }
  throw new Error('Chrome did not start');
}

async function main() {
  const ws = new WebSocket(await connect());
  await new Promise((r) => ws.addEventListener('open', r));
  let id = 0; const pending = {};
  let onPaused = null;
  ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); if (d.id && pending[d.id]) { pending[d.id](d); delete pending[d.id]; } else if (d.method === 'Debugger.paused' && onPaused) onPaused(d.params); });
  const send = (method, params) => new Promise((r) => { const n = ++id; pending[n] = r; ws.send(JSON.stringify({ id: n, method, params })); });
  const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.result && r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 400)); return r.result && r.result.result && r.result.result.value; };

  await send('Page.enable');
  await send('Debugger.enable');   // ready to break into a page stuck in a loop
  await send('Page.navigate', { url: GAME + '/?debug' });
  for (let i = 0; i < 100 && !(await ev('!!(window.WM && WM.gfx && WM.gfx.lctx && WM.field)').catch(() => false)); i++) await sleep(200);
  await ev(`(async () => { const src = await (await fetch('/tools/autoplay.js?' + Date.now(), { cache: 'no-store' })).text(); (0, eval)(src);
    window.__errs = []; addEventListener('error', (e) => __errs.push(e.message)); addEventListener('unhandledrejection', (e) => __errs.push(String(e.reason && e.reason.stack || e.reason).slice(0, 300)));
    if (WM.debug) { WM.debug.showLog = []; WM.debug.holdOnShow = ${process.env.SHOTDIR ? 'true' : 'false'}; }
    window.__done = false; AutoPlay.run({ from: ${FROM}, to: ${TO}, skipOnFail: true, encounters: ${ENC} }).then(() => { __done = true; }).catch((e) => { window.__err = String(e && e.stack || e); __done = true; });
    return 'started'; })()`);
  let shown = 0, beat = ''; const t0 = Date.now();
  // SHOTDIR: a screenshot each time a companion steps out beside the leader to speak (to look the scenes over)
  if (process.env.SHOTDIR) (async () => {
    let n = 0;
    for (;;) {
      await sleep(120);
      const k = await ev('(WM.debug && WM.debug.showLog || []).length').catch(() => null); if (k == null) return;
      if (k > n) {
        n = k; await sleep(700);   // let them step out (the autoplayer waits: see WM.debug.hold)
        const info = await ev('JSON.stringify(WM.debug.showLog[WM.debug.showLog.length - 1])').catch(() => '{}');
        const shot = await send('Page.captureScreenshot', { format: 'png' }).catch(() => null);
        if (shot && shot.result) { const j = JSON.parse(info || '{}'); fs.writeFileSync(path.join(process.env.SHOTDIR, String(n).padStart(2, '0') + '-' + j.map + '-' + j.id + '.png'), Buffer.from(shot.result.data, 'base64')); }
        await ev('WM.debug.hold = false').catch(() => null);
      }
    }
  })();
  const VERBOSE = process.argv.includes('--verbose');
  for (;;) {
    await sleep(3000);
    // a page stuck in a loop never answers: say where it was last seen
    const st = await Promise.race([ev('JSON.stringify({ done: __done, err: window.__err || null, ch: WM.state.chapter, map: WM.field.map && WM.field.map.id, at: WM.field.player && WM.field.player.tile(), run: WM.script.running, ui: WM.ui.stack.length, ev: (WM.field.playing || []).map((e) => e.id).join(","), log: AutoPlay.log, errs: __errs.slice(0, 10) })'), sleep(60000).then(() => null)]);
    if (!st) {
      // stuck in a loop: break into it and show where
      console.log('page stopped responding; last seen: ' + beat);
      const paused = new Promise((r) => { onPaused = r; });
      send('Debugger.pause');
      const p = await Promise.race([paused, sleep(10000).then(() => null)]);
      if (p) p.callFrames.slice(0, 12).forEach((f) => console.log('    at ' + (f.functionName || '(anonymous)') + ' ' + f.url.replace(/^.*\/\/[^/]+\//, '') + ':' + (f.location.lineNumber + 1) + ':' + (f.location.columnNumber + 1)));
      else console.log('    (could not pause the page)');
      break;
    }
    const s = JSON.parse(st);
    const b = 'ch' + s.ch + ' ' + s.map + ' ' + JSON.stringify(s.at) + ' run=' + s.run + ' ui=' + s.ui + (s.ev ? ' in ' + s.ev : '');
    if (VERBOSE && b !== beat) console.log('    . ' + b);
    beat = b;
    s.log.slice(shown).forEach((x) => console.log((x.kind === 'chapter' ? '' : '  ') + x.kind + ' ch' + x.ch + ' ' + (x.map || '') + ' ' + x.msg));
    shown = s.log.length;
    if (s.done || Date.now() - t0 > 30 * 60 * 1000) {
      if (s.err) console.log('autoplayer error: ' + s.err);
      if (s.errs.length) console.log('page errors:\n  ' + s.errs.join('\n  '));
      if (process.env.SHOWLOG) fs.writeFileSync(process.env.SHOWLOG, await ev('JSON.stringify((WM.debug && WM.debug.showLog) || [])'));   // companions stepped out beside the leader (see script.js showSpeaker)
      console.log((s.done ? 'finished' : 'timed out') + ' at chapter ' + s.ch + ' (' + s.map + ') after ' + Math.round((Date.now() - t0) / 1000) + 's');
      break;
    }
  }
  ws.close();
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { chrome.kill(); setTimeout(() => fs.rmSync(profile, { recursive: true, force: true }), 500); });
