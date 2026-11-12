/* Adike Kavach – spray-window engine (framework-free, runs in browser and Node).
 * All agronomic numbers below are CONFIGURABLE DEFAULTS, not validated field values.
 * Sourced: 1% Bordeaux sprays ~40-45 days apart (CPCRI / Lok Sabha reply).
 * ASSUMPTIONS (validate with CPCRI Vittal / KVK before real use):
 * sprayHours, bufferHours, maxWindKmh, probability and neighbour thresholds. */
(function (root) {
  const DEFAULTS = {
    sprayHours: 4,      // ASSUMPTION: crew needs ~4 h to cover a small garden
    bufferHours: 3,     // ASSUMPTION: rain-free hours after spraying so the mixture can dry/stick
    dayStart: 6, dayEnd: 17,   // spraying must start >= dayStart and finish <= dayEnd
    maxWindKmh: 15,     // ASSUMPTION: drift limit for fine mist spray
    maxProbPct: 50,     // reject hours with rain probability above this
    maxHourRainMm: 0.1, // reject hours with forecast rain above this
    planFromDay: 35, dueFromDay: 40, overdueAfterDay: 45, // 40-45 from CPCRI; 35 = our planning lead
    neighbourRadiusKm: 3, neighbourDays: 7, neighbourMinReports: 2 // ASSUMPTION
  };
  const hourOf = t => parseInt(t.slice(11, 13), 10);
  const dateOf = t => t.slice(0, 10);
  const confidence = r => (r <= 20 ? 'High' : r <= 40 ? 'Medium' : 'Low');

  /** hours: [{t:'YYYY-MM-DDTHH:00', rain:mm, prob:% or null, wind:km/h}] contiguous hourly, local time */
  function findWindows(hours, userCfg) {
    const c = Object.assign({}, DEFAULTS, userCfg), N = c.sprayHours + c.bufferHours, out = [];
    for (let i = 0; i + N <= hours.length; i++) {
      const h0 = hourOf(hours[i].t);
      if (h0 < c.dayStart || h0 + c.sprayHours > c.dayEnd) continue;
      let ok = true, risk = 0, wind = 0;
      for (let k = 0; k < N && ok; k++) {
        const x = hours[i + k];
        if (hourOf(x.t) !== (h0 + k) % 24) ok = false;                     // gap in data
        if (x.rain == null || x.rain > c.maxHourRainMm) ok = false;
        const p = x.prob == null ? 0 : x.prob;
        if (p > c.maxProbPct) ok = false;
        risk = Math.max(risk, p);
        if (k < c.sprayHours) { if (x.wind == null || x.wind > c.maxWindKmh) ok = false; wind = Math.max(wind, x.wind || 0); }
      }
      if (ok) out.push({ date: dateOf(hours[i].t), startHour: h0, endHour: h0 + c.sprayHours, dryUntil: h0 + N, riskPct: risk, maxWind: wind });
    }
    const days = {};
    out.forEach(w => { (days[w.date] = days[w.date] || []).push(w); });
    return Object.keys(days).sort().map(d => {
      const ws = days[d], best = ws.slice().sort((a, b) => a.riskPct - b.riskPct || a.startHour - b.startHour)[0];
      return { date: d, earliestStart: ws[0].startHour, latestStart: ws[ws.length - 1].startHour, best, confidence: confidence(best.riskPct) };
    });
  }

  const LEVELS = ['not_due', 'plan', 'due', 'overdue'];
  function urgency(daysSince, userCfg) {
    const c = Object.assign({}, DEFAULTS, userCfg);
    const level = daysSince > c.overdueAfterDay ? 'overdue' : daysSince >= c.dueFromDay ? 'due' : daysSince >= c.planFromDay ? 'plan' : 'not_due';
    return { level, daysSince, daysToDue: c.dueFromDay - daysSince };
  }
  function haversineKm(a, b) {
    const R = 6371, r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
    const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(s));
  }
  /** reports: [{lat,lon,ts(ms)}] neighbour "rot seen" pins */
  function nearbyReports(reports, plot, nowMs, userCfg) {
    const c = Object.assign({}, DEFAULTS, userCfg), cutoff = nowMs - c.neighbourDays * 864e5;
    return reports.filter(r => r.ts >= cutoff && r.ts <= nowMs && haversineKm(r, plot) <= c.neighbourRadiusKm).length;
  }
  function bump(level, n, userCfg) {
    const c = Object.assign({}, DEFAULTS, userCfg);
    if (n < c.neighbourMinReports) return level;
    return LEVELS[Math.min(LEVELS.indexOf(level) + 1, LEVELS.length - 1)];
  }
  const fmtH = h => { const hh = h % 24, s = hh >= 12 ? 'PM' : 'AM'; return (hh % 12 || 12) + ':00 ' + s; };

  function recommend(plot, hours, nowMs, reports, userCfg) {
    const c = Object.assign({}, DEFAULTS, userCfg);
    const u = urgency(plot.daysSinceSpray, c), n = nearbyReports(reports || [], plot, nowMs, c);
    const level = bump(u.level, n, c), windows = findWindows(hours, c);
    const top = windows.slice().sort((a, b) => a.best.riskPct - b.best.riskPct || (a.date < b.date ? -1 : 1)).slice(0, 3);
    let msg;
    if (level === 'not_due') msg = `No spray needed yet (day ${u.daysSince}; due from day ${c.dueFromDay}).`;
    else if (!top.length) msg = 'No safe spray window in the forecast. Re-checking every 3 hours.';
    else { const b = top[0].best; msg = `Best window ${top[0].date}: ${fmtH(b.startHour)}–${fmtH(b.endHour)}, dry until ${fmtH(b.dryUntil)}. Rain risk up to ${b.riskPct}% (${top[0].confidence} confidence).`; }
    return { level, daysSinceSpray: u.daysSince, neighbourReports: n, windows: top, message: msg };
  }
  const api = { DEFAULTS, findWindows, urgency, nearbyReports, bump, recommend, haversineKm, fmtH, confidence };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Kavach = api;
})(typeof window !== 'undefined' ? window : globalThis);
