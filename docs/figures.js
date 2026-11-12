// Stick-figure drawings for each exercise. Dark = body, orange = the part that moves,
// dashed gray = where it starts, gray = equipment, orange arrows = direction of movement.
(function () {
  const INK = '#2b2b2b', HI = '#e8590c', PROP = '#9a9a9a', GHOST = '#bdbdbd';
  const pts = a => a.map(p => p.join(',')).join(' ');
  const pl = (a, c = INK, w = 5, dash) => `<polyline points="${pts(a)}" stroke="${c}" stroke-width="${w}"${dash ? ' stroke-dasharray="5 6"' : ''}/>`;
  const head = ([x, y], c = INK) => `<circle cx="${x}" cy="${y}" r="9" stroke="${c}" stroke-width="5" fill="#fff"/>`;
  const floor = (y = 120, x1 = 10, x2 = 190) => pl([[x1, y], [x2, y]], PROP, 3);
  const arr = d => `<path d="${d}" stroke="${HI}" stroke-width="3" marker-end="url(#ah)"/>`;
  const ln = (x1, y1, x2, y2) => arr(`M${x1} ${y1}L${x2} ${y2}`);
  const both = (x1, y1, x2, y2) => `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${HI}" stroke-width="3" marker-start="url(#ah)" marker-end="url(#ah)"/>`;
  const svg = inner => `<svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round" role="img">` +
    `<defs><marker id="ah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M1 1L8 5L1 9" stroke="${HI}" stroke-width="2" fill="none"/></marker></defs>${inner}</svg>`;
  // body: h head, n neck, p hip, arms [[elbow, hand]...] from neck, legs [[knee, foot]...] from hip, hi = leg indexes in orange
  function body({ h, n, p, arms = [], legs = [], hi = [], torso }) {
    let s = '';
    legs.forEach((l, i) => { s += pl([p, ...l], hi.includes(i) ? HI : INK); });
    s += pl([n, p], torso ? HI : INK);
    arms.forEach(a => { s += pl([n, ...a]); });
    return s + head(h);
  }
  const chair = (x, seatY = 88, w = 34, dir = 1) => pl([[x, 40], [x, 120]], PROP, 4) + pl([[x, seatY], [x + dir * w, seatY], [x + dir * w, 120]], PROP, 4);

  window.FIG = {
    'bike': svg(pl([[48, 36], [60, 96], [96, 96], [96, 120]], PROP, 4) + `<circle cx="146" cy="98" r="15" stroke="${PROP}" stroke-width="4"/>` +
      body({ h: [60, 30], n: [65, 44], p: [80, 90], arms: [[[82, 64], [100, 72]]], legs: [[[116, 70], [140, 90]], [[120, 92], [152, 106]]], hi: [0, 1] }) +
      arr('M172 82 A26 26 0 1 1 150 72') + floor()),
    'heel-slides': svg(floor(118) + pl([[95, 110], [130, 110], [168, 111]], GHOST, 4, true) +
      body({ h: [30, 104], n: [42, 109], p: [95, 110], arms: [[[60, 114], [80, 115]]], legs: [[[120, 76], [134, 112]]], hi: [0] }) +
      ln(170, 126, 140, 126)),
    'ham-long-sit': svg(floor(118) + pl([[150, 114], [152, 100]], INK, 5) +
      body({ h: [116, 66], n: [104, 76], p: [70, 112], arms: [[[124, 90], [146, 102]]], legs: [[[110, 113], [150, 114]]], torso: true }) +
      arr('M84 64 Q100 50 118 52')),
    'ham-towel': svg(floor(118) + pl([[86, 72], [134, 44], [90, 78]], PROP, 3) +
      body({ h: [30, 104], n: [42, 109], p: [95, 110], arms: [[[62, 96], [86, 74]]], legs: [[[114, 78], [132, 46]], [[134, 112], [170, 113]]], hi: [0] }) +
      arr('M152 64 Q150 44 136 34')),
    'quad-prone': svg(floor(118) + pl([[182, 40], [182, 118]], PROP, 5) + pl([[110, 76], [182, 54]], PROP, 2) +
      body({ h: [28, 104], n: [42, 108], p: [96, 109], arms: [[[56, 115], [36, 116]]], legs: [[[134, 110], [110, 76]], [[136, 112], [172, 113]]], hi: [0] }) +
      arr('M100 66 Q92 76 96 92')),
    'gastroc': svg(floor() + pl([[172, 8], [172, 120]], PROP, 5) +
      body({ h: [142, 25], n: [134, 36], p: [108, 72], arms: [[[152, 44], [168, 40]], [[152, 54], [168, 52]]], legs: [[[132, 96], [140, 120]], [[86, 96], [64, 118], [76, 120]]], hi: [1] }) +
      ln(70, 80, 90, 62)),
    'soleus': svg(floor() + pl([[172, 8], [172, 120]], PROP, 5) +
      body({ h: [146, 30], n: [138, 42], p: [114, 78], arms: [[[154, 50], [168, 46]], [[154, 60], [168, 58]]], legs: [[[138, 100], [142, 120]], [[106, 104], [92, 118], [102, 120]]], hi: [1] }) +
      ln(78, 74, 78, 98)),
    'quad-sets': svg(floor(118) + `<circle cx="106" cy="110" r="6" fill="${PROP}" stroke="${PROP}"/>` +
      body({ h: [52, 58], n: [55, 70], p: [62, 110], arms: [[[42, 92], [36, 114]]], legs: [[[106, 102], [150, 108]], [[84, 82], [98, 112]]], hi: [0] }) +
      ln(124, 80, 124, 98)),
    'slr': svg(floor(118) + pl([[95, 110], [132, 111], [168, 112]], GHOST, 4, true) +
      body({ h: [30, 104], n: [42, 109], p: [95, 110], arms: [[[60, 114], [80, 115]]], legs: [[[118, 80], [136, 112]], [[130, 96], [166, 82]]], hi: [1] }) +
      arr('M178 104 Q182 88 172 76')),
    'saq': svg(floor(118) + `<ellipse cx="124" cy="110" rx="18" ry="7" fill="${PROP}" stroke="${PROP}"/>` + pl([[124, 96], [150, 112]], GHOST, 4, true) +
      pl([[96, 112], [140, 115], [176, 116]], PROP, 3) +
      body({ h: [30, 104], n: [42, 109], p: [95, 110], arms: [[[60, 114], [80, 115]]], legs: [[[124, 96], [164, 92]]], hi: [0] }) +
      arr('M156 120 Q172 116 172 100')),
    'bridge': svg(floor(118) + pl([[42, 112], [92, 112]], GHOST, 4, true) +
      body({ h: [28, 106], n: [42, 110], p: [92, 86], arms: [[[60, 114], [80, 115]]], legs: [[[126, 72], [136, 114]]], torso: true }) +
      ln(92, 116, 92, 100)),
    'clamshell': svg(floor(122) + pl([[122, 104], [126, 96]], PROP, 7) +
      body({ h: [28, 96], n: [42, 102], p: [95, 106], arms: [[[56, 116], [74, 116]]], legs: [[[132, 114], [158, 116]], [[130, 84], [158, 114]]], hi: [1] }) +
      arr('M148 92 Q146 76 134 72')),
    'laq': svg(floor() + chair(58, 82, 42) + pl([[110, 80], [110, 118]], GHOST, 4, true) +
      body({ h: [72, 26], n: [72, 38], p: [76, 78], arms: [[[82, 58], [96, 76]]], legs: [[[110, 80], [154, 72]]], hi: [0] }) +
      arr('M118 112 Q150 108 156 84')),
    'knee-curl': svg(floor() + chair(132, 92, 32) +
      body({ h: [100, 22], n: [100, 34], p: [100, 72], arms: [[[112, 52], [130, 60]]], legs: [[[100, 96], [100, 120]], [[102, 98], [78, 80]]], hi: [1] }) +
      arr('M78 112 Q64 100 70 86')),
    'sit-stand': svg(floor() + chair(40, 86, 34) +
      body({ h: [118, 34], n: [110, 45], p: [86, 82], arms: [[[126, 58], [142, 62]]], legs: [[[116, 90], [110, 120]]], hi: [0] }) +
      both(164, 50, 164, 100)),
    'heel-raise': svg(floor() + chair(124, 90, 30) +
      body({ h: [90, 18], n: [90, 30], p: [90, 68], arms: [[[100, 50], [122, 60]]], legs: [[[90, 90], [90, 108], [98, 120]]], hi: [0] }) +
      ln(64, 116, 64, 92)),
    'balance': svg(floor() +
      body({ h: [100, 22], n: [100, 34], p: [100, 72], arms: [[[82, 48], [64, 56]], [[118, 48], [136, 56]]], legs: [[[100, 96], [100, 120]], [[104, 96], [82, 104]]], hi: [0] })),
    'lunge-trainer': svg(floor() + `<ellipse cx="146" cy="116" rx="20" ry="5" fill="${PROP}" stroke="${PROP}"/>` +
      body({ h: [100, 22], n: [100, 34], p: [100, 72], arms: [[[88, 52], [98, 70]]], legs: [[[134, 88], [146, 110]], [[76, 104], [58, 120]]], hi: [0] }) +
      ln(124, 28, 124, 52)),
    'squat-single': svg(floor() + pl([[140, 62], [192, 62]], PROP, 5) + pl([[186, 62], [186, 120]], PROP, 4) +
      body({ h: [104, 26], n: [102, 38], p: [94, 76], arms: [[[118, 52], [140, 60]]], legs: [[[112, 98], [100, 120]], [[88, 100], [72, 96]]], hi: [0] }) +
      ln(66, 40, 66, 64)),
    'step-lateral': svg(floor() + `<rect x="80" y="96" width="60" height="24" stroke="${PROP}" stroke-width="4"/>` +
      body({ h: [108, 16], n: [108, 28], p: [108, 58], arms: [[[96, 42], [90, 58]], [[120, 42], [126, 58]]], legs: [[[110, 76], [112, 94]], [[94, 80], [80, 104]]], hi: [0] }) +
      both(60, 82, 60, 114)),
    'wall-slide': svg(floor() + pl([[38, 6], [38, 120]], PROP, 5) + `<circle cx="57" cy="62" r="14" fill="#f2f2f2" stroke="${PROP}" stroke-width="3"/>` +
      body({ h: [76, 22], n: [75, 34], p: [75, 86], arms: [[[92, 54], [108, 62]]], legs: [[[115, 86], [115, 120]]], hi: [0] }) +
      ln(146, 36, 146, 70)),
    'lunge-forward': svg(floor() + pl([[100, 72], [100, 96], [100, 120]], GHOST, 4, true) +
      body({ h: [100, 22], n: [100, 34], p: [100, 72], arms: [[[88, 52], [98, 70]]], legs: [[[132, 88], [140, 120]], [[78, 108], [58, 120]]], hi: [0] }) +
      ln(114, 127, 146, 127)),
    'side-step': svg(floor() +
      body({ h: [100, 26], n: [100, 38], p: [100, 74], arms: [[[86, 54], [80, 70]], [[114, 54], [120, 70]]], legs: [[[82, 94], [78, 120]], [[118, 94], [122, 120]]], hi: [0, 1] }) +
      ln(60, 84, 26, 84) + ln(140, 84, 174, 84))
  };
})();
