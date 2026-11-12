(function () {
  'use strict';
  const KID = window.KID;
  const PLAN = window.PLANS[KID];
  const LIB = window.LIB;
  const IMG = '../img/';
  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  document.body.classList.add(KID);

  // ---------- Dates ----------
  const pad = n => String(n).padStart(2, '0');
  const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return ymd(d); };
  const dayNum = s => Math.round(Date.UTC(...s.split('-').map((v, i) => i === 1 ? v - 1 : +v)) / 864e5);
  const today = () => ymd(new Date());
  const isOnDay = s => ((dayNum(s) - dayNum(window.EOD_START)) % 2 + 2) % 2 === 0;

  // ---------- Tasks for a day ----------
  function tasksFor(date) {
    const on = isOnDay(date);
    const am = [], once = [], pm = [];
    for (const it of PLAN.items) {
      if (it.freq === 'twice') {
        am.push({ key: it.ex + ':am', it, slot: 'Morning' });
        pm.push({ key: it.ex + ':pm', it, slot: 'Evening' });
      } else if (it.freq === 'daily' || (it.freq === 'eod' && on)) {
        once.push({ key: it.ex + ':1', it, slot: '' });
      }
    }
    const sections = [];
    if (am.length) sections.push({ title: 'Morning', note: 'Twice-a-day stretches', tasks: am });
    if (once.length) sections.push({ title: 'Once today', note: on ? 'Includes every-other-day exercises' : '', tasks: once });
    if (pm.length) sections.push({ title: 'Evening', note: 'Twice-a-day stretches again', tasks: pm });
    return { on, sections, all: [].concat(am, once, pm) };
  }

  // ---------- Storage ----------
  const K = d => `knee:${KID}:${d}`;
  function load(date) {
    try { return JSON.parse(localStorage.getItem(K(date))) || { done: {}, pain: null }; }
    catch (e) { return { done: {}, pain: null }; }
  }
  function save(date, st) {
    try { localStorage.setItem(K(date), JSON.stringify(st)); } catch (e) {}
    queueSync(date);
  }
  function pct(date) {
    const t = tasksFor(date).all, st = load(date);
    if (!t.length) return 0;
    return Math.round(100 * t.filter(x => st.done[x.key]).length / t.length);
  }
  function streak() {
    let d = today(), n = 0;
    if (pct(d) < 100) d = addDays(d, -1);
    while (pct(d) === 100 && n < 999) { n++; d = addDays(d, -1); }
    return n;
  }

  // ---------- Sync to Google Sheet ----------
  const QK = `knee:${KID}:queue`;
  let syncTimer = null;
  function getQueue() { try { return JSON.parse(localStorage.getItem(QK)) || []; } catch (e) { return []; } }
  function setQueue(q) { try { localStorage.setItem(QK, JSON.stringify(q)); } catch (e) {} }
  function queueSync(date) {
    if (!window.SHEET_URL) return;
    const q = getQueue(); if (!q.includes(date)) q.push(date); setQueue(q);
    clearTimeout(syncTimer); syncTimer = setTimeout(flush, 1500);
    setSync('Saving…');
  }
  function summary(date) {
    const { all } = tasksFor(date), st = load(date);
    const label = x => LIB[x.it.ex].name + (x.slot ? ` (${x.slot.toLowerCase()})` : '');
    return {
      kid: PLAN.name, date,
      done: all.filter(x => st.done[x.key]).length, total: all.length,
      pain: st.pain, missing: all.filter(x => !st.done[x.key]).map(label).join(', '),
      updated: new Date().toISOString()
    };
  }
  async function flush() {
    if (!window.SHEET_URL) return;
    const q = getQueue();
    if (!q.length) return;
    for (const date of q.slice()) {
      try {
        await fetch(window.SHEET_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(summary(date)) });
        setQueue(getQueue().filter(d => d !== date));
      } catch (e) { setSync('Offline — will send when you’re back online'); return; }
    }
    setSync('Progress sent ✓');
  }
  function setSync(t) { const el = $('#sync'); if (el) el.textContent = t; }
  window.addEventListener('online', flush);

  // ---------- Dose text ----------
  function dose(ex) {
    if (ex.time) return `${ex.time / 60} minutes`;
    let s = ex.sets > 1 ? `${ex.sets} sets × ${ex.reps}` : `${ex.reps} reps`;
    if (ex.reps === 1) s = `${ex.sets} times`;
    if (ex.hold) s += ` · hold ${ex.hold} sec`;
    if (ex.rest) s += ` · rest ${ex.rest / 60} min`;
    return s;
  }
  const tagHTML = it => `#${it.num} · ${it.sheet} sheet${it.star ? ' <span class="star" title="Starred on the sheet">★</span>' : ''}`;
  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  // ---------- Main view ----------
  let view = today();
  const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function render() {
    const t = today();
    if (view > t) view = t;
    const { on, sections, all } = tasksFor(view);
    const st = load(view);
    const done = all.filter(x => st.done[x.key]).length;
    const d = parse(view);
    const rel = view === t ? 'Today' : view === addDays(t, -1) ? 'Yesterday' : WD[d.getDay()];
    const s = streak();

    let week = '';
    for (let i = 6; i >= 0; i--) {
      const ds = addDays(t, -i), dd = parse(ds);
      week += `<button data-day="${ds}" class="${ds === view ? 'sel' : ''}"><span>${WD[dd.getDay()][0]}</span>
        <span class="ring" style="--p:${pct(ds)}"><i>${dd.getDate()}</i></span></button>`;
    }

    let html = `
      <div class="top"><h1>${esc(PLAN.name)}’s knee</h1>${s ? `<span class="streak">${s}-day streak</span>` : ''}</div>
      <div class="daynav">
        <button class="iconbtn" data-nav="-1" aria-label="Previous day">‹</button>
        <div class="label"><b>${rel}</b><span>${WD[d.getDay()]}, ${MON[d.getMonth()]} ${d.getDate()}</span></div>
        <button class="iconbtn" data-nav="1" aria-label="Next day" ${view >= t ? 'disabled' : ''}>›</button>
      </div>
      <div class="week">${week}</div>
      <div class="progress">
        <div class="row"><b>${done} of ${all.length} done</b><span>${done === all.length ? 'All done!' : `${all.length - done} to go`}</span></div>
        <div class="bar"><div style="width:${all.length ? 100 * done / all.length : 0}%"></div></div>
        ${on ? '' : '<div class="offday">Every-other-day exercises are off today — back tomorrow.</div>'}
      </div>`;

    for (const sec of sections) {
      const n = sec.tasks.filter(x => st.done[x.key]).length;
      html += `<div class="section"><h2>${sec.title}</h2><span>${n}/${sec.tasks.length}</span></div>`;
      for (const x of sec.tasks) {
        const ex = LIB[x.it.ex];
        html += `<div class="card ${st.done[x.key] ? 'done' : ''}">
          <button class="open" data-open="${x.key}">
            <div class="thumb"><img src="${IMG}${ex.img}.jpg" alt="" loading="lazy"></div>
            <div class="info"><div class="tag">${tagHTML(x.it)}</div><div class="name">${esc(ex.name)}</div><div class="dose">${dose(ex)}</div></div>
          </button>
          <button class="check" data-check="${x.key}" aria-label="Mark ${esc(ex.name)} done">${CHECK}</button>
        </div>`;
      }
    }

    html += `<div class="pain"><h2>Knee pain ${rel === 'Today' ? 'today' : 'that day'}</h2>
      <p>0 = no pain, 10 = worst pain you can imagine</p><div class="scale">`;
    for (let i = 0; i <= 10; i++) {
      const on = st.pain === i;
      const hue = 130 - i * 13;
      html += `<button data-pain="${i}" class="${on ? 'on' : ''}" style="${on ? `background:hsl(${hue} 60% 42%)` : ''}">${i}</button>`;
    }
    html += `</div><div class="scale-labels"><span>No pain</span><span>Worst</span></div></div>
      <div class="sync" id="sync">${window.SHEET_URL ? (getQueue().length ? 'Waiting to send…' : 'Progress sent ✓') : 'Saved on this phone'}</div>`;

    $('#app').innerHTML = html;
  }

  function toggle(key, force) {
    const st = load(view);
    const on = force !== undefined ? force : !st.done[key];
    if (on) st.done[key] = Date.now(); else delete st.done[key];
    save(view, st);
    render();
  }

  $('#app').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.nav) { view = addDays(view, +b.dataset.nav); render(); window.scrollTo(0, 0); }
    else if (b.dataset.day) { view = b.dataset.day; render(); }
    else if (b.dataset.check) toggle(b.dataset.check);
    else if (b.dataset.open) openDetail(b.dataset.open);
    else if (b.dataset.pain) {
      const st = load(view), v = +b.dataset.pain;
      st.pain = st.pain === v ? null : v; save(view, st); render();
    }
  });

  // ---------- Detail ----------
  const overlay = $('#overlay');
  function closeOverlay() { overlay.hidden = true; overlay.innerHTML = ''; document.body.style.overflow = ''; }
  function showOverlay(html) { overlay.innerHTML = `<div class="inner">${html}</div>`; overlay.hidden = false; overlay.scrollTop = 0; document.body.style.overflow = 'hidden'; }

  function findTask(key) { return tasksFor(view).all.find(x => x.key === key); }

  function openDetail(key) {
    const x = findTask(key); if (!x) return;
    const ex = LIB[x.it.ex], st = load(view), isDone = !!st.done[key];
    const video = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(ex.video);
    showOverlay(`<div class="detail">
      <button class="iconbtn close" data-close aria-label="Close">✕</button>
      <div class="tag">${tagHTML(x.it)}${x.slot ? ' · ' + x.slot : ''}</div>
      <h2>${esc(ex.name)}</h2>
      <div class="pic"><img src="${IMG}${ex.img}.jpg" alt="Drawing of ${esc(ex.name)} from the trainer's sheet"></div>
      <div class="chips"><span class="chip">${dose(ex)}</span>${ex.pace ? `<span class="chip">1 rep every ${ex.pace} sec</span>` : ''}${ex.gear ? `<span class="chip gear">${esc(ex.gear)}</span>` : ''}</div>
      <ol>${ex.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
      ${ex.tip ? `<div class="tipbox">${esc(ex.tip)}</div>` : ''}
      <button class="btn primary" data-timer="${key}">Start timer</button>
      <a class="btn secondary" href="${video}" target="_blank" rel="noopener">Watch a video ↗</a>
      <button class="btn ${isDone ? 'secondary' : 'good'}" data-mark="${key}">${isDone ? 'Mark not done' : 'Mark done ✓'}</button>
    </div>`);
  }

  overlay.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-close')) { stopTimer(); closeOverlay(); }
    else if (b.dataset.mark) { toggle(b.dataset.mark); closeOverlay(); }
    else if (b.dataset.timer) startTimer(b.dataset.timer);
    else if (b.dataset.tctl) timerControl(b.dataset.tctl);
  });

  // ---------- Sound ----------
  let ac = null;
  function audio() {
    try {
      if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
    } catch (e) {}
    return ac;
  }
  function beep(freq = 880, dur = 0.12, when = 0, vol = 0.25) {
    const a = audio(); if (!a) return;
    const o = a.createOscillator(), g = a.createGain(), t = a.currentTime + when;
    o.frequency.value = freq; o.type = 'sine';
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + 0.02);
  }
  const SOUND = {
    Rep: () => beep(880, 0.1),
    Hold: () => { beep(660, 0.12); beep(990, 0.18, 0.13); },
    Relax: () => beep(440, 0.2),
    Rest: () => { beep(523, 0.15); beep(392, 0.3, 0.17); },
    Go: () => beep(1040, 0.15),
    Ride: () => beep(880, 0.2),
    Done: () => { beep(523, 0.15); beep(659, 0.15, 0.16); beep(784, 0.35, 0.32); },
    Tick: () => beep(700, 0.05, 0, 0.12)
  };

  // ---------- Timer ----------
  let T = null, wake = null;

  function phasesFor(ex) {
    const p = [{ label: 'Get ready', secs: 5, kind: 'rest' }];
    if (ex.time) { p.push({ label: 'Ride', secs: ex.time, kind: 'work' }); return p; }
    for (let s = 1; s <= ex.sets; s++) {
      for (let r = 1; r <= ex.reps; r++) {
        if (ex.hold) {
          p.push({ label: 'Hold', secs: ex.hold, kind: 'hold', set: s, rep: r });
          if (r < ex.reps) p.push({ label: 'Relax', secs: ex.relax || 3, kind: 'rest', set: s, rep: r });
        } else {
          p.push({ label: 'Rep', secs: ex.pace || 4, kind: 'work', set: s, rep: r });
        }
      }
      if (s < ex.sets && ex.rest) p.push({ label: 'Rest', secs: ex.rest, kind: 'rest', set: s, after: true });
    }
    return p;
  }

  async function keepAwake(on) {
    try {
      if (on && 'wakeLock' in navigator && !wake) { wake = await navigator.wakeLock.request('screen'); wake.addEventListener('release', () => { wake = null; }); }
      if (!on && wake) { await wake.release(); wake = null; }
    } catch (e) {}
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && T && !T.paused) keepAwake(true); });

  function startTimer(key) {
    const x = findTask(key); if (!x) return;
    const ex = LIB[x.it.ex];
    audio();
    stopTimer();
    T = { key, ex, phases: phasesFor(ex), i: 0, paused: false, endAt: 0, left: 0, lastTick: -1, int: null };
    showOverlay(`<div class="timer">
      <button class="iconbtn close" data-close aria-label="Close">✕</button>
      <div class="tname">${esc(ex.name)}</div>
      <div class="where" id="t-where"></div>
      <div class="dial" id="t-dial"><svg viewBox="0 0 120 120"><circle class="track" cx="60" cy="60" r="52"/><circle class="arc" id="t-arc" cx="60" cy="60" r="52" stroke-dasharray="326.7" stroke-dashoffset="0"/></svg>
        <div class="center"><div class="big" id="t-big"></div><div class="phase" id="t-phase"></div></div></div>
      <div class="controls" id="t-controls">
        <button class="btn secondary" data-tctl="pause" id="t-pause">Pause</button>
        <button class="btn secondary" data-tctl="skip">Skip ›</button>
      </div>
      <div class="pic"><img src="${IMG}${ex.img}.jpg" alt=""></div>
      <div class="hint">Turn your ringer on (switch on the side) to hear the beeps.</div>
    </div>`);
    keepAwake(true);
    enterPhase();
    T.int = setInterval(tick, 100);
  }

  function enterPhase() {
    const ph = T.phases[T.i];
    T.endAt = performance.now() + ph.secs * 1000;
    T.lastTick = -1;
    (SOUND[ph.label] || SOUND.Go)();
    draw();
  }

  function tick() {
    if (!T || T.paused) return;
    const ph = T.phases[T.i];
    const left = (T.endAt - performance.now()) / 1000;
    if (left <= 0) { next(); return; }
    const s = Math.ceil(left);
    if ((ph.label === 'Rest' || ph.label === 'Get ready') && s <= 3 && s !== T.lastTick) { T.lastTick = s; SOUND.Tick(); }
    draw(left);
  }

  function next() {
    T.i++;
    if (T.i >= T.phases.length) return finish();
    enterPhase();
  }

  function draw(left) {
    const ph = T.phases[T.i], ex = T.ex;
    if (left === undefined) left = ph.secs;
    const frac = Math.max(0, Math.min(1, left / ph.secs));
    $('#t-arc').style.strokeDashoffset = String(326.7 * (1 - frac));
    $('#t-dial').className = 'dial ' + (ph.kind === 'hold' ? 'hold' : ph.kind === 'rest' ? 'rest' : '');
    let big, label = ph.label, where = '';
    if (ph.label === 'Rep') { big = ph.rep; label = `of ${ex.reps}`; }
    else if (ph.label === 'Ride') { const m = Math.floor(left / 60), s = Math.ceil(left % 60); big = `${m}:${pad(s === 60 ? 0 : s)}`; }
    else big = Math.ceil(left);
    if (ph.label === 'Hold') label = ex.reps > 1 ? `Hold · rep ${ph.rep} of ${ex.reps}` : 'Hold';
    if (ph.label === 'Relax') label = 'Relax';
    if (ph.label === 'Rest') label = `Rest · next is set ${ph.set + 1}`;
    if (ph.set && ex.sets > 1) where = `Set ${ph.set} of ${ex.sets}`;
    if (ph.label === 'Get ready') where = dose(ex);
    $('#t-big').textContent = big;
    $('#t-phase').textContent = label;
    $('#t-where').textContent = where;
  }

  function timerControl(c) {
    if (!T) return;
    if (c === 'pause') {
      if (T.paused) { T.paused = false; T.endAt = performance.now() + T.left * 1000; keepAwake(true); }
      else { T.paused = true; T.left = (T.endAt - performance.now()) / 1000; }
      $('#t-pause').textContent = T.paused ? 'Resume' : 'Pause';
    } else if (c === 'skip') { if (T.paused) timerControl('pause'); next(); }
    else if (c === 'done') { const k = T.key; stopTimer(); closeOverlay(); toggle(k, true); }
    else if (c === 'again') startTimer(T.key);
  }

  function finish() {
    clearInterval(T.int);
    SOUND.Done();
    keepAwake(false);
    $('#t-arc').style.strokeDashoffset = '0';
    $('#t-dial').className = 'dial';
    $('#t-big').textContent = '✓';
    $('#t-phase').textContent = 'Finished!';
    $('#t-where').textContent = '';
    $('#t-controls').innerHTML = `<button class="btn good" data-tctl="done">Mark done</button><button class="btn secondary" data-tctl="again">Do again</button>`;
  }

  function stopTimer() {
    if (T) clearInterval(T.int);
    T = null; keepAwake(false);
  }

  // ---------- Start ----------
  render();
  flush();
  // Roll over to the new day if the app is left open past midnight.
  let lastDay = today();
  setInterval(() => { const t = today(); if (t !== lastDay) { if (view === lastDay) view = t; lastDay = t; render(); } }, 60000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { const t = today(); if (t !== lastDay) { if (view === lastDay) view = t; lastDay = t; } render(); flush(); } });

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('../sw.js', { scope: '../' }).catch(() => {});
})();
