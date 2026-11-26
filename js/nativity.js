// Christmas Bible stories: four fixed retellings of the Nativity (Luke 1-2, Matthew 1-2)
// with their own illustrations. Uses the same reader as the generated stories.
import { rng, O, INK, both, starPath, stars, delay, sparkles, tapWrap } from './scenes.js';

/* ---------- people ---------- */

const CAST = {
  mary: { robe: '#5b8fd6', trim: '#ffffff', head: 'veil', headCol: '#3f6fb5', skin: '#e0ac7e', hair: '#4a3426' },
  joseph: { robe: '#9c6b3f', trim: '#e9d8a6', head: 'scarf', headCol: '#f1e3c6', band: '#7a3b2e', beard: true, skin: '#c98d5f', hair: '#4a3426', staff: true },
  angel: { robe: '#ffffff', trim: '#ffe9a8', head: 'none', hair: '#f2c14e', skin: '#f0c39a', wings: true, halo: true },
  shepherd1: { robe: '#b5835a', trim: '#e76f51', head: 'scarf', headCol: '#e9d8a6', band: '#5b3a29', beard: true, staff: true, skin: '#a8703f', hair: '#3a2c2c' },
  shepherd2: { robe: '#7a9e7e', head: 'scarf', headCol: '#ffffff', band: '#b5651d', staff: true, skin: '#e0ac7e', hair: '#4a3426' },
  shepherd3: { robe: '#d9a45f', trim: '#8d5a3b', head: 'none', hair: '#3a2c2c', skin: '#c98d5f' },
  king1: { robe: '#7b2cbf', trim: '#ffd166', head: 'crown', beard: true, hair: '#e8e8e8', skin: '#c98d5f', gift: 'gold' },
  king2: { robe: '#2a9d8f', trim: '#ffd166', head: 'turban', headCol: '#f4a261', skin: '#7a4a2b', hair: '#2b1d14', gift: 'frank' },
  king3: { robe: '#d1495b', trim: '#ffd166', head: 'crown', beard: true, hair: '#3a2c2c', skin: '#e0ac7e', gift: 'myrrh' },
};

function person(c, mood, gid) {
  const { robe, trim, skin, hair, head, headCol, band } = c;
  let s = '';
  if (c.wings)
    s += `<circle class="glow" cy="-6" r="86" fill="url(#${gid})"/>` +
      both(`<g class="wing"><path d="M-12,-12 C-58,-58 -78,-10 -54,30 C-46,14 -32,10 -16,16Z" fill="#fff" ${O}/><path d="M-24,-8 C-44,-30 -58,-8 -48,12" fill="none" stroke="#d5deef" stroke-width="2"/></g>`);
  if (head === 'veil') s += `<path d="M-27,-34 a27,28 0 0 1 54,0 L31,10 Q0,18 -31,10Z" fill="${headCol}" ${O}/>`;
  if (head === 'scarf') s += `<path d="M-25,-36 a25,26 0 0 1 50,0 L27,-4 Q0,4 -27,-4Z" fill="${headCol}" ${O}/>`;
  if (c.staff) s += `<path d="M31,62 V-44 q0,-14 -13,-11" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M31,62 V-44 q0,-14 -13,-11" fill="none" stroke="#a9744f" stroke-width="3" stroke-linecap="round"/>`;
  s += both(`<ellipse cx="-10" cy="61" rx="9" ry="4.5" fill="#7a5c3e" ${O}/>`);
  s += `<path d="M-20,-14 Q-27,30 -25,60 H25 Q27,30 20,-14 Q0,-22 -20,-14Z" fill="${robe}" ${O}/>`;
  if (trim) s += `<path d="M-5,-16 L-7,59 H7 L5,-16Z" fill="${trim}" opacity=".9"/>`;
  s += both(`<g class="arm"><ellipse cx="-24" cy="12" rx="7" ry="16" fill="${robe}" ${O} transform="rotate(14 -24 12)"/><circle cx="-28" cy="28" r="4.5" fill="${skin}" ${O}/></g>`);
  if (c.gift === 'gold') s += `<rect x="20" y="17" width="18" height="14" rx="2" fill="#ffd166" ${O}/><path d="M20,22 h18 M29,17 v14" stroke="${INK}" stroke-width="1.6"/>`;
  if (c.gift === 'frank') s += `<path d="M22,32 q-4,-11 7,-15 q11,4 7,15z" fill="#9ad1d4" ${O}/><circle cx="29" cy="14" r="3.2" fill="#ffd166" ${O}/>`;
  if (c.gift === 'myrrh') s += `<rect x="22" y="17" width="14" height="16" rx="5" fill="#c77dff" ${O}/><rect x="26" y="11" width="6" height="7" fill="#ffd166" ${O}/>`;
  s += `<circle cx="0" cy="-34" r="21" fill="${skin}" ${O}/>`;
  if (c.beard) s += `<path d="M-19,-31 Q-18,-6 0,-3 Q18,-6 19,-31 Q0,-13 -19,-31Z" fill="${hair}" ${O}/>`;
  const cap = `<path d="M-21,-37 a21,21 0 0 1 42,0 Q0,-49 -21,-37Z"`;
  if (head === 'veil') s += `${cap} fill="${headCol}" ${O}/>`;
  if (head === 'scarf') s += `${cap} fill="${headCol}" ${O}/><path d="M-21,-40 Q0,-51 21,-40" fill="none" stroke="${band}" stroke-width="4" stroke-linecap="round"/>`;
  if (head === 'none') s += `<path d="M-21,-34 a21,21 0 0 1 42,0 Q8,-51 -21,-34Z" fill="${hair}" ${O}/>`;
  if (head === 'crown') s += `${cap} fill="${hair}" ${O}/><path d="M-15,-50 v-15 l7.5,8 l7.5,-11 l7.5,11 l7.5,-8 v15z" fill="#ffd166" ${O}/><circle cx="0" cy="-55" r="2.5" fill="#d1495b"/>`;
  if (head === 'turban') s += `<ellipse cx="0" cy="-51" rx="23" ry="12" fill="${headCol}" ${O}/><path d="M-20,-50 Q0,-42 20,-50" fill="none" stroke="${INK}" stroke-width="1.6"/><circle cx="0" cy="-55" r="4" fill="#ffd166" ${O}/>`;

  if (mood === 'pray' || mood === 'sleep') s += both(`<path d="M-12,-35 q4,4 8,0" fill="none" ${O}/>`);
  else s += `<g class="eyes">${both(`<circle cx="-8" cy="-36" r="3.2" fill="#3a2c2c"/>`)}<circle cx="-7" cy="-37" r="1.1" fill="#fff"/><circle cx="9" cy="-37" r="1.1" fill="#fff"/></g>`;
  if (mood === 'worried') s += `<path d="M-13,-43 l7,-3 M13,-43 l-7,-3" fill="none" ${O}/>`;
  s += both(`<circle cx="-14" cy="-29" r="4" fill="#ff8fa3" opacity=".4"/>`);
  s += {
    wow: `<ellipse cx="0" cy="-26" rx="3.5" ry="4.5" fill="#7a3b3b" ${O}/>`,
    worried: `<path d="M-5,-25 q5,-4 10,0" fill="none" ${O}/>`,
  }[mood] || `<path d="M-5,-28 q5,5 10,0" fill="none" ${O}/>`;
  if (c.halo) s += `<ellipse class="glow" cx="0" cy="-64" rx="18" ry="6" fill="none" stroke="#ffe066" stroke-width="4"/>`;
  return s;
}

/* ---------- animals and the manger ---------- */

function sheep() {
  const puffs = [[-10, 0, 13], [4, -4, 14], [16, 2, 12], [2, 6, 13], [-2, -9, 10]];
  return `<path d="M-12,10 v15 M-4,12 v14 M8,12 v14 M15,10 v15" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
    puffs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + 2.5}" fill="${INK}"/>`).join('') +
    puffs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`).join('') +
    `<ellipse cx="-14" cy="-13" rx="6" ry="3.5" fill="#5b4a4a" ${O} transform="rotate(25 -14 -13)"/><ellipse cx="-22" cy="-6" rx="9" ry="10" fill="#5b4a4a" ${O}/><circle cx="-19" cy="-16" r="6" fill="#fff"/><circle cx="-25" cy="-8" r="2" fill="#fff"/>`;
}

function donkey() {
  const legs = 'M-18,12 v24 M-8,14 v22 M12,14 v22 M22,12 v24';
  return `<path d="${legs}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="${legs}" stroke="#8f8d9b" stroke-width="4.5" stroke-linecap="round"/>` +
    `<path d="M30,-4 q10,6 8,20" fill="none" ${O}/><ellipse cx="2" cy="2" rx="30" ry="17" fill="#a9a7b4" ${O}/>` +
    `<ellipse cx="-31" cy="-50" rx="4.5" ry="13" fill="#a9a7b4" ${O} transform="rotate(-12 -31 -50)"/><ellipse cx="-22" cy="-48" rx="4.5" ry="13" fill="#a9a7b4" ${O} transform="rotate(12 -22 -48)"/>` +
    `<path d="M-22,-4 L-36,-30 L-22,-38 L-6,-10Z" fill="#a9a7b4" ${O}/><ellipse cx="-38" cy="-32" rx="15" ry="10" fill="#a9a7b4" ${O} transform="rotate(20 -38 -32)"/>` +
    `<ellipse cx="-48" cy="-27" rx="7" ry="6" fill="#e6e3ec" ${O}/><circle cx="-37" cy="-36" r="2.4" fill="#3a2c2c"/>` +
    `<path d="M-12,-15 h26 v19 h-26z" fill="#e76f51" ${O}/><path d="M-12,-9 h26 M-12,-2 h26" stroke="#ffd166" stroke-width="2"/>`;
}

function camel() {
  const legs = 'M-22,10 v40 M-10,12 v38 M14,12 v38 M26,10 v40';
  return `<path d="${legs}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="${legs}" stroke="#cf9a55" stroke-width="4.5" stroke-linecap="round"/>` +
    `<path d="M36,2 q8,6 6,18" fill="none" ${O}/>` +
    `<path d="M-30,2 Q-50,-10 -47,-46 L-36,-47 Q-36,-16 -18,-8Z" fill="#e0b070" ${O}/>` +
    `<path d="M-34,6 Q-34,-14 -14,-14 Q-2,-42 10,-14 Q36,-16 36,6 Q36,20 0,20 Q-34,20 -34,6Z" fill="#e0b070" ${O}/>` +
    `<ellipse cx="-40" cy="-58" rx="3" ry="5" fill="#e0b070" ${O}/><ellipse cx="-50" cy="-50" rx="13" ry="8" fill="#e0b070" ${O}/><circle cx="-52" cy="-53" r="2.2" fill="#3a2c2c"/><path d="M-60,-47 q3,2 6,0" fill="none" stroke="${INK}" stroke-width="1.6"/>` +
    `<path d="M-13,-10 Q-2,-36 10,-10 L12,8 H-15Z" fill="#9d4edd" ${O}/><path d="M-14,2 H11" stroke="#ffd166" stroke-width="3"/>`;
}

function manger(gid) {
  const x = 'M-22,24 L14,-4 M22,24 L-14,-4';
  return `<circle class="glow" cy="-14" r="60" fill="url(#${gid})"/>` +
    `<path d="${x}" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="${x}" stroke="#a9744f" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M-30,-10 l-6,-10 M-22,-10 l-3,-13 M14,-11 l3,-11 M24,-10 l5,-13 M31,-10 l7,-8" stroke="#f2c14e" stroke-width="3" stroke-linecap="round"/>` +
    `<path d="M-30,-9 Q0,-24 30,-9Z" fill="#f2c14e" ${O}/><path d="M-33,-10 H33 L25,9 H-25Z" fill="#b5651d" ${O}/>` +
    `<ellipse cx="5" cy="-19" rx="20" ry="9" fill="#fff" ${O}/><path d="M-2,-27 q4,8 0,16 M10,-28 q4,9 0,18" fill="none" stroke="#cdd6e6" stroke-width="1.8"/>` +
    `<circle cx="-16" cy="-23" r="9.5" fill="#e8b98c" ${O}/><path d="M-21,-24 q2,2 4,0 M-14,-24 q2,2 4,0" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/><path d="M-18,-19 q2.5,2.5 5,0" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`;
}

/* ---------- places ---------- */

const NSKY = { day: ['#8fd3ff', '#ffe9c2'], dusk: ['#5b3a8c', '#f6a06a'], night: ['#0b1033', '#3b2f7a'] };

function bigStar(x, y, gid) {
  return tapWrap(x, y, 1, 'star', `<g class="tappable"><circle class="glow" r="58" fill="url(#${gid})"/><path d="M-3,0 L0,150 L3,0Z" fill="#fff6c9" opacity=".3"/><path d="${starPath(0, 0, 34, 6, 4)}" fill="#fff3a8"/><g transform="rotate(45)"><path d="${starPath(0, 0, 18, 5, 4)}" fill="#ffe066"/></g><circle r="7" fill="#fff"/></g>`);
}

function house(x, w, h, night, dome) {
  const wall = night ? '#8b7a9c' : '#ecd2a8', win = night ? '#ffe066' : '#7a5c3e';
  const top = dome ? `<path d="M${x + w * 0.2},${300 - h} a${w * 0.3},${w * 0.26} 0 0 1 ${w * 0.6},0z" fill="${wall}" ${O}/>` : '';
  return `${top}<rect x="${x}" y="${300 - h}" width="${w}" height="${h + 6}" fill="${wall}" ${O}/>` +
    `<path d="M${x + w / 2 - 9},306 v-24 a9,9 0 0 1 18,0 v24z" fill="#7a5c3e" ${O}/>` +
    `<rect x="${x + 8}" y="${300 - h + 14}" width="11" height="14" rx="5" fill="${win}" ${O}/><rect x="${x + w - 20}" y="${300 - h + 14}" width="11" height="14" rx="5" fill="${win}" ${O}/>`;
}

function place(bg, time, star, r, id) {
  const night = time === 'night';
  const [a, b] = NSKY[time] || NSKY.night;
  let s = `<defs><linearGradient id="nsky${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient><radialGradient id="${id}"><stop offset="0" stop-color="#fff6c9" stop-opacity=".8"/><stop offset=".45" stop-color="#fff6c9" stop-opacity=".35"/><stop offset="1" stop-color="#fff6c9" stop-opacity="0"/></radialGradient></defs><rect width="400" height="400" fill="url(#nsky${id})"/>`;
  const outdoors = bg !== 'room';
  if (outdoors && time !== 'day') s += stars(r, night ? 46 : 14, 280);
  if (outdoors && time === 'day') s += `<circle cx="96" cy="150" r="24" fill="#ffd94a"/>`;

  if (bg === 'hills') {
    s += `<path d="M0,292 Q90,236 190,272 T400,246 V400 H0Z" fill="${night ? '#27456b' : '#a8dc8c'}"/>`;
    s += `<g opacity=".9">${[[40, 262, 16], [58, 256, 20], [80, 262, 14]].map(([x, y, w]) => `<rect x="${x}" y="${y - w}" width="${w}" height="${w}" fill="${night ? '#55507e' : '#ecd2a8'}"/><rect x="${x + w / 2 - 2}" y="${y - w + 4}" width="4" height="5" fill="#ffe066"/>`).join('')}</g>`;
    s += `<path d="M0,304 Q200,276 400,304 V400 H0Z" fill="${night ? '#3f6b57' : '#7ccf6b'}"/><path d="M0,356 Q200,336 400,360 V400 H0Z" fill="${night ? '#35594a' : '#69bd5c'}"/>`;
    for (let i = 0; i < 9; i++) { const x = 20 + r() * 360, y = 346 + r() * 44; s += `<path d="M${x.toFixed(0)},${y.toFixed(0)} l-4,-9 M${x.toFixed(0)},${y.toFixed(0)} l0,-11 M${x.toFixed(0)},${y.toFixed(0)} l4,-9" stroke="${night ? '#5f9478' : '#4fa64c'}" stroke-width="2" stroke-linecap="round"/>`; }
  } else if (bg === 'desert') {
    s += `<path d="M0,296 Q110,226 220,280 T400,250 V400 H0Z" fill="${night ? '#6b5a7e' : '#e3b877'}"/>`;
    s += `<g transform="translate(74 300)"><g class="tappable" data-tap="prop"><path d="M0,0 Q-8,-50 6,-96" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M0,0 Q-8,-50 6,-96" fill="none" stroke="#8d5a3b" stroke-width="7" stroke-linecap="round"/><g fill="${night ? '#3c7a5d' : '#4fb06d'}" ${O}><path d="M6,-96 Q-30,-120 -50,-92 Q-24,-100 6,-96Z"/><path d="M6,-96 Q40,-124 62,-96 Q34,-102 6,-96Z"/><path d="M6,-96 Q-14,-134 -40,-124 Q-12,-118 6,-96Z"/><path d="M6,-96 Q28,-136 52,-126 Q24,-118 6,-96Z"/></g></g></g>`;
    s += `<path d="M0,306 Q200,280 400,306 V400 H0Z" fill="${night ? '#857399' : '#f1d9a0'}"/><path d="M0,360 Q160,338 400,364 V400 H0Z" fill="${night ? '#766589' : '#e6c789'}"/>`;
  } else if (bg === 'town') {
    s += house(18, 84, 104, time !== 'day', true) + house(104, 70, 74, time !== 'day') + house(250, 76, 92, time !== 'day') + house(326, 70, 122, time !== 'day', true);
    s += `<path d="M0,304 Q200,292 400,304 V400 H0Z" fill="${night ? '#857399' : time === 'dusk' ? '#d9a877' : '#f1d9a0'}"/>`;
  } else if (bg === 'room') {
    s += `<rect width="400" height="400" fill="${night ? '#6f6187' : '#f6e3c5'}"/>`;
    s += `<path d="M256,214 v-64 a34,34 0 0 1 68,0 v64z" fill="url(#nsky${id})" ${O}/>`;
    if (night) s += `<g transform="translate(290 162) scale(.42)"><path d="${starPath(0, 0, 34, 6, 4)}" fill="#fff3a8"/><circle r="7" fill="#fff"/></g>`;
    s += `<path d="M250,216 h80" ${O}/><path d="M0,304 H400 V400 H0Z" fill="${night ? '#5b4a5f' : '#c98b5e'}"/><ellipse cx="200" cy="352" rx="150" ry="26" fill="${night ? '#8a5a6a' : '#e76f51'}" opacity=".85"/><ellipse cx="200" cy="352" rx="118" ry="18" fill="none" stroke="#ffd166" stroke-width="3" opacity=".8"/>`;
    s += `<g transform="translate(86 304)"><g class="tappable" data-tap="prop"><path d="M-14,0 q-10,-26 0,-42 h28 q10,16 0,42z" fill="#c9764a" ${O}/><path d="M-12,-42 h24 v-8 h-24z" fill="#c9764a" ${O}/><path d="M-17,-22 h34" stroke="#ffd166" stroke-width="3"/></g></g>`;
  } else { // stable
    s += `<path d="M0,304 Q200,290 400,304 V400 H0Z" fill="#857399"/>`;
    s += `<rect x="48" y="176" width="304" height="130" fill="#5e4230" ${O}/><path d="M48,214 H352 M48,256 H352" stroke="#4a3426" stroke-width="2"/>`;
    s += `<path d="M22,186 L200,116 L378,186 L370,200 L200,134 L30,200Z" fill="#8d5a3b" ${O}/>`;
    s += `<rect x="44" y="190" width="13" height="116" fill="#8d5a3b" ${O}/><rect x="343" y="190" width="13" height="116" fill="#8d5a3b" ${O}/>`;
    s += `<g transform="translate(200 150)"><g class="tappable" data-tap="star"><path d="M0,0 v22" ${O}/><circle class="glow" cy="34" r="22" fill="#ffe08a" opacity=".5"/><rect x="-8" y="22" width="16" height="22" rx="4" fill="#ffd166" ${O}/></g></g>`;
    s += `<path d="M40,306 Q200,288 360,306 Q380,330 400,400 H0 Q20,330 40,306Z" fill="#e9c46a"/>`;
    for (let i = 0; i < 16; i++) { const x = 30 + r() * 340, y = 322 + r() * 66; s += `<path d="M${x.toFixed(0)},${y.toFixed(0)} l${(r() * 16 - 8).toFixed(0)},-10" stroke="#c9a040" stroke-width="2.5" stroke-linecap="round"/>`; }
  }
  if (outdoors && star) s += bigStar(250, 150, id);
  return s;
}

/* ---------- scene composer ---------- */

// Where each kind of actor stands: [y, scale, tap sound, default animation]
const STAND = {
  person: [258, 1.08, 'person', 'pose-idle'], angel: [196, 1, 'angel', 'floaty'], sheep: [312, 1.15, 'sheep', 'pose-idle'],
  donkey: [292, 1.1, 'donkey', 'pose-idle'], camel: [270, 1.1, 'camel', 'pose-idle'], manger: [302, 1.3, 'baby', ''],
};

/** spec: { nativity:true, bg, time, star, seed, fx, actors:[{ who, x, y?, s?, flip?, mood?, pose? }] } */
export function nativityScene(spec) {
  const id = 'n' + (spec.seed || 1) + Math.floor(Math.random() * 1e6);
  const r = rng(spec.seed || 5);
  let s = place(spec.bg || 'hills', spec.time || 'night', spec.star, r, id);
  for (const a of spec.actors || []) {
    const cast = CAST[a.who];
    const kind = cast ? (a.who === 'angel' ? 'angel' : 'person') : a.who;
    const [y, sc, tap, anim] = STAND[kind];
    const art = cast ? person(cast, a.mood, id) : { sheep, donkey, camel, manger }[kind](id);
    const pose = a.pose ? 'pose-' + a.pose : anim;
    s += tapWrap(a.x, a.y ?? y, sc * (a.s || 1), tap, `<g class="${pose}" style="${delay(r, 2)}">${art}</g>`, a.flip);
  }
  if (spec.fx === 'sparkle') s += sparkles(r, 200, 200, 150, 18);
  return `<svg class="scene" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img">${s}</svg>`;
}

/* ---------- the stories ---------- */

const sc = (bg, time, actors, extra = {}) => ({ nativity: true, bg, time, actors, ...extra });
const holyFamily = [{ who: 'mary', x: 112, mood: 'pray' }, { who: 'manger', x: 200 }, { who: 'joseph', x: 288 }];

const STORIES = [
  {
    title: 'An Angel Visits Mary', ref: 'Luke 1:26–38 · Matthew 1:18–25',
    cover: sc('room', 'day', [{ who: 'mary', x: 140 }, { who: 'angel', x: 262, flip: true }], { fx: 'sparkle' }),
    pages: [
      ['Long, long ago, in a little town called Nazareth, there lived a young woman named Mary. Mary was kind and gentle, and she loved God with all her heart.',
        sc('room', 'day', [{ who: 'mary', x: 170 }])],
      ['One day, a bright light filled the room. An angel was standing there! His name was Gabriel, and God had sent him from heaven with a message.',
        sc('room', 'day', [{ who: 'mary', x: 132, mood: 'wow' }, { who: 'angel', x: 266, flip: true }], { fx: 'sparkle' }), 'sparkle'],
      ['Mary was very surprised. “Do not be afraid, Mary,” said the angel. “God is pleased with you.”',
        sc('room', 'day', [{ who: 'mary', x: 132, mood: 'worried' }, { who: 'angel', x: 266, flip: true }])],
      ['“You are going to have a baby boy,” said Gabriel, “and you will name him Jesus. He will be great, and he will be called the Son of God. His kingdom will never end.”',
        sc('room', 'day', [{ who: 'mary', x: 132, mood: 'wow' }, { who: 'angel', x: 266, flip: true, pose: 'cheer' }])],
      ['“How can this be?” Mary wondered. The angel answered gently, “Nothing is impossible with God.”',
        sc('room', 'day', [{ who: 'mary', x: 132 }, { who: 'angel', x: 266, flip: true }])],
      ['Mary bowed her head. “I am the Lord’s servant,” she said. “Let it happen just as you have said.” Then the angel left her, and Mary’s heart was full of wonder.',
        sc('room', 'day', [{ who: 'mary', x: 170, mood: 'pray' }], { fx: 'sparkle' })],
      ['Mary was promised in marriage to a carpenter named Joseph. One night, an angel spoke to Joseph in a dream. “Take Mary home as your wife. Her baby is from God. Name him Jesus, for he will save his people from their sins.” And Joseph did just that.',
        sc('room', 'night', [{ who: 'joseph', x: 136, mood: 'sleep' }, { who: 'angel', x: 268, flip: true }])],
    ],
  },
  {
    title: 'The First Christmas', ref: 'Luke 2:1–7',
    cover: sc('stable', 'night', holyFamily, { star: true, fx: 'sparkle' }),
    pages: [
      ['In those days the ruler of the land, Caesar Augustus, made a new law. Everyone had to travel to their own family’s town to be counted.',
        sc('town', 'day', [{ who: 'mary', x: 150 }, { who: 'joseph', x: 240 }])],
      ['So Joseph and Mary set off for Bethlehem, the town of King David. It was a long, long way, and Mary’s baby would be born very soon. Clip, clop, clip, clop went the little donkey.',
        sc('desert', 'day', [{ who: 'donkey', x: 132, pose: 'walk' }, { who: 'mary', x: 214, pose: 'walk' }, { who: 'joseph', x: 292, pose: 'walk' }])],
      ['At last they reached Bethlehem. But the town was crowded with travelers. Knock, knock, knock! There was no room for them at the inn. Where would they sleep?',
        sc('town', 'dusk', [{ who: 'donkey', x: 112 }, { who: 'mary', x: 198, mood: 'worried' }, { who: 'joseph', x: 280, mood: 'worried' }])],
      ['So they rested in a place where animals were kept. It was not fancy, but it was warm and quiet, and the hay was soft.',
        sc('stable', 'night', [{ who: 'sheep', x: 100 }, { who: 'mary', x: 172 }, { who: 'joseph', x: 246 }, { who: 'donkey', x: 304, y: 296, s: 0.75, flip: true }])],
      ['And that night, Mary’s baby was born. It was Jesus! Mary wrapped him snugly in soft cloths and laid him in a manger, the box that held the animals’ hay.',
        sc('stable', 'night', holyFamily, { star: true, fx: 'sparkle' }), 'sparkle'],
      ['Mary and Joseph looked at the tiny baby with wonder. God’s own Son had come into the world, not in a palace, but in a manger. And that was the very first Christmas.',
        sc('stable', 'night', [{ who: 'mary', x: 126, mood: 'pray' }, { who: 'manger', x: 206 }, { who: 'joseph', x: 286 }, { who: 'sheep', x: 96, y: 336, s: 0.75 }], { star: true }), 'fanfare'],
    ],
  },
  {
    title: 'The Shepherds and the Angels', ref: 'Luke 2:8–20',
    cover: sc('hills', 'night', [{ who: 'angel', x: 200, y: 180 }, { who: 'sheep', x: 110 }, { who: 'sheep', x: 290, flip: true }], { star: true, fx: 'sparkle' }),
    pages: [
      ['That same night, in the fields near Bethlehem, some shepherds were watching over their sheep. The stars were out, and everything was quiet. Baa, baa, went the sheep.',
        sc('hills', 'night', [{ who: 'shepherd1', x: 120 }, { who: 'shepherd3', x: 190, y: 272, s: 0.8 }, { who: 'sheep', x: 250 }, { who: 'sheep', x: 302, y: 326, flip: true }])],
      ['Suddenly, an angel of the Lord stood before them, and the glory of the Lord shone all around. The shepherds were terrified!',
        sc('hills', 'night', [{ who: 'shepherd1', x: 104, mood: 'wow' }, { who: 'shepherd3', x: 168, y: 272, s: 0.8, mood: 'worried' }, { who: 'angel', x: 266, flip: true }, { who: 'sheep', x: 232, y: 330, s: 0.8 }], { fx: 'sparkle' }), 'sparkle'],
      ['“Do not be afraid,” said the angel. “I bring you good news that will bring great joy to all people. Today, in the town of David, a Savior has been born to you. He is Christ the Lord!”',
        sc('hills', 'night', [{ who: 'shepherd1', x: 104, mood: 'wow' }, { who: 'shepherd3', x: 168, y: 272, s: 0.8 }, { who: 'angel', x: 270, flip: true, pose: 'cheer' }])],
      ['“And this is how you will know him,” said the angel. “You will find a baby wrapped in cloths and lying in a manger.”',
        sc('hills', 'night', [{ who: 'shepherd1', x: 104 }, { who: 'shepherd2', x: 176 }, { who: 'angel', x: 276, flip: true }], { star: true })],
      ['Then the whole sky filled with angels, praising God and saying, “Glory to God in the highest, and on earth, peace!”',
        sc('hills', 'night', [{ who: 'angel', x: 112, y: 200, s: 0.75 }, { who: 'angel', x: 288, y: 200, s: 0.75, flip: true }, { who: 'angel', x: 200, y: 184, s: 0.85 }, { who: 'shepherd3', x: 150, y: 302, s: 0.62, mood: 'wow' }, { who: 'sheep', x: 244, y: 326, s: 0.85 }], { fx: 'sparkle' }), 'fanfare'],
      ['When the angels had gone back to heaven, the shepherds said, “Let’s go to Bethlehem and see!” So they hurried off as fast as they could.',
        sc('town', 'night', [{ who: 'shepherd1', x: 128, pose: 'walk' }, { who: 'shepherd2', x: 204, pose: 'walk' }, { who: 'shepherd3', x: 270, y: 272, s: 0.8, pose: 'walk' }], { star: true })],
      ['And there they found Mary and Joseph, and the baby lying in the manger, just as the angel had said.',
        sc('stable', 'night', [{ who: 'mary', x: 88, s: 0.85, y: 270, mood: 'pray' }, { who: 'manger', x: 146, s: 0.85 }, { who: 'joseph', x: 204, s: 0.85, y: 270 }, { who: 'shepherd1', x: 264, s: 0.85, y: 270, flip: true, mood: 'wow' }, { who: 'shepherd3', x: 314, y: 290, s: 0.62, flip: true }], { star: true })],
      ['The shepherds told everyone what they had seen and heard, and all who heard it were amazed. Then they went back to their sheep, praising God. And Mary treasured all these things in her heart.',
        sc('hills', 'dusk', [{ who: 'shepherd1', x: 116, pose: 'cheer' }, { who: 'shepherd2', x: 196, pose: 'cheer' }, { who: 'sheep', x: 250 }, { who: 'sheep', x: 302, y: 326, flip: true }])],
    ],
  },
  {
    title: 'The Wise Men and the Star', ref: 'Matthew 2:1–12',
    cover: sc('desert', 'night', [{ who: 'king1', x: 128 }, { who: 'king2', x: 204 }, { who: 'king3', x: 280 }], { star: true, fx: 'sparkle' }),
    pages: [
      ['Far away in the east, some wise men were studying the night sky. One night they saw a brand-new star. “A king has been born!” they said. “Let us go and worship him.”',
        sc('desert', 'night', [{ who: 'king1', x: 130, mood: 'wow' }, { who: 'king2', x: 206 }, { who: 'king3', x: 282, mood: 'wow' }], { star: true })],
      ['They packed up special gifts and set off on a long journey. Over hills and across sandy deserts they traveled, day after day and night after night.',
        sc('desert', 'dusk', [{ who: 'camel', x: 132, pose: 'walk' }, { who: 'king2', x: 216, pose: 'walk' }, { who: 'king3', x: 290, pose: 'walk' }], { star: true })],
      ['First they came to the great city of Jerusalem, where King Herod lived. “Where is the child who has been born king?” they asked. “We saw his star and have come to worship him.” The teachers there knew the answer from God’s word: “In Bethlehem.”',
        sc('town', 'day', [{ who: 'king1', x: 130 }, { who: 'king2', x: 206 }, { who: 'king3', x: 282 }])],
      ['So they set off again. And look! The star went ahead of them until it stopped over the place where the child was. When they saw the star, they were filled with joy.',
        sc('town', 'night', [{ who: 'king1', x: 124, pose: 'cheer' }, { who: 'king2', x: 200, pose: 'cheer' }, { who: 'king3', x: 276, pose: 'cheer' }], { star: true, fx: 'sparkle' }), 'sparkle'],
      ['They went into the house and saw the child with Mary, his mother. And they bowed down and worshiped him.',
        sc('room', 'night', [{ who: 'mary', x: 84, s: 0.85, y: 270 }, { who: 'manger', x: 142, s: 0.8 }, { who: 'king1', x: 204, s: 0.82, y: 272, flip: true, mood: 'pray' }, { who: 'king2', x: 258, s: 0.82, y: 272, flip: true, mood: 'pray' }, { who: 'king3', x: 312, s: 0.82, y: 272, flip: true, mood: 'pray' }])],
      ['Then they opened their treasures and gave him gifts: shining gold, sweet-smelling frankincense, and precious myrrh.',
        sc('room', 'night', [{ who: 'mary', x: 84, s: 0.85, y: 270 }, { who: 'manger', x: 142, s: 0.8 }, { who: 'king1', x: 204, s: 0.82, y: 272, flip: true, pose: 'cheer' }, { who: 'king2', x: 258, s: 0.82, y: 272, flip: true }, { who: 'king3', x: 312, s: 0.82, y: 272, flip: true }], { fx: 'sparkle' }), 'fanfare'],
      ['That night, God warned the wise men in a dream not to go back to King Herod. So they went home by a different road, with hearts full of joy.',
        sc('desert', 'night', [{ who: 'king1', x: 130, flip: true, pose: 'walk' }, { who: 'king3', x: 202, flip: true, pose: 'walk' }, { who: 'camel', x: 284, flip: true, pose: 'walk' }], { star: true })],
    ],
  },
];

export const xmasList = STORIES.map((s, i) => ({ i, title: s.title, ref: s.ref, cover: { ...s.cover, seed: 40 + i } }));
export const xmasHomeScene = { ...STORIES[1].cover, seed: 9 };

export function xmasStory(i) {
  const s = STORIES[i];
  const pages = [
    { kind: 'cover', text: s.title, scene: s.cover },
    ...s.pages.map(([text, scene, sfx]) => ({ text, scene, sfx })),
  ];
  pages.forEach((p, n) => { p.scene = { ...p.scene, seed: 500 + i * 37 + n * 11 }; });
  return { title: s.title, ref: s.ref, pages, xmas: true, bedtime: true, carol: true, seed: 77 + i, answers: { setting: 'bethlehem' } };
}
