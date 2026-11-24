import { buildScene, heroIcon, icon, friendArt, itemArt } from './scenes.js';
import { makeStory, randomAnswers, cleanName, OPTIONS, NAMES } from './story.js';
import { audio } from './audio.js';

const $ = (s) => document.querySelector(s);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } },
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const app = $('#app');
let answers = {}, stepIdx = 0, story = null, pages = [], pageIdx = 0, busy = false;
let voiceOn = store.get('tt.voice', true);
audio.setSound(store.get('tt.sound', true));

function show(screen) {
  app.dataset.screen = screen;
  if (screen !== 'reader') audio.stopStory();
  if (screen === 'home') renderHome();
}

/* ---------- home ---------- */

function renderHome() {
  $('#homeArt').innerHTML = buildScene({ setting: 'forest', time: 'night', hero: { kind: 'bunny', mood: 'happy', pose: 'idle' }, friend: 'star', item: 'lantern', seed: 3 });
  const shelf = store.get('tt.shelf', []);
  $('#shelfWrap').hidden = !shelf.length;
  $('#shelf').innerHTML = shelf
    .map((b, i) => `<button class="book-card" data-i="${i}">${heroIcon(b.answers.hero)}<span>${esc(b.title)}</span></button>`)
    .join('');
}

$('#shelf').addEventListener('click', (e) => {
  const b = e.target.closest('.book-card');
  if (!b) return;
  const saved = store.get('tt.shelf', [])[+b.dataset.i];
  if (!saved) return;
  audio.unlock(); audio.sfx('pop');
  openStory(makeStory(saved.answers, saved.seed));
});

$('#startBtn').addEventListener('click', () => {
  audio.unlock(); audio.sfx('pop');
  answers = { pro: 'he' }; stepIdx = 0;
  show('wizard'); renderStep();
});
$('#surpriseBtn').addEventListener('click', () => { audio.unlock(); create(randomAnswers()); });

/* ---------- questions ---------- */

const emoji = (e) => `<span class="emoji">${e}</span>`;
const STEPS = [
  { key: 'hero', q: 'Who is the hero of your story?', pic: (k) => heroIcon(k) },
  { key: 'name', q: 'What is your hero’s name?' },
  { key: 'setting', q: 'Where does the story happen?', pic: (k) => buildScene({ setting: k, time: 'day', seed: 11 }) },
  { key: 'friend', q: 'Who comes along?', pic: (k) => icon(friendArt(k)) },
  { key: 'item', q: 'What magic thing does your hero carry?', pic: (k) => icon(itemArt(k)) },
  { key: 'quest', q: 'What is the story about?', pic: (k) => emoji({ treasure: '💎', friend: '🤝', rescue: '🏡', brave: '🌌' }[k]) },
  { key: 'mood', q: 'What kind of story today?', pic: (k) => emoji({ bedtime: '🌙', adventure: '🎉' }[k]) },
];

function renderPreview() {
  const a = answers;
  $('#wizArt').innerHTML = buildScene({
    setting: a.setting || 'forest', time: a.mood === 'bedtime' ? 'night' : 'day', seed: 11,
    hero: a.hero ? { kind: a.hero, mood: 'happy', pose: 'idle' } : null, friend: a.friend, item: a.item,
    fx: a.hero ? null : 'sparkle',
  });
}

function renderStep() {
  const step = STEPS[stepIdx];
  const dots = STEPS.map((_, i) => `<i class="${i === stepIdx ? 'on' : i < stepIdx ? 'done' : ''}"></i>`).join('');
  let body;
  if (step.key === 'name') {
    const chips = NAMES.slice(0, 6).map((n) => `<button class="chip" data-name="${n}">${n}</button>`).join('');
    const pros = [['he', 'he'], ['she', 'she']]
      .map(([k, l]) => `<button class="chip pro ${answers.pro === k ? 'on' : ''}" data-pro="${k}">${l}</button>`).join('');
    body = `<div class="name-step">
      <input id="nameInput" type="text" maxlength="14" autocomplete="off" autocapitalize="words" spellcheck="false" placeholder="Type a name" value="${esc(answers.name || '')}">
      <div class="chips">${chips}</div>
      <div class="chips"><span class="label">Your hero is a</span>${pros}</div>
      <button class="btn primary" id="nameNext">Next ›</button>
    </div>`;
  } else {
    body = `<div class="options n${Object.keys(OPTIONS[step.key]).length}">${Object.entries(OPTIONS[step.key])
      .map(([k, label]) => `<button class="option ${answers[step.key] === k ? 'on' : ''}" data-val="${k}"><span class="pic">${step.pic(k)}</span><span>${label}</span></button>`)
      .join('')}</div>`;
  }
  $('#wizBody').innerHTML = `<header class="wiz-head"><button class="round" id="wizBack" aria-label="Back">‹</button><div class="dots">${dots}</div></header><h2>${step.q}</h2>${body}`;
  renderPreview();
}

function nextStep() {
  if (stepIdx < STEPS.length - 1) { stepIdx++; renderStep(); } else create(answers);
}

$('#wizBody').addEventListener('click', async (e) => {
  const t = e.target.closest('button');
  if (!t || busy) return;
  audio.sfx('pop');
  if (t.id === 'wizBack') {
    if (stepIdx === 0) show('home'); else { stepIdx--; renderStep(); }
  } else if (t.dataset.val) {
    answers[STEPS[stepIdx].key] = t.dataset.val;
    t.parentElement.querySelectorAll('.option').forEach((o) => o.classList.toggle('on', o === t));
    renderPreview();
    busy = true; await wait(420); busy = false;
    nextStep();
  } else if (t.dataset.name) {
    $('#nameInput').value = t.dataset.name;
  } else if (t.dataset.pro) {
    answers.pro = t.dataset.pro;
    t.parentElement.querySelectorAll('.pro').forEach((o) => o.classList.toggle('on', o === t));
  } else if (t.id === 'nameNext') {
    saveName(); nextStep();
  }
});
$('#wizBody').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.id === 'nameInput') { e.target.blur(); saveName(); nextStep(); }
});
function saveName() {
  answers.name = cleanName($('#nameInput').value) || NAMES[Math.floor(Math.random() * NAMES.length)];
}

/* ---------- making the story ---------- */

async function create(a) {
  if (busy) return;
  busy = true;
  const seed = (Date.now() % 2147483647) | 1;
  const s = makeStory(a, seed);
  const shelf = store.get('tt.shelf', []);
  shelf.unshift({ answers: s.answers, seed, title: s.title });
  store.set('tt.shelf', shelf.slice(0, 12));
  $('#magic').hidden = false;
  audio.sfx('magic');
  await wait(1500);
  $('#magic').hidden = true;
  busy = false;
  openStory(s);
}

function openStory(s) {
  story = s;
  const last = s.pages[s.pages.length - 1];
  pages = [...s.pages, { kind: 'end', text: 'The End', scene: last.scene }];
  pageIdx = 0;
  show('reader');
  audio.startStory(s);
  renderPage();
  narrate();
}

/* ---------- reading ---------- */

const textEl = $('#storyText');

function renderPage() {
  const p = pages[pageIdx];
  $('#art').innerHTML = buildScene(p.scene);
  audio.setDark(p.dark);
  const words = p.text.split(/\s+/).map((w) => `<span class="w">${esc(w)}</span>`).join(' ');
  textEl.className = 'story-text ' + (p.kind || '');
  if (p.kind === 'cover') {
    textEl.innerHTML = `<p class="kicker">A Twinkle Tale</p><h1>${words}</h1><p class="hint">Tap › to begin</p>`;
  } else if (p.kind === 'end') {
    textEl.innerHTML = `<h1>${words}</h1><div class="end-actions"><button class="btn" id="againBtn">↺ Read again</button><button class="btn primary" id="newBtn">✨ New story</button></div>`;
  } else {
    textEl.innerHTML = `<p>${words}</p>`;
  }
  $('#dots').innerHTML = pages.map((_, i) => `<i class="${i === pageIdx ? 'on' : i < pageIdx ? 'done' : ''}"></i>`).join('');
  $('#prevBtn').disabled = pageIdx === 0;
  $('#nextBtn').disabled = pageIdx === pages.length - 1;
  fitText();
}

/** Shrink the story text until the whole page fits without scrolling. */
function fitText() {
  textEl.style.fontSize = '';
  let size = parseFloat(getComputedStyle(textEl).fontSize);
  while (size > 14 && textEl.scrollHeight > textEl.clientHeight + 1) {
    size -= 1;
    textEl.style.fontSize = size + 'px';
  }
}
let fitTimer;
window.addEventListener('resize', () => {
  clearTimeout(fitTimer);
  fitTimer = setTimeout(() => { if (app.dataset.screen === 'reader') fitText(); }, 120);
});

function narrate() {
  const p = pages[pageIdx];
  const spans = textEl.querySelectorAll('.w');
  const clear = () => spans.forEach((s) => s.classList.remove('now'));
  clear();
  if (p.sfx) audio.sfx(p.sfx);
  if (p.kind === 'end') audio.sfx('fanfare');
  if (!voiceOn) { audio.hush(); return; }
  audio.speak(p.text, {
    slow: story.bedtime,
    onWord: (i) => { clear(); spans[i]?.classList.add('now'); },
    onEnd: clear,
  });
}

async function turn(dir) {
  const n = pageIdx + dir;
  if (busy || app.dataset.screen !== 'reader' || n < 0 || n >= pages.length) return;
  busy = true;
  audio.hush(); audio.sfx('flip');
  const reader = $('#reader'), d = dir > 0 ? 'next' : 'prev';
  reader.dataset.turn = d + '-out';
  await wait(230);
  pageIdx = n;
  renderPage();
  reader.dataset.turn = d + '-in';
  await wait(260);
  delete reader.dataset.turn;
  busy = false;
  narrate();
}

$('#nextBtn').addEventListener('click', () => turn(1));
$('#prevBtn').addEventListener('click', () => turn(-1));
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;
  if (e.key === 'ArrowRight' || e.key === ' ') turn(1);
  if (e.key === 'ArrowLeft') turn(-1);
});

// Swipe to turn pages.
let sx = null, sy = 0;
$('#reader').addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; });
$('#reader').addEventListener('pointerup', (e) => {
  if (sx === null) return;
  const dx = e.clientX - sx, dy = e.clientY - sy;
  sx = null;
  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) turn(dx < 0 ? 1 : -1);
});

// Tap the words to hear them again; tap the buttons on the last page.
textEl.addEventListener('click', (e) => {
  if (e.target.closest('#againBtn')) { audio.sfx('pop'); pageIdx = 0; renderPage(); narrate(); return; }
  if (e.target.closest('#newBtn')) { audio.sfx('pop'); answers = { pro: 'he' }; stepIdx = 0; show('wizard'); renderStep(); return; }
  if (!voiceOn) return;
  narrate();
});

// Everything in the pictures can be poked.
const TAP_SFX = { hero: 'boing', friend: 'chirp', magic: 'sparkle', star: 'twinkle', fish: 'bloop', prop: 'pop' };
app.addEventListener('click', (e) => {
  const t = e.target.closest?.('[data-tap]');
  if (!t) return;
  audio.unlock();
  audio.sfx(TAP_SFX[t.dataset.tap] || 'pop');
  t.classList.remove('tapped');
  t.getBoundingClientRect();
  t.classList.add('tapped');
});
app.addEventListener('animationend', (e) => { if (e.animationName.startsWith('tap')) e.target.classList.remove('tapped'); });

/* ---------- toolbar ---------- */

function syncToggles() {
  $('#soundBtn').setAttribute('aria-pressed', audio.on);
  $('#voiceBtn').setAttribute('aria-pressed', voiceOn);
  $('#voiceBtn').hidden = !audio.canSpeak;
}
$('#homeBtn').addEventListener('click', () => { audio.sfx('pop'); show('home'); });
$('#soundBtn').addEventListener('click', () => {
  audio.setSound(!audio.on); store.set('tt.sound', audio.on); syncToggles(); audio.sfx('pop');
});
$('#voiceBtn').addEventListener('click', () => {
  voiceOn = !voiceOn; store.set('tt.voice', voiceOn); syncToggles(); narrate();
});
document.addEventListener('visibilitychange', () => audio.pause(document.hidden));

syncToggles();
show('home');
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
