/* Paint previews directly from each sheet: one missing/slow file must not hide the cast. */
'use strict';
(function () {
  const frame = document.getElementById('game');
  const status = document.getElementById('status');
  const gallery = document.getElementById('gallery');
  let started = false;
  function start() {
    const W = frame.contentWindow.WM;
    if (frame.contentDocument.readyState !== 'complete') return;
    if (started || !W || !W.ASSETS || !W.data || !W.ui) return;
    started = true;
    const ids = W.ASSETS.portraitGroups[document.body.dataset.portraitGroup];
    if (!ids) { status.textContent = 'Portrait group unavailable. Please reload this page.'; return; }
    let loaded = 0, failed = [];
    function update() {
      status.textContent = loaded + ' of ' + ids.length + ' characters loaded (' + loaded * 6 + ' expressions).' +
        (failed.length ? ' Could not load: ' + failed.join(', ') + '. Reload to retry.' : '');
    }
    ids.forEach(id => {
      const chapter = Number(document.body.dataset.portraitGroup.replace('chapter', ''));
      const portraitId = id === 'linchong' ? (chapter > 3 ? 'linchong_exile' : 'linchong_official') : id;
      const variant = (W.ASSETS.portraitVariants || {})[portraitId];
      const spec = variant || W.ASSETS.portraitSheets[id];
      const character = W.data.chars[id] || W.data.npcs[id];
      const section = document.createElement('section');
      const heading = document.createElement('h2');
      const row = document.createElement('div'); row.className = 'row';
      heading.textContent = variant && id !== 'linchong' ? 'Lin Chong — ' + (id === 'linchong_official' ? 'Before branding' : 'After branding') : character ? character.name : id;
      section.append(heading, row); gallery.append(section);
      const img = new Image();
      img.onload = () => {
        const cw = img.width / spec.columns, ch = img.height / spec.rows;
        spec.expressions.forEach((expression, index) => {
          const button = document.createElement('button');
          const canvas = document.createElement('canvas');
          const label = document.createElement('span');
          canvas.width = 288; canvas.height = 336;
          // Cover crop, centered horizontally and top-aligned like the game renderer.
          const scale = Math.max(canvas.width / cw, canvas.height / ch);
          const cropWidth = canvas.width / scale, cropHeight = canvas.height / scale;
          canvas.getContext('2d').drawImage(img,
            (index % spec.columns) * cw + (cw - cropWidth) / 2,
            Math.floor(index / spec.columns) * ch, cropWidth, cropHeight,
            0, 0, canvas.width, canvas.height);
          label.textContent = expression;
          button.setAttribute('aria-label', heading.textContent + ' — ' + expression);
          button.append(canvas, label);
          button.onclick = () => {
            // The same painted crop can display immediately, even on a slow connection.
            canvas.isOverride = true;
            W.portraits.overrides[portraitId + ':' + expression] = canvas;
            W.ui.stack = [];
            W.ui.message(variant ? { name: 'Lin Chong', portrait: portraitId, expr: expression } : id + ':' + expression, heading.textContent + ' — ' + expression, { speed: 1000 });
            frame.scrollIntoView({ behavior: 'smooth', block: 'center' });
          };
          row.append(button);
        });
        loaded++; update();
      };
      img.onerror = () => { failed.push(heading.textContent); row.textContent = 'Portrait unavailable.'; update(); };
      img.src = '../assets/portraits/' + (spec.file || id) + '-expressions.png';
    });
  }
  frame.addEventListener('load', start);
  const timer = setInterval(() => { start(); if (started) clearInterval(timer); }, 200);
  setTimeout(() => { if (!started) { clearInterval(timer); status.textContent = 'Game preview could not start. Please reload the page.'; } }, 30000);
})();
