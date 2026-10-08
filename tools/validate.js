// Headless data validation: node tools/validate.js
'use strict';
const { load } = require('./headless.js');
const sb = load();
const WM = sb.WM;
const errs = WM.validateData();
console.log('maps:', Object.keys(WM.data.maps).length, 'events:', Object.values(WM.data.events).reduce((a, b) => a + b.length, 0), 'enemies:', Object.keys(WM.data.enemies).length);
if (errs.length) { console.log('ERRORS:\n' + errs.join('\n')); process.exit(1); }
console.log('OK');
