// Illustrations: every picture in the app is an SVG string built here.
// Nothing user-typed is ever interpolated into these strings.

let uid = 0;
export const INK = '#4a3838';
export const O = `stroke="${INK}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`;
export const both = (s) => s + `<g transform="scale(-1 1)">${s}</g>`;

export function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function starPath(cx, cy, R, r, n = 5) {
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2;
    const rad = i % 2 ? r : R;
    d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rad).toFixed(1)},${(cy + Math.sin(a) * rad).toFixed(1)}`;
  }
  return d + 'Z';
}

/* ---------- characters ---------- */

export const HEROES = {
  bunny: { c1: '#f6eadc', c2: '#ffffff', c3: '#f7b6c2' },
  fox: { c1: '#f08a3c', c2: '#fff4e3', c3: '#5b3a29' },
  bear: { c1: '#b07a52', c2: '#ecd0ae', c3: '#5b3a29' },
  cat: { c1: '#9aa5b8', c2: '#f1f4f7', c3: '#f7b6c2' },
  dragon: { c1: '#6cc070', c2: '#eef8b4', c3: '#f2a541' },
  robot: { c1: '#9fc4d8', c2: '#e8f4fa', c3: '#f25f5c' },
};

export function heroArt(kind, { mood = 'happy', helmet = false, item = null } = {}) {
  const { c1, c2, c3 } = HEROES[kind];
  const robot = kind === 'robot';
  let behind = '', ears = '', muzzle = '', front = '';

  if (kind === 'bunny') {
    ears = both(`<g transform="rotate(-10 -13 -48)"><ellipse cx="-13" cy="-70" rx="9" ry="25" fill="${c1}" ${O}/><ellipse cx="-13" cy="-68" rx="4" ry="16" fill="${c3}"/></g>`);
    behind = `<circle cx="26" cy="46" r="9" fill="#fff" ${O}/>`;
  } else if (kind === 'fox') {
    ears = both(`<path d="M-27,-40 L-25,-74 L-3,-53 Z" fill="${c1}" ${O}/><path d="M-22,-50 L-22,-64 L-12,-54 Z" fill="${c3}"/>`);
    behind = `<path d="M20,52 C58,58 66,22 50,2 C46,22 38,34 20,36 Z" fill="${c1}" ${O}/><path d="M50,2 C57,10 59,19 56,27 C51,22 48,16 47,12 Z" fill="#fff"/>`;
    muzzle = `<path d="M-27,-20 Q0,-8 27,-20 Q22,3 0,3 Q-22,3 -27,-20Z" fill="${c2}"/>`;
  } else if (kind === 'bear') {
    ears = both(`<circle cx="-23" cy="-50" r="11" fill="${c1}" ${O}/><circle cx="-23" cy="-50" r="5" fill="${c2}"/>`);
    behind = `<circle cx="25" cy="48" r="6" fill="${c1}" ${O}/>`;
    muzzle = `<ellipse cx="0" cy="-15" rx="13" ry="10" fill="${c2}"/>`;
  } else if (kind === 'cat') {
    ears = both(`<path d="M-28,-40 L-24,-70 L-6,-52 Z" fill="${c1}" ${O}/><path d="M-22,-48 L-21,-61 L-12,-52Z" fill="${c3}"/>`);
    behind = `<path d="M22,52 C52,56 56,30 46,14" fill="none" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M22,52 C52,56 56,30 46,14" fill="none" stroke="${c1}" stroke-width="8" stroke-linecap="round"/>`;
    muzzle = `<ellipse cx="0" cy="-15" rx="11" ry="8" fill="${c2}"/>`;
    front = both(`<path d="M-16,-16 l-16,-3 M-16,-12 l-15,3" stroke="${INK}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`);
  } else if (kind === 'dragon') {
    ears = both(`<path d="M-20,-50 L-25,-72 L-9,-54 Z" fill="${c3}" ${O}/>`);
    behind =
      both(`<path d="M-20,10 C-56,-20 -64,6 -58,30 C-50,18 -40,22 -34,32 C-32,24 -26,22 -20,28 Z" fill="${c3}" ${O}/>`) +
      `<path d="M20,50 C50,60 64,44 60,26 L71,22 L58,13 C52,30 40,36 22,36 Z" fill="${c1}" ${O}/>`;
  } else if (robot) {
    ears =
      `<line x1="0" y1="-56" x2="0" y2="-70" ${O}/><circle class="glow" cx="0" cy="-76" r="6" fill="${c3}" ${O}/>` +
      both(`<rect x="-37" y="-36" width="8" height="16" rx="3" fill="${c3}" ${O}/>`);
  }

  const body = robot
    ? `<rect x="-26" y="2" width="52" height="56" rx="12" fill="${c1}" ${O}/><rect x="-16" y="14" width="32" height="24" rx="6" fill="${c2}" ${O}/><circle cx="-7" cy="26" r="3.5" fill="${c3}"/><circle cx="7" cy="26" r="3.5" fill="#ffd166"/>`
    : `<ellipse cx="0" cy="28" rx="27" ry="32" fill="${c1}" ${O}/><ellipse cx="0" cy="34" rx="16" ry="21" fill="${c2}"/>`;
  const head = robot
    ? `<rect x="-30" y="-56" width="60" height="54" rx="14" fill="${c1}" ${O}/><rect x="-23" y="-47" width="46" height="38" rx="10" fill="${c2}"/>`
    : `<circle cx="0" cy="-26" r="30" fill="${c1}" ${O}/>`;
  const arms = both(`<g class="arm"><ellipse cx="-29" cy="24" rx="8" ry="15" fill="${c1}" ${O} transform="rotate(18 -29 24)"/></g>`);
  const feet = both(`<ellipse cx="-13" cy="60" rx="13" ry="7" fill="${c1}" ${O}/>`);

  let face = '';
  if (mood === 'sleep') face += both(`<path d="M-16,-29 q5,5 10,0" fill="none" ${O}/>`);
  else face += `<g class="eyes">${both(`<circle cx="-11" cy="-30" r="4.5" fill="#3a2c2c"/>`)}<circle cx="-9.5" cy="-31.5" r="1.5" fill="#fff"/><circle cx="12.5" cy="-31.5" r="1.5" fill="#fff"/></g>`;
  if (mood === 'worried') face += `<path d="M-17,-39 l9,-4 M17,-39 l-9,-4" fill="none" ${O}/>`;
  if (!robot) {
    face += kind === 'dragon'
      ? `<circle cx="-3" cy="-21" r="1.4" fill="${INK}"/><circle cx="3" cy="-21" r="1.4" fill="${INK}"/>`
      : `<ellipse cx="0" cy="-21" rx="3.6" ry="2.6" fill="${kind === 'bunny' || kind === 'cat' ? '#e58fa0' : '#3a2c2c'}"/>`;
  }
  const mouths = {
    happy: `<path d="M-7,-14 q7,7 14,0" fill="none" ${O}/>`,
    worried: `<path d="M-6,-10 q6,-5 12,0" fill="none" ${O}/>`,
    sleep: `<path d="M-3,-13 q3,2 6,0" fill="none" ${O}/>`,
    cheer: `<path d="M-8,-15 q8,13 16,0 z" fill="#d1495b" ${O}/>`,
  };
  face += mouths[mood] || mouths.happy;
  face += both(`<circle cx="-21" cy="-18" r="5" fill="#ff8fa3" opacity=".45"/>`);

  const dome = helmet
    ? `<circle cx="0" cy="-34" r="50" fill="#fff" fill-opacity=".13" stroke="#fff" stroke-opacity=".85" stroke-width="2.5"/><path d="M-34,-58 q10,-16 26,-21" stroke="#fff" stroke-opacity=".8" stroke-width="3" fill="none" stroke-linecap="round"/>`
    : '';
  const held = item ? `<g transform="translate(41 26) scale(.8)">${itemArt(item)}</g>` : '';
  return behind + ears + body + arms + feet + head + muzzle + face + front + dome + held;
}

export function itemArt(kind) {
  switch (kind) {
    case 'lantern':
      return `<circle class="glow" r="24" fill="#ffe08a" opacity=".5"/><path d="M-8,-14 q8,-14 16,0" fill="none" ${O}/><rect x="-10" y="-14" width="20" height="5" rx="2" fill="#7a5c3e" ${O}/><rect x="-9" y="-9" width="18" height="22" rx="4" fill="#ffd166" ${O}/><rect x="-11" y="12" width="22" height="5" rx="2" fill="#7a5c3e" ${O}/><path d="M0,7 q-5,-6 0,-12 q5,6 0,12z" fill="#ff8c42"/>`;
    case 'brush':
      return `<g transform="rotate(35)"><rect x="-3" y="-4" width="6" height="26" rx="3" fill="#c98b4e" ${O}/><rect x="-4" y="-10" width="8" height="8" fill="#cfd8dc" ${O}/><path d="M-4,-10 q-3,-10 4,-18 q7,8 4,18z" fill="#ff5d8f" ${O}/></g>`;
    case 'shell':
      return `<path d="M0,14 C-22,10 -22,-14 0,-16 C22,-14 22,10 0,14Z" fill="#ffc2d1" ${O}/><path d="M0,14 L-10,-10 M0,14 L0,-15 M0,14 L10,-10" fill="none" stroke="${INK}" stroke-width="1.6"/>`;
    default: // bell
      return `<path d="M-14,10 q2,-4 2,-12 a12,12 0 0 1 24,0 q0,8 2,12z" fill="#ffd166" ${O}/><circle cx="0" cy="14" r="4" fill="#e09f3e" ${O}/><circle cx="0" cy="-16" r="3" fill="#e09f3e" ${O}/>`;
  }
}

const eyeDots = (x, y, r = 2.4) => both(`<circle cx="${-x}" cy="${y}" r="${r}" fill="#3a2c2c"/>`);
const smile = (y, w = 5) => `<path d="M${-w},${y} q${w},${w} ${w * 2},0" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`;

export function friendArt(kind) {
  switch (kind) {
    case 'bird':
      return `<path d="M12,4 l15,-5 l-9,12z" fill="#3d8bd9" ${O}/><circle r="15" fill="#5aa9f0" ${O}/><ellipse cx="-3" cy="6" rx="8" ry="6" fill="#e3f4ff"/><g class="flap"><ellipse cx="5" cy="1" rx="8" ry="5" fill="#3d8bd9" ${O}/></g><path d="M-14,-3 l-9,3 l9,3z" fill="#ffb703" ${O}/><circle cx="-7" cy="-5" r="2.4" fill="#3a2c2c"/>`;
    case 'firefly':
      return `<circle class="glow" cx="7" cy="5" r="18" fill="#f6ff8a" opacity=".55"/><g class="flap"><ellipse cx="-5" cy="-11" rx="6" ry="10" fill="#fff" fill-opacity=".75" ${O}/><ellipse cx="4" cy="-11" rx="6" ry="10" fill="#fff" fill-opacity=".75" ${O}/></g><circle cx="8" cy="5" r="8" fill="#f6ff5c" ${O}/><ellipse cx="-3" cy="0" rx="9" ry="8" fill="#6b5340" ${O}/><circle cx="-7" cy="-2" r="2" fill="#fff"/><circle cx="-7.5" cy="-2" r="1" fill="#000"/>`;
    case 'turtle':
      return both(`<ellipse cx="-11" cy="10" rx="6" ry="4" fill="#9bd67d" ${O}/>`) + `<circle cx="-19" cy="1" r="8" fill="#9bd67d" ${O}/><circle cx="-22" cy="-1" r="1.8" fill="#3a2c2c"/><path d="M-14,8 a15,15 0 0 1 30,0 z" fill="#4c9f70" ${O}/><path d="M-6,8 l3,-12 M8,8 l-3,-12 M-3,-4 h8" fill="none" stroke="#2f6b4c" stroke-width="1.6"/>`;
    default: // star
      return `<circle class="glow" r="21" fill="#fff3a8" opacity=".32"/><path d="${starPath(0, 0, 17, 8.5)}" fill="#ffd94a" ${O}/>${eyeDots(4.5, -1, 1.9)}${smile(3, 3.5)}`;
  }
}

export function critterArt(setting) {
  switch (setting) {
    case 'forest': // hedgehog
      return `<path d="M-20,6 L-24,-8 L-15,-6 L-14,-20 L-5,-12 L2,-24 L8,-12 L18,-18 L18,-5 L26,-2 L20,8Z" fill="#7a5c3e" ${O}/><ellipse cx="-2" cy="7" rx="20" ry="12" fill="#ecd0a8" ${O}/><circle cx="-22" cy="7" r="3" fill="#3a2c2c"/><circle cx="-11" cy="2" r="2.2" fill="#3a2c2c"/><path d="M-16,11 q4,3 8,0" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>`;
    case 'ocean': // octopus
      return `<path d="M-12,8 q-6,10 -13,8 M-4,11 q-2,10 -8,12 M4,11 q2,10 8,12 M12,8 q6,10 13,8" fill="none" stroke="#9b6fd6" stroke-width="6" stroke-linecap="round"/><circle cy="-4" r="17" fill="#b991f0" ${O}/>${eyeDots(6, -6)}${smile(1)}`;
    case 'space': // little alien
      return both(`<path d="M-6,-14 q-4,-12 -10,-14" fill="none" ${O}/><circle cx="-16" cy="-30" r="3.5" fill="#ffd166" ${O}/>`) + `<ellipse cy="3" rx="16" ry="18" fill="#7ee081" ${O}/><circle cy="-3" r="7" fill="#fff" ${O}/><circle cy="-3" r="3" fill="#3a2c2c"/>${smile(9, 4)}`;
    default: // penguin
      return both(`<ellipse cx="-6" cy="19" rx="6" ry="3" fill="#ffb703" ${O}/>`) + `<ellipse rx="15" ry="19" fill="#3d405b" ${O}/><ellipse cy="4" rx="10" ry="13" fill="#fff"/>${eyeDots(5, -9, 2)}<path d="M-4,-5 l4,5 l4,-5z" fill="#ffb703" ${O}/>`;
  }
}

export function treasureArt(setting) {
  const glow = `<circle class="glow" r="27" fill="#fff6b0" opacity=".4"/>`;
  switch (setting) {
    case 'forest':
      return glow + `<ellipse cy="5" rx="12" ry="15" fill="#ffd166" ${O}/><path d="M-14,-4 a14,10 0 0 1 28,0z" fill="#e09f3e" ${O}/><path d="M0,-14 v-6" fill="none" ${O}/>`;
    case 'ocean':
      return glow + `<path d="M-22,4 q22,24 44,0 q-22,8 -44,0z" fill="#ffc2d1" ${O}/><circle cy="-2" r="12" fill="#fdfcff" ${O}/><circle cx="-4" cy="-6" r="3" fill="#fff"/>`;
    case 'space':
      return glow + `<path d="${starPath(0, 0, 19, 9.5)}" fill="#8be9fd" ${O}/><path d="${starPath(0, 0, 8, 4)}" fill="#fff"/>`;
    default: {
      const arm = `<path d="M0,-18 V18 M-5,-13 L0,-8 L5,-13 M-5,13 L0,8 L5,13"/>`;
      return glow + `<g fill="none" stroke="#7fb8e6" stroke-width="6" stroke-linecap="round">${arm}<g transform="rotate(60)">${arm}</g><g transform="rotate(120)">${arm}</g></g><g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round">${arm}<g transform="rotate(60)">${arm}</g><g transform="rotate(120)">${arm}</g></g>`;
    }
  }
}

/* ---------- scenery ---------- */

const SKY = {
  forest: { morning: ['#ffcf9e', '#cfeeff'], day: ['#7cc8ff', '#dff5ff'], dusk: ['#f6866a', '#ffd8a0'], dark: ['#39445f', '#6f7c95'], night: ['#10173a', '#3a3f80'] },
  snow: { morning: ['#ffd6c2', '#e3f3ff'], day: ['#9ad4ff', '#eefaff'], dusk: ['#c98bd0', '#ffd1c2'], dark: ['#56617a', '#9aa6ba'], night: ['#0f1a3f', '#3c4b8f'] },
  ocean: { morning: ['#5fd0e6', '#1976b8'], day: ['#44bfe0', '#1167a8'], dusk: ['#3f8fc0', '#253f86'], dark: ['#12436f', '#061d3d'], night: ['#0d2f66', '#040f2a'] },
  space: { morning: ['#1b1464', '#5a2a8a'], day: ['#17124f', '#4b2a85'], dusk: ['#241255', '#7a2f7e'], dark: ['#07061c', '#1d1238'], night: ['#0a0a2a', '#2a1a5e'] },
};
const TINT = { dusk: ['#ff7a3c', 0.14], dark: ['#0c1424', 0.42], night: ['#0b1040', 0.42] };

export const delay = (r, max) => `animation-delay:-${(r() * max).toFixed(2)}s`;

export function stars(r, n, maxY = 250) {
  let s = '';
  for (let i = 0; i < n; i++) s += `<circle class="twinkle" style="${delay(r, 4)}" cx="${(r() * 400).toFixed(0)}" cy="${(r() * maxY).toFixed(0)}" r="${(0.8 + r() * 1.6).toFixed(1)}" fill="#fff"/>`;
  return s;
}

function cloud(x, y, sc, r) {
  return `<g transform="translate(${x} ${y}) scale(${sc})"><g class="drift" style="${delay(r, 40)}" fill="#fff" opacity=".9"><ellipse rx="30" ry="14"/><ellipse cx="-18" cy="6" rx="20" ry="11"/><ellipse cx="20" cy="6" rx="22" ry="11"/><ellipse cx="4" cy="-10" rx="16" ry="12"/></g></g>`;
}

function tree(x, y, sc, pine, snowy) {
  const g = `<g transform="translate(${x} ${y}) scale(${sc})"><g class="tappable" data-tap="prop">`;
  if (pine) {
    const c = snowy ? '#3f8f7a' : '#3f9b62';
    const cap = snowy ? `<path d="M-13,-58 L0,-84 L13,-58 Q6,-62 0,-58 Q-6,-62 -13,-58Z" fill="#fff"/><path d="M-22,-34 q8,-6 14,0 q8,-6 14,0 q8,-6 16,0 l-8,-12 h-28z" fill="#fff" opacity=".9"/>` : '';
    return g + `<rect x="-5" y="-12" width="10" height="14" fill="#8d5a3b" ${O}/><path d="M-30,-10 L0,-52 L30,-10Z" fill="${c}" ${O}/><path d="M-24,-32 L0,-70 L24,-32Z" fill="${c}" ${O}/><path d="M-16,-54 L0,-84 L16,-54Z" fill="${c}" ${O}/>${cap}</g></g>`;
  }
  return g + `<rect x="-6" y="-34" width="12" height="36" rx="3" fill="#8d5a3b" ${O}/><circle cx="0" cy="-58" r="30" fill="#56b870" ${O}/><circle cx="-12" cy="-64" r="9" fill="#74cf8a"/><circle cx="12" cy="-48" r="6" fill="#74cf8a"/></g></g>`;
}

function sunMoon(time) {
  if (time === 'night')
    return `<g transform="translate(286 76)"><g class="tappable" data-tap="star"><circle class="glow" r="40" fill="#fff8c9" opacity=".3"/><circle r="26" fill="#fff6c2"/><circle cx="-8" cy="-6" r="5" fill="#f1e3a0"/><circle cx="8" cy="8" r="7" fill="#f1e3a0"/><circle cx="9" cy="-11" r="3" fill="#f1e3a0"/></g></g>`;
  if (time === 'dark') return '';
  const y = time === 'day' ? 74 : 118;
  let rays = '';
  for (let i = 0; i < 12; i++) rays += `<rect x="-3" y="-50" width="6" height="14" rx="3" fill="#ffd94a" transform="rotate(${i * 30})"/>`;
  return `<g transform="translate(286 ${y})"><g class="tappable" data-tap="star"><g class="spin slow">${rays}</g><circle r="30" fill="#ffd94a"/><circle r="30" fill="#ffb347" opacity="${time === 'dusk' ? 0.6 : 0}"/></g></g>`;
}

function background(setting, time, r, id) {
  const [a, b] = SKY[setting][time];
  let s = `<defs><linearGradient id="sky${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="400" height="400" fill="url(#sky${id})"/>`;

  if (setting === 'forest') {
    if (time === 'night') s += stars(r, 34);
    s += sunMoon(time);
    if (time !== 'night') s += cloud(90, 70, 1, r) + cloud(220, 120, 0.7, r);
    s += `<path d="M0,292 Q100,222 200,268 T400,250 V400 H0Z" fill="#a8dc8c"/>`;
    s += tree(128, 286, 0.6, true) + tree(262, 284, 0.55, false) + tree(338, 290, 0.7, true);
    s += `<path d="M0,304 Q200,282 400,304 V400 H0Z" fill="#7ccf6b"/><path d="M130,400 Q170,330 200,318 Q230,330 290,400Z" fill="#f3e3b3" opacity=".8"/>`;
    s += tree(52, 318, 1.05, false) + tree(96, 312, 0.8, true) + tree(372, 322, 1.1, false);
    const cols = ['#ff6b6b', '#ffd166', '#fff', '#c77dff'];
    for (let i = 0; i < 12; i++) {
      const x = 20 + r() * 360, y = 340 + r() * 50;
      if (x > 130 && x < 290) continue;
      s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="4" fill="${cols[i % 4]}"/><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="1.6" fill="#f7b801"/>`;
    }
    if (time === 'night' || time === 'dark')
      for (let i = 0; i < 9; i++) s += `<circle class="twinkle" style="${delay(r, 3)}" cx="${(40 + r() * 320).toFixed(0)}" cy="${(180 + r() * 130).toFixed(0)}" r="2.5" fill="#f6ff8a"/>`;
  } else if (setting === 'snow') {
    if (time === 'night') s += stars(r, 34);
    s += sunMoon(time);
    if (time !== 'night') s += cloud(100, 64, 0.9, r);
    s += `<path d="M-20,300 L90,130 L200,300Z" fill="#9db4d6"/><path d="M61,175 L90,130 L119,175 L104,166 L90,180 L76,166Z" fill="#fff"/>`;
    s += `<path d="M150,300 L270,96 L400,300Z" fill="#b4c7e4"/><path d="M237,152 L270,96 L306,152 L288,142 L270,160 L252,142Z" fill="#fff"/>`;
    s += tree(140, 300, 0.6, true, true) + tree(350, 300, 0.7, true, true);
    s += `<path d="M0,304 Q200,278 400,304 V400 H0Z" fill="#f4fbff"/><path d="M0,350 Q200,330 400,356 V400 H0Z" fill="#dcecfa"/>`;
    s += tree(56, 322, 1.05, true, true) + tree(376, 326, 1, true, true);
    for (let i = 0; i < 26; i++) s += `<circle class="snowfall" style="${delay(r, 9)};animation-duration:${(6 + r() * 5).toFixed(1)}s" cx="${(r() * 400).toFixed(0)}" cy="-10" r="${(1.5 + r() * 2).toFixed(1)}" fill="#fff"/>`;
  } else if (setting === 'ocean') {
    for (let i = 0; i < 3; i++) s += `<g class="sway top" style="${delay(r, 6)}"><path d="M${70 + i * 110},-10 l40,0 l${60 + i * 10},330 l-120,0z" fill="#fff" opacity=".07"/></g>`;
    s += `<path d="M0,300 Q30,230 70,250 Q100,200 140,300Z M270,300 Q310,210 350,240 Q380,220 400,300Z" fill="#0f4f86" opacity=".55"/>`;
    for (let i = 0; i < 3; i++) {
      const y = 70 + i * 55, col = ['#ffb347', '#ff8fa3', '#fff27a'][i];
      s += `<g class="swim" style="${delay(r, 22)};animation-duration:${18 + i * 5}s"><g transform="translate(0 ${y})"><g class="tappable" data-tap="fish"><path d="M-14,0 l-10,-7 v14z" fill="${col}" ${O}/><ellipse rx="15" ry="9" fill="${col}" ${O}/><circle cx="8" cy="-2" r="2" fill="#3a2c2c"/></g></g></g>`;
    }
    s += `<path d="M0,316 Q120,294 220,312 T400,304 V400 H0Z" fill="#f1d9a0"/><path d="M0,360 Q200,340 400,366 V400 H0Z" fill="#e6c789"/>`;
    for (const [x, h, c] of [[40, 90, '#3fae7c'], [70, 60, '#58c492'], [352, 100, '#3fae7c'], [380, 70, '#58c492']])
      s += `<g class="sway" style="${delay(r, 5)}"><path d="M${x},330 q-14,${-h / 3} 0,${(-h * 2) / 3} q14,${-h / 6} 0,${-h / 3 - 4}" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round"/></g>`;
    s += `<g transform="translate(110 330)" fill="none" stroke="#ff7f96" stroke-width="7" stroke-linecap="round"><path d="M0,0 v-34 M0,-14 l-14,-16 M0,-20 l14,-14"/></g><g transform="translate(318 334)" fill="none" stroke="#ffa36c" stroke-width="7" stroke-linecap="round"><path d="M0,0 v-28 M0,-10 l-12,-14 M0,-16 l12,-12"/></g>`;
    for (let i = 0; i < 12; i++) s += `<circle class="bubble" style="${delay(r, 8)};animation-duration:${(6 + r() * 4).toFixed(1)}s" cx="${(r() * 400).toFixed(0)}" cy="410" r="${(2 + r() * 4).toFixed(1)}" fill="#fff" fill-opacity=".25" stroke="#fff" stroke-opacity=".7"/>`;
  } else {
    s += stars(r, 60, 320);
    s += `<g transform="translate(284 86)"><g class="tappable" data-tap="star"><circle r="32" fill="#ffb86b"/><path d="M-30,-10 q30,10 60,-2 M-31,6 q30,10 62,-2" fill="none" stroke="#f08a5d" stroke-width="5" opacity=".7"/><ellipse rx="52" ry="12" fill="none" stroke="#ffe7b3" stroke-width="5" transform="rotate(-18)"/></g></g>`;
    s += `<circle cx="84" cy="70" r="15" fill="#6ec5ff"/><path d="M75,64 q6,-6 12,0 q4,6 -2,10 q-8,2 -10,-10z" fill="#7ee081"/>`;
    s += `<g class="shoot" style="${delay(r, 7)}"><path d="M0,0 l-46,16" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".8"/><circle r="3" fill="#fff"/></g>`;
    s += `<path d="M0,306 Q200,268 400,306 V400 H0Z" fill="#cfcbe0"/>`;
    for (const [x, y, w] of [[60, 340, 26], [130, 372, 18], [300, 356, 30], [360, 322, 14], [230, 384, 16]])
      s += `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w / 3}" fill="#aaa5c2"/><ellipse cx="${x}" cy="${y + 2}" rx="${w - 4}" ry="${w / 3 - 2}" fill="#bdb8d2"/>`;
  }
  const t = TINT[time];
  if (t) s += `<rect width="400" height="400" fill="${t[0]}" opacity="${t[1]}" pointer-events="none"/>`;
  return s;
}

function homeArt(setting, lit) {
  const win = lit ? '#ffe066' : '#bfe6ff';
  if (setting === 'ocean')
    return `<path d="M-46,0 a46,52 0 0 1 92,0z" fill="#ffb5c8" ${O}/><path d="M0,-52 V0 M-24,-44 Q-14,-20 -18,0 M24,-44 Q14,-20 18,0" fill="none" stroke="#e58fa0" stroke-width="2.5"/><path d="M-10,0 v-18 a10,10 0 0 1 20,0 v18z" fill="#7b5ea7" ${O}/><circle cx="-26" cy="-18" r="7" fill="${win}" ${O}/>`;
  if (setting === 'space')
    return `<path d="M-18,-10 l-18,16 v-34z M18,-10 l18,16 v-34z" fill="#3d5a80" ${O}/><path d="M0,-118 C26,-86 24,-34 18,0 H-18 C-24,-34 -26,-86 0,-118Z" fill="#f25f5c" ${O}/><path d="M-13.5,-92 Q0,-99 13.5,-92 L0,-118Z" fill="#fff" opacity=".85"/><circle cy="-64" r="11" fill="${win}" ${O}/><rect x="-8" y="-26" width="16" height="26" rx="6" fill="#fff" ${O}/>`;
  const snowy = setting === 'snow';
  return `<rect x="16" y="-82" width="12" height="24" fill="#b5651d" ${O}/>${snowy ? `<g class="smoke"><circle cx="22" cy="-92" r="6" fill="#fff" opacity=".7"/><circle cx="28" cy="-104" r="8" fill="#fff" opacity=".5"/></g>` : ''}<rect x="-36" y="-46" width="72" height="46" rx="3" fill="${snowy ? '#c98b5e' : '#ffe8c2'}" ${O}/><path d="M-46,-44 L0,-84 L46,-44Z" fill="${snowy ? '#fff' : '#e76f51'}" ${O}/><path d="M-9,0 v-20 a9,9 0 0 1 18,0 v20z" fill="#8d5a3b" ${O}/><circle cx="6" cy="-12" r="1.5" fill="#ffd166"/><rect x="-30" y="-36" width="15" height="15" rx="3" fill="${win}" ${O}/>`;
}

function obstacleArt(setting, r) {
  if (setting === 'forest') {
    let s = '';
    for (const [x, y, rad] of [[-44, -22, 28], [0, -40, 36], [44, -24, 30], [-20, -74, 26], [26, -80, 24]])
      s += `<circle cx="${x}" cy="${y}" r="${rad}" fill="#2d4a3e" ${O}/>`;
    s += `<path d="M-70,-30 l-12,-8 M-60,-52 l-10,-12 M-40,-98 l-6,-14 M0,-110 l2,-14 M44,-102 l10,-12 M70,-44 l14,-8 M74,-18 l14,2 M-20,-40 l8,-10 M14,-30 l-6,-12 M30,-58 l10,-4" fill="none" stroke="#1f3329" stroke-width="4" stroke-linecap="round"/>`;
    for (let i = 0; i < 6; i++) s += `<circle cx="${(-50 + r() * 100).toFixed(0)}" cy="${(-90 + r() * 70).toFixed(0)}" r="4" fill="#9d4edd"/>`;
    return s;
  }
  if (setting === 'ocean')
    return `<g transform="translate(0 -80)"><g class="spin"><g fill="none" stroke="#cfefff" stroke-linecap="round" opacity=".75"><path d="M0,-70 A70,70 0 1 1 -66,24" stroke-width="7"/><path d="M0,-48 A48,48 0 1 1 -45,16" stroke-width="6" transform="rotate(120)"/><path d="M0,-28 A28,28 0 1 1 -26,10" stroke-width="5" transform="rotate(240)"/></g></g><circle r="10" fill="#061d3d" opacity=".6"/></g>`;
  if (setting === 'space') {
    let s = '';
    for (const [x, y, sc] of [[-40, -40, 1.1], [30, -90, 0.8], [46, -24, 1.3], [-20, -120, 0.7], [-6, -70, 0.6]])
      s += `<g transform="translate(${x} ${y}) scale(${sc})"><g class="spin" style="${delay(r, 8)};animation-duration:${(7 + r() * 8).toFixed(1)}s"><path d="M-18,-6 L-8,-18 L10,-16 L20,-2 L14,14 L-6,18 L-20,8Z" fill="#8d8aa3" ${O}/><circle cx="-4" cy="-4" r="4" fill="#6f6c87"/><circle cx="8" cy="6" r="3" fill="#6f6c87"/></g></g>`;
    return s;
  }
  let s = '';
  for (let i = 0; i < 5; i++)
    s += `<g class="gust" style="${delay(r, 3)}"><path d="M-110,${-150 + i * 34} q40,-22 80,0 t80,0 q20,10 30,-6" fill="none" stroke="#fff" stroke-width="${4 + (i % 2) * 2}" stroke-linecap="round" opacity=".85"/></g>`;
  for (let i = 0; i < 30; i++) s += `<circle class="twinkle" style="${delay(r, 2)}" cx="${(-110 + r() * 220).toFixed(0)}" cy="${(-180 + r() * 190).toFixed(0)}" r="${(2 + r() * 2.5).toFixed(1)}" fill="#fff"/>`;
  return s;
}

function lightsArt(setting, r) {
  let s = '';
  if (setting === 'forest') {
    for (let i = 0; i < 34; i++)
      s += `<g class="floaty" style="${delay(r, 5)};animation-duration:${(3 + r() * 3).toFixed(1)}s"><circle class="twinkle" style="${delay(r, 3)}" cx="${(30 + r() * 340).toFixed(0)}" cy="${(30 + r() * 230).toFixed(0)}" r="${(2 + r() * 2.5).toFixed(1)}" fill="${r() > 0.5 ? '#f6ff8a' : '#b8ffb0'}"/></g>`;
  } else if (setting === 'ocean') {
    const cols = ['#ff9ecb', '#9ee7ff', '#d3b3ff', '#fff3a8'];
    for (let i = 0; i < 7; i++) {
      const x = 40 + i * 52 + r() * 16, y = 50 + r() * 170, c = cols[i % 4];
      s += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})"><g class="floaty tappable" data-tap="star" style="${delay(r, 5)}"><circle class="glow" r="24" fill="${c}" opacity=".35"/><path d="M-13,0 a13,14 0 0 1 26,0z" fill="${c}" stroke="#fff" stroke-width="1.5"/><path d="M-8,2 q-3,10 0,18 M0,2 q3,10 0,20 M8,2 q3,10 0,18" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/></g></g>`;
    }
  } else if (setting === 'space') {
    const cols = ['#ff9ecb', '#9ee7ff', '#fff3a8', '#b8ffb0', '#d3b3ff'];
    for (let i = 0; i < 9; i++) {
      const c = cols[i % 5];
      s += `<g transform="translate(${(r() * 240 - 60).toFixed(0)} ${(r() * 200 - 30).toFixed(0)})"><g class="shoot" style="${delay(r, 5)};animation-duration:${(3 + r() * 3).toFixed(1)}s"><path d="M0,0 l-60,21" stroke="${c}" stroke-width="5" stroke-linecap="round" opacity=".7"/><circle r="5" fill="#fff"/></g></g>`;
    }
  } else {
    const bands = [['#7dffb2', 70], ['#b79cff', 110], ['#7de3ff', 150]];
    for (const [c, y] of bands)
      s += `<g class="aurora" style="${delay(r, 6)}"><path d="M-40,${y} q60,-60 120,-10 t120,-10 t120,0 t120,-20" fill="none" stroke="${c}" stroke-width="34" stroke-linecap="round" opacity=".5"/></g>`;
    s += stars(r, 20, 200);
  }
  return s;
}

export function sparkles(r, cx, cy, spread, n = 12) {
  const cols = ['#fff', '#ffe066', '#ffd1e8', '#bdf4ff'];
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = cx + (r() - 0.5) * spread * 2, y = cy + (r() - 0.5) * spread * 1.6;
    s += `<path class="sparkle" style="${delay(r, 2)}" d="${starPath(x, y, 5 + r() * 6, 2, 4)}" fill="${cols[i % 4]}"/>`;
  }
  return s;
}

function confetti(r) {
  const cols = ['#ff6b6b', '#ffd166', '#06d6a0', '#4cc9f0', '#c77dff'];
  let s = '';
  for (let i = 0; i < 28; i++)
    s += `<rect class="snowfall" style="${delay(r, 6)};animation-duration:${(4 + r() * 3).toFixed(1)}s" x="${(r() * 400).toFixed(0)}" y="-10" width="6" height="9" rx="1.5" fill="${cols[i % 5]}" transform="rotate(${(r() * 60 - 30).toFixed(0)})"/>`;
  return s;
}

/* ---------- scene composer ---------- */

export const tapWrap = (x, y, sc, tap, inner, flip = false) =>
  `<g transform="translate(${x} ${y}) scale(${flip ? -sc : sc} ${sc})"><g data-tap="${tap}">${inner}</g></g>`;

/**
 * spec: { setting, time, seed, hero:{kind,mood,pose}, friend, item,
 *         prop:'home'|'obstacle'|'treasure'|'critter'|'family'|null,
 *         baby, lights, fx:'sparkle'|'confetti'|null }
 */
export function buildScene(spec) {
  const id = ++uid;
  const r = rng(spec.seed || 7);
  const { setting = 'forest', time = 'day', hero, friend, item, prop, fx } = spec;
  const helmet = setting === 'ocean' || setting === 'space';
  const lit = time === 'night' || time === 'dusk' || time === 'dark';
  let s = background(setting, time, r, id);

  if (spec.lights) s += lightsArt(setting, r);

  const heroX = prop ? 158 : 200;
  const propX = 300;
  if (prop === 'home') s += tapWrap(propX, 320, 1, 'prop', `<g class="tappable">${homeArt(setting, lit)}</g>`);
  if (prop === 'obstacle') s += tapWrap(propX + 6, 322, 1, 'prop', `<g class="tappable">${obstacleArt(setting, r)}</g>`);
  if (prop === 'treasure') s += tapWrap(propX, 286, 1.7, 'magic', `<g class="pose-idle">${treasureArt(setting)}</g>`) + sparkles(r, propX, 270, 50, 8);
  if (prop === 'critter') s += tapWrap(propX, 300, 1.6, 'friend', `<g class="pose-idle">${critterArt(setting)}</g>`);
  if (prop === 'family')
    s += tapWrap(propX - 22, 292, 1.7, 'friend', `<g class="pose-cheer">${critterArt(setting)}</g>`) +
      tapWrap(propX + 34, 296, 1.5, 'friend', `<g class="pose-cheer" style="animation-delay:-.3s">${critterArt(setting)}</g>`, true);

  if (hero) {
    const z = hero.pose === 'sleep' ? `<g class="zzz" fill="#fff" font-family="ui-rounded,system-ui" font-weight="800"><text x="30" y="-60" font-size="16">z</text><text x="42" y="-76" font-size="20">z</text><text x="56" y="-96" font-size="26">Z</text></g>` : '';
    s += tapWrap(heroX, 256, 1.2, 'hero', `<g class="pose-${hero.pose || 'idle'}">${heroArt(hero.kind, { mood: hero.mood, helmet, item })}${z}</g>`);
  }
  if (spec.baby) s += tapWrap(heroX + 62, 318, 1, 'friend', `<g class="pose-idle">${critterArt(setting)}</g>`);
  if (friend) {
    const ground = friend === 'turtle';
    const pose = ground ? (hero && hero.pose === 'walk' ? 'pose-walk' : 'pose-idle') : 'floaty';
    s += tapWrap(heroX - (ground ? 78 : 66), ground ? 322 : 168, 1.35, 'friend', `<g class="${pose}">${friendArt(friend)}</g>`, true);
  }
  if (fx === 'sparkle') s += sparkles(r, 200, 190, 150, 18);
  if (fx === 'confetti') s += confetti(r);

  return `<svg class="scene" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img">${s}</svg>`;
}

export const icon = (inner, box = '-32 -32 64 64') => `<svg viewBox="${box}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
export const heroIcon = (kind) => icon(heroArt(kind), '-62 -104 124 176');
