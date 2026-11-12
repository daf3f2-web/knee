// Exercise library and each kid's plan, copied from the trainer's sheets
// (Chris Fong, LAT — sheets dated 9/24/2026 and 10/7/2026).
//
// Dosage fields:
//   sets, reps   how many
//   hold         seconds to hold each rep (stretches, quad sets, wall slides)
//   pace         seconds per rep for the beeping pacer (sheet says 1 rep every 4 sec)
//   rest         seconds of rest between sets
//   time         seconds for a timed exercise (bike)
//   relax        seconds between held reps
//   gear         equipment to grab

window.LIB = {
  'bike': {
    name: 'Recumbent bike', img: 'bike', time: 600,
    steps: ['Sit in the recumbent bike.', 'Put your feet on the pedals.', 'Start cycling.'],
    video: 'recumbent bike knee rehab exercise'
  },
  'heel-slides': {
    name: 'Heel slides', img: 'heel-slides', sets: 1, reps: 30, pace: 4,
    steps: ['Lie on your back with legs straight.', 'Slide your heel up toward your buttocks.', 'Slide back to the start.'],
    video: 'heel slides knee exercise physical therapy'
  },
  'ham-long-sit': {
    name: 'Hamstring stretch, sitting', img: 'ham-long-sit', sets: 1, reps: 4, hold: 30, relax: 5,
    steps: ['Sit on a firm surface with legs straight out in front.', 'Slowly bend forward at the hips, reaching for your toes.'],
    tip: "Don't let your knees bend.",
    video: 'long sitting hamstring stretch'
  },
  'ham-towel': {
    name: 'Hamstring stretch with towel', img: 'ham-towel', sets: 1, reps: 4, hold: 30, relax: 5, gear: 'Towel',
    steps: ['Lie on your back with a towel looped under one foot, knee straight.', 'Gently pull the leg up.', 'Repeat with the other leg.'],
    tip: 'Keep the knee straight.',
    video: 'supine hamstring stretch with towel'
  },
  'quad-prone': {
    name: 'Quad stretch, face down', img: 'quad-prone', sets: 1, reps: 4, hold: 30, relax: 5, gear: 'Elastic band',
    steps: ['Tie the elastic to something secure and loop it on your ankle.', 'Lie face down.', 'Relax the leg and let the elastic pull your ankle toward your buttocks.'],
    video: 'prone quad stretch with strap'
  },
  'gastroc': {
    name: 'Calf stretch (straight knee)', img: 'gastroc', sets: 1, reps: 4, hold: 30, relax: 5,
    steps: ['Stand facing a wall, hands on the wall.', 'Step forward with your good leg and lean your hips toward the wall.', 'Keep the back leg straight with the heel on the floor.'],
    video: 'standing gastrocnemius calf stretch wall'
  },
  'soleus': {
    name: 'Calf stretch (bent knee)', img: 'soleus', sets: 1, reps: 4, hold: 30, relax: 5,
    steps: ['Stand with one leg in front of the other, hands on a wall.', 'Slowly bend both knees, keeping heels on the floor, until you feel a stretch.', 'Repeat with the other leg in front.'],
    video: 'standing soleus stretch wall'
  },
  'quad-sets': {
    name: 'Quad sets', img: 'quad-sets', sets: 1, reps: 10, hold: 10, relax: 3, gear: 'Rolled towel',
    steps: ['Sit with your leg straight, a rolled towel under the knee.', 'Tighten the thigh muscle, pushing the back of the knee down into the towel.'],
    tip: "Don't hold your breath.",
    video: 'quad sets exercise towel roll'
  },
  'slr': {
    name: 'Straight leg raise', img: 'slr', sets: 3, reps: 10, pace: 4, rest: 60,
    steps: ['Lie on your back with your good knee bent.', 'Lift the straight leg up to the height of the bent knee.', 'Lower it back down.'],
    video: 'straight leg raise knee exercise'
  },
  'saq': {
    name: 'Short arc quads', img: 'saq', sets: 3, reps: 10, pace: 4, rest: 60, gear: 'Pillow',
    steps: ['Lie on your back with the knee bent about 45° over a pillow.', 'Straighten the leg at the knee.', 'Lower it back down.'],
    video: 'short arc quad exercise'
  },
  'bridge': {
    name: 'Bridges', img: 'bridge', sets: 3, reps: 10, pace: 4, rest: 60,
    steps: ['Lie on your back with knees bent.', 'Lift your buttocks off the floor.', 'Lower back down.'],
    tip: 'Keep your back in a neutral position.',
    video: 'glute bridge exercise physical therapy'
  },
  'clamshell': {
    name: 'Clamshells with band', img: 'clamshell', sets: 3, reps: 10, pace: 4, rest: 60, gear: 'Elastic band',
    steps: ['Lie on your side, knees bent, band around thighs just above the knees.', 'Keep heels together and lift the top knee.', 'Lower and repeat.', 'Switch sides and do the other leg.'],
    video: 'clamshell exercise with band'
  },
  'laq': {
    name: 'Long arc quads (sitting)', img: 'laq', sets: 3, reps: 10, pace: 4, rest: 60,
    steps: ['Sit with the knee bent to 90°.', 'Straighten the leg at the knee.', 'Lower it back down.'],
    video: 'long arc quad seated knee extension'
  },
  'knee-curl': {
    name: 'Standing knee curl', img: 'knee-curl', sets: 3, reps: 10, pace: 4, rest: 60,
    steps: ['Stand and bend the knee, bringing your heel toward your buttocks as far as it goes.', 'Lower it back down.'],
    tip: "Don't bend at the hips.",
    video: 'standing hamstring curl knee flexion'
  },
  'sit-stand': {
    name: 'Chair squats', img: 'sit-stand', sets: 3, reps: 10, pace: 4, rest: 60, gear: 'Chair',
    steps: ['Stand with a chair behind you.', 'Lean forward a little and bend your knees, lowering toward the chair as if to sit.', 'Before you touch the chair, stand back up.'],
    video: 'sit to stand chair squat exercise'
  },
  'heel-raise': {
    name: 'Heel raises', img: 'heel-raise', sets: 3, reps: 10, pace: 4, rest: 60, gear: 'Chair for balance',
    steps: ['Stand holding a chair for balance.', 'Rise up on your toes as high as you can.', 'Lower back down.'],
    video: 'double leg heel raise exercise'
  },
  'balance': {
    name: 'Single-leg balance', img: 'balance', sets: 4, reps: 1, hold: 30, rest: 60,
    steps: ['Stand on a firm surface, arms at your sides.', 'Lift one foot and balance on the other leg.', 'Aim for 20–30 seconds.'],
    tip: 'If you need help balancing, raise your arms out to the sides.',
    video: 'single leg balance exercise eyes open'
  },
  'lunge-trainer': {
    name: 'Lunge onto balance pad', img: 'lunge-trainer', sets: 3, reps: 20, pace: 4, rest: 60, gear: 'Stability trainer (pad)',
    steps: ['Put the stability trainer on the floor in front of you.', 'Step forward onto it.', 'Slowly bend your knees and lunge down, back straight, keeping your balance.', 'Push back up to standing.'],
    tip: 'To make it harder: do it with your eyes closed.',
    video: 'lunge onto balance pad stability trainer'
  },
  'squat-single': {
    name: 'Single-leg mini squat', img: 'squat-single', sets: 3, reps: 20, hold: 5, relax: 2, rest: 60, gear: 'Table or counter for support',
    steps: ['Stand on one leg, holding a table for balance.', 'Slowly bend the knee to about 45°.', 'Hold 5 seconds, then stand back up.', 'Repeat with the other leg.'],
    tip: 'Keep good low-back posture.',
    video: 'single leg partial squat with support'
  },
  'step-lateral': {
    name: 'Side step-ups', img: 'step-lateral', sets: 3, reps: 20, pace: 4, rest: 60, gear: 'Step',
    steps: ['Put the injured leg on the edge of a step.', 'Step up, lifting the other leg off the floor.', 'Lower the other foot toward the floor but don’t touch.', 'Step up again.'],
    video: 'lateral step up knee exercise'
  },
  'wall-slide': {
    name: 'Wall slides with ball', img: 'wall-slide', sets: 3, reps: 20, hold: 5, relax: 2, rest: 60, gear: 'Exercise ball',
    steps: ['Put the ball between your back and the wall.', 'Slowly bend your knees to 90°.', 'Hold 5 seconds, then stand back up.'],
    tip: 'Keep good low-back posture.',
    video: 'wall squat with exercise ball'
  },
  'lunge-forward': {
    name: 'Forward lunges', img: 'lunge-forward', sets: 3, reps: 20, pace: 4, rest: 60,
    steps: ['Stand tall.', 'Step forward into a lunge, keeping your body upright.', 'Push back up to the start.'],
    video: 'forward lunge exercise proper form'
  },
  'side-step': {
    name: 'Quick side steps in a crouch', img: 'side-step', sets: 3, reps: 20, pace: 4, rest: 60,
    steps: ['Stand with feet shoulder-width apart.', 'Bend your knees slightly into a crouch.', 'Quickly side-step twice one way.', 'Stop, then quickly side-step twice the other way.'],
    tip: 'Tape on the floor helps keep the steps even.',
    video: 'lateral shuffle crouch agility drill'
  }
};

// freq: 'twice' = morning + evening, 'daily' = once a day, 'eod' = every other day
// num: the number written on the paper sheet; sheet: which sheet it's on; star: starred on the sheet
window.PLANS = {
  mateo: {
    name: 'Mateo',
    items: [
      { ex: 'heel-slides',  num: 1,  sheet: '9/24', freq: 'twice' },
      { ex: 'ham-long-sit', num: 2,  sheet: '9/24', freq: 'twice' },
      { ex: 'ham-towel',    num: 3,  sheet: '9/24', freq: 'twice', star: true },
      { ex: 'quad-prone',   num: 4,  sheet: '9/24', freq: 'twice', star: true },
      { ex: 'gastroc',      num: 5,  sheet: '9/24', freq: 'twice' },
      { ex: 'soleus',       num: 6,  sheet: '9/24', freq: 'twice' },
      { ex: 'quad-sets',    num: 7,  sheet: '9/24', freq: 'twice', star: true },
      { ex: 'slr',          num: 8,  sheet: '9/24', freq: 'eod' },
      { ex: 'saq',          num: 9,  sheet: '9/24', freq: 'eod' },
      { ex: 'bridge',       num: 10, sheet: '9/24', freq: 'eod' },
      { ex: 'laq',          num: 11, sheet: '9/24', freq: 'eod' },
      { ex: 'knee-curl',    num: 12, sheet: '9/24', freq: 'eod' },
      { ex: 'sit-stand',    num: 13, sheet: '9/24', freq: 'eod' },
      { ex: 'heel-raise',   num: 14, sheet: '9/24', freq: 'eod' },
      { ex: 'balance',      num: 15, sheet: '9/24', freq: 'eod' },
      { ex: 'lunge-trainer',num: 16, sheet: '10/7', freq: 'daily' },
      { ex: 'squat-single', num: 17, sheet: '10/7', freq: 'daily' },
      { ex: 'step-lateral', num: 18, sheet: '10/7', freq: 'daily' },
      { ex: 'wall-slide',   num: 19, sheet: '10/7', freq: 'daily' }
    ]
  },
  kristen: {
    name: 'Kristen',
    items: [
      { ex: 'bike',         num: 1,  sheet: '9/24', freq: 'daily' },
      { ex: 'heel-slides',  num: 2,  sheet: '9/24', freq: 'twice' },
      { ex: 'ham-long-sit', num: 3,  sheet: '9/24', freq: 'twice' },
      { ex: 'ham-towel',    num: 4,  sheet: '9/24', freq: 'twice', star: true },
      { ex: 'quad-prone',   num: 5,  sheet: '9/24', freq: 'twice', star: true },
      { ex: 'gastroc',      num: 6,  sheet: '9/24', freq: 'twice' },
      { ex: 'soleus',       num: 7,  sheet: '9/24', freq: 'twice' },
      { ex: 'quad-sets',    num: 8,  sheet: '9/24', freq: 'twice', star: true },
      { ex: 'slr',          num: 9,  sheet: '9/24', freq: 'eod' },
      { ex: 'saq',          num: 10, sheet: '9/24', freq: 'eod' },
      { ex: 'bridge',       num: 11, sheet: '9/24', freq: 'eod' },
      { ex: 'clamshell',    num: 12, sheet: '9/24', freq: 'eod' },
      { ex: 'laq',          num: 13, sheet: '9/24', freq: 'eod' },
      { ex: 'knee-curl',    num: 14, sheet: '9/24', freq: 'eod' },
      { ex: 'sit-stand',    num: 15, sheet: '9/24', freq: 'eod' },
      { ex: 'heel-raise',   num: 16, sheet: '9/24', freq: 'eod' },
      { ex: 'balance',      num: 17, sheet: '9/24', freq: 'eod' },
      { ex: 'lunge-forward',num: 1,  sheet: '10/7', freq: 'daily' },
      { ex: 'squat-single', num: 2,  sheet: '10/7', freq: 'daily' },
      { ex: 'side-step',    num: 3,  sheet: '10/7', freq: 'daily' },
      { ex: 'step-lateral', num: 4,  sheet: '10/7', freq: 'daily' },
      { ex: 'wall-slide',   num: 5,  sheet: '10/7', freq: 'daily' }
    ]
  }
};

// Every-other-day exercises are "on" on this date and every second day after it.
window.EOD_START = '2026-11-12';
