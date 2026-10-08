// Loads the game's scripts (as listed in index.html) into a Node VM with light browser stubs.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

function stubCanvas() {
  const ctx = new Proxy({}, {
    get(t, k) {
      if (k === 'createLinearGradient' || k === 'createRadialGradient') return () => ({ addColorStop() {} });
      if (k === 'measureText') return (s) => ({ width: String(s).length * 10 });
      if (k === 'getImageData') return () => ({ data: [] });
      if (k in t) return t[k];
      return () => {};
    },
    set(t, k, v) { t[k] = v; return true; }
  });
  return { width: 0, height: 0, style: {}, getContext: () => ctx, addEventListener() {} };
}

function load(opts) {
  opts = opts || {};
  const store = {};
  const sandbox = {
    console, Math, JSON, Date, Promise, setTimeout, clearTimeout, setInterval, clearInterval,
    location: { search: opts.search || '' },
    navigator: {},
    localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } },
    document: { createElement: () => stubCanvas(), getElementById: () => stubCanvas() },
    Image: function () { this.onload = null; this.onerror = null; },
    requestAnimationFrame: () => 0,
    addEventListener() {},
    innerWidth: 960, innerHeight: 720
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const srcs = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);
  for (const s of srcs) {
    const code = fs.readFileSync(path.join(ROOT, s), 'utf8');
    try { vm.runInContext(code, sandbox, { filename: s }); }
    catch (e) { console.error('Error loading ' + s + ':\n' + e.stack); throw e; }
  }
  return sandbox;
}
module.exports = { load, ROOT };

if (require.main === module) {
  const sb = load();
  const cmd = process.argv[2];
  if (cmd === 'map') {
    const id = process.argv[3];
    const def = sb.WM.data.maps[id];
    const rows = typeof def.rows === 'function' ? def.rows() : def.rows;
    rows.forEach((r, i) => console.log(String(i).padStart(3) + ' ' + r));
  }
}
