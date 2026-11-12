const assert = require('assert');
const K = require('../prototype/engine.js');

function days(fn, nDays = 3) {
  const a = [];
  for (let d = 0; d < nDays; d++) for (let h = 0; h < 24; h++)
    a.push(Object.assign({ t: `2026-06-${String(10 + d).padStart(2, '0')}T${String(h).padStart(2, '0')}:00`, rain: 0, prob: 5, wind: 6 }, fn(d, h) || {}));
  return a;
}
let n = 0;
const t = (name, f) => { f(); n++; console.log('ok -', name); };

t('dry days give windows every day, starts 6..13', () => {
  const w = K.findWindows(days(() => ({})));
  assert.strictEqual(w.length, 3); assert.strictEqual(w[0].earliestStart, 6); assert.strictEqual(w[1].latestStart, 13);
});
t('rain 8-10 each morning: first feasible start is 11', () => {
  const w = K.findWindows(days((d, h) => (h >= 8 && h <= 10 ? { rain: 3, prob: 90 } : {})));
  assert.strictEqual(w[1].earliestStart, 11);
});
t('continuous rain: no windows', () => assert.strictEqual(K.findWindows(days(() => ({ rain: 2, prob: 95 }))).length, 0));
t('high wind blocks spraying hours', () => assert.strictEqual(K.findWindows(days(() => ({ wind: 30 }))).length, 0));
t('rain probability above threshold at 14:00 pushes latest start before 8', () => {
  const w = K.findWindows(days((d, h) => (h === 14 ? { prob: 70 } : {}))).filter(x => x.date === '2026-06-10')[0];
  assert.ok(w.latestStart < 8);
});
t('window needs full buffer inside forecast', () => assert.strictEqual(K.findWindows(days(() => ({}), 1))[0].latestStart, 13));
t('confidence labels', () => { assert.strictEqual(K.confidence(10), 'High'); assert.strictEqual(K.confidence(35), 'Medium'); assert.strictEqual(K.confidence(50), 'Low'); });
t('urgency thresholds', () => {
  assert.strictEqual(K.urgency(20).level, 'not_due'); assert.strictEqual(K.urgency(36).level, 'plan');
  assert.strictEqual(K.urgency(41).level, 'due'); assert.strictEqual(K.urgency(46).level, 'overdue');
});
t('neighbour reports within radius and time bump urgency', () => {
  const plot = { lat: 12.76, lon: 75.20, daysSinceSpray: 36 }, now = Date.UTC(2026, 5, 10);
  const rep = d => ({ lat: 12.765, lon: 75.205, ts: now - d * 864e5 });
  assert.strictEqual(K.recommend(plot, days(() => ({})), now, [rep(1)]).level, 'plan');
  assert.strictEqual(K.recommend(plot, days(() => ({})), now, [rep(1), rep(2)]).level, 'due');
  assert.strictEqual(K.recommend(plot, days(() => ({})), now, [rep(1), rep(20)]).level, 'plan');
  assert.strictEqual(K.recommend(plot, days(() => ({})), now, [{ lat: 13.5, lon: 75.2, ts: now }, { lat: 13.5, lon: 75.2, ts: now }]).level, 'plan');
});
t('no-window message is honest', () => assert.ok(/No safe spray window/.test(K.recommend({ lat: 12.76, lon: 75.2, daysSinceSpray: 42 }, days(() => ({ rain: 2, prob: 95 })), 0, []).message)));
t('not-due message says so', () => assert.ok(/No spray needed/.test(K.recommend({ lat: 12.76, lon: 75.2, daysSinceSpray: 10 }, days(() => ({})), 0, []).message)));
console.log(`\n${n} tests passed`);
