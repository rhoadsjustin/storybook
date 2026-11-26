// All sound is made on the device: Web Audio synths for music, ambience and
// effects, and the built-in speech voice for narration. No audio files.
import { rng } from './scenes.js';

let ctx, master, musicBus, ambBus, sfxBus, noiseBuf;
let soundOn = true;
let timer = null, ambTimer = null, ambNodes = [];
let song = null, nextTime = 0, step = 0, currentSetting = null;

const ROOT = { forest: 60, ocean: 57, space: 62, snow: 65, bethlehem: 60 };
// "Silent Night" (1818, public domain) for the Christmas stories: semitones above the
// root on a grid of eighth notes, six to a bar, with one bass note per bar.
const _ = null;
const CAROL = {
  notes: [
    7, _, _, 9, 7, _, 4, _, _, _, _, _, 7, _, _, 9, 7, _, 4, _, _, _, _, _,
    14, _, _, _, 14, _, 11, _, _, _, _, _, 12, _, _, _, 12, _, 7, _, _, _, _, _,
    9, _, _, _, 9, _, 12, _, _, 11, 9, _, 7, _, _, 9, 7, _, 4, _, _, _, _, _,
    9, _, _, _, 9, _, 12, _, _, 11, 9, _, 7, _, _, 9, 7, _, 4, _, _, _, _, _,
    14, _, _, _, 14, _, 17, _, _, 14, 11, _, 12, _, _, _, _, _, 16, _, _, _, _, _,
    12, _, _, 7, 4, _, 7, _, _, 5, 2, _, 0, _, _, _, _, _, _, _, _, _, _, _,
  ],
  bass: [0, 0, 0, 0, -5, -5, 0, 0, -7, -7, 0, 0, -7, -7, 0, 0, -5, -5, 0, 0, 0, -5, 0, 0],
};
const SCALE = { major: [0, 2, 4, 7, 9], minor: [0, 3, 5, 7, 10] };
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);

function ensure() {
  if (ctx) return true;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return false;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = soundOn ? 1 : 0;
  master.connect(ctx.destination);
  musicBus = ctx.createGain(); musicBus.gain.value = 0.5;
  ambBus = ctx.createGain(); ambBus.gain.value = 0.6;
  sfxBus = ctx.createGain(); sfxBus.gain.value = 0.8;
  const echo = ctx.createDelay(1); echo.delayTime.value = 0.36;
  const fb = ctx.createGain(); fb.gain.value = 0.28;
  musicBus.connect(master); musicBus.connect(echo); echo.connect(fb); fb.connect(echo); echo.connect(master);
  ambBus.connect(master); sfxBus.connect(master);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return true;
}

function tone(freq, t, dur, { type = 'sine', gain = 0.2, bus = sfxBus, to = null, attack = 0.015 } = {}) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(bus);
  o.start(t); o.stop(t + dur + 0.05);
}

function noise(t, dur, { freq = 1000, to = null, q = 1, gain = 0.2, type = 'bandpass', bus = sfxBus } = {}) {
  const src = ctx.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
  const f = ctx.createBiquadFilter(); f.type = type; f.Q.value = q;
  f.frequency.setValueAtTime(freq, t);
  if (to) f.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + dur * 0.3);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f); f.connect(g); g.connect(bus);
  src.start(t); src.stop(t + dur + 0.05);
}

/* ---------- music ---------- */

function schedule() {
  if (!song || ctx.state !== 'running') return;
  if (nextTime < ctx.currentTime) nextTime = ctx.currentTime + 0.05;
  const beat = 60 / song.bpm / 2;
  while (song.carol && nextTime < ctx.currentTime + 0.4) {
    const n = CAROL.notes[step % CAROL.notes.length];
    if (n !== null) tone(hz(song.root + 12 + n), nextTime, beat * 3.2, { type: 'triangle', gain: 0.12, bus: musicBus, attack: 0.03 });
    if (step % 6 === 0) {
      const b = song.root - 12 + CAROL.bass[Math.floor(step / 6) % CAROL.bass.length];
      tone(hz(b), nextTime, beat * 6, { gain: 0.15, bus: musicBus, attack: 0.08 });
      tone(hz(b + 16), nextTime + beat * 2, beat * 4, { gain: 0.04, bus: musicBus, attack: 0.3 });
    }
    step++;
    nextTime += beat;
  }
  while (nextTime < ctx.currentTime + 0.4) {
    const scale = SCALE[song.dark ? 'minor' : 'major'];
    const root = song.root - (song.dark ? 2 : 0);
    const deg = song.melody[step % song.melody.length];
    if (deg !== null) {
      const m = root + 12 + scale[deg % 5] + 12 * Math.floor(deg / 5);
      tone(hz(m), nextTime, beat * 2.6, { type: 'triangle', gain: 0.11, bus: musicBus });
    }
    if (step % 8 === 0) {
      const bar = Math.floor(step / 8) % 4;
      const b = root - 12 + [0, scale[3], scale[1] , scale[3]][bar];
      tone(hz(b), nextTime, beat * 8, { gain: 0.16, bus: musicBus, attack: 0.08 });
      tone(hz(b + 12 + scale[2]), nextTime, beat * 8, { gain: 0.05, bus: musicBus, attack: 0.4 });
    }
    step++;
    nextTime += beat;
  }
}

/* ---------- ambience ---------- */

function stopAmbience() {
  clearInterval(ambTimer); ambTimer = null;
  ambNodes.forEach((n) => { try { n.stop(); } catch { /* already stopped */ } });
  ambNodes = [];
}

function loopNoise(type, freq, gain, lfoHz) {
  const src = ctx.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
  const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = 0.7;
  const g = ctx.createGain(); g.gain.value = gain;
  const lfo = ctx.createOscillator(), lg = ctx.createGain();
  lfo.frequency.value = lfoHz; lg.gain.value = gain * 0.8;
  lfo.connect(lg); lg.connect(g.gain);
  src.connect(f); f.connect(g); g.connect(ambBus);
  src.start(); lfo.start();
  ambNodes.push(src, lfo);
}

function startAmbience(setting) {
  stopAmbience();
  if (setting === 'forest') {
    ambTimer = setInterval(() => { if (Math.random() < 0.45 && ctx.state === 'running') chirp(0.05); }, 1700);
  } else if (setting === 'ocean') {
    loopNoise('lowpass', 420, 0.09, 0.13);
    ambTimer = setInterval(() => {
      if (Math.random() < 0.5 && ctx.state === 'running') tone(300 + Math.random() * 300, ctx.currentTime, 0.12, { gain: 0.05, bus: ambBus, to: 900 });
    }, 1300);
  } else if (setting === 'space') {
    for (const f of [55, 82.4, 110.4]) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = f; g.gain.value = 0.045;
      o.connect(g); g.connect(ambBus); o.start();
      ambNodes.push(o);
    }
  } else {
    loopNoise('bandpass', 520, 0.07, 0.1);
  }
}

function chirp(gain = 0.12) {
  const t = ctx.currentTime, base = 2200 + Math.random() * 900;
  for (let i = 0; i < 3; i++) tone(base, t + i * 0.11, 0.08, { gain, to: base * 1.4, bus: gain < 0.1 ? ambBus : sfxBus });
}

/* ---------- narration ---------- */

const synth = window.speechSynthesis;
let voice = null;
function pickVoice() {
  if (!synth) return;
  const vs = synth.getVoices().filter((v) => /^en/i.test(v.lang));
  const prefer = ['Samantha', 'Karen', 'Moira', 'Google UK English Female', 'Google US English', 'Daniel'];
  voice = prefer.map((n) => vs.find((v) => v.name.includes(n))).find(Boolean) || vs.find((v) => v.localService) || vs[0] || null;
}
if (synth) { pickVoice(); synth.addEventListener?.('voiceschanged', pickVoice); }

export const audio = {
  get on() { return soundOn; },
  canSpeak: !!synth,

  /** Call from a tap: browsers only allow audio to start from a user gesture. */
  unlock() {
    if (!ensure()) return;
    if (ctx.state === 'suspended') ctx.resume();
    if (synth && !this._spoke) { this._spoke = true; synth.speak(new SpeechSynthesisUtterance('')); }
  },

  setSound(on) {
    soundOn = on;
    if (ctx) master.gain.setTargetAtTime(on ? 1 : 0, ctx.currentTime, 0.05);
  },

  startStory(story) {
    if (!ensure()) return;
    const r = rng(story.seed + 5);
    const melody = [];
    let d = 2;
    for (let i = 0; i < 32; i++) {
      d = Math.max(0, Math.min(9, d + Math.floor(r() * 5) - 2));
      melody.push(i % 8 === 7 || r() < 0.3 ? null : d);
    }
    song = { melody, bpm: story.carol ? 76 : story.bedtime ? 64 : 92, root: ROOT[story.answers.setting], dark: false, carol: !!story.carol };
    step = 0; nextTime = ctx.currentTime + 0.3;
    clearInterval(timer);
    timer = setInterval(schedule, 100);
    if (currentSetting !== story.answers.setting) { currentSetting = story.answers.setting; startAmbience(currentSetting); }
  },

  setDark(dark) { if (song) song.dark = !!dark; },

  stopStory() {
    clearInterval(timer); timer = null; song = null;
    if (ctx) stopAmbience();
    currentSetting = null;
    this.hush();
  },

  pause(hidden) {
    if (!ctx) return;
    if (hidden) { ctx.suspend(); this.hush(); } else ctx.resume();
  },

  sfx(name) {
    if (!ctx || ctx.state !== 'running') return;
    const t = ctx.currentTime;
    switch (name) {
      case 'pop': tone(520, t, 0.09, { gain: 0.2, to: 880 }); break;
      case 'flip': noise(t, 0.28, { freq: 900, to: 3600, q: 0.8, gain: 0.25 }); break;
      case 'boing': tone(190, t, 0.16, { gain: 0.25, to: 520 }); tone(520, t + 0.15, 0.22, { gain: 0.2, to: 240 }); break;
      case 'chirp': chirp(); break;
      case 'bloop': tone(700, t, 0.14, { gain: 0.2, to: 260 }); break;
      case 'twinkle': [1568, 2093].forEach((f, i) => tone(f, t + i * 0.08, 0.3, { type: 'triangle', gain: 0.12 })); break;
      case 'sparkle': [1047, 1319, 1568, 2093, 2637].forEach((f, i) => tone(f, t + i * 0.07, 0.35, { type: 'triangle', gain: 0.13 })); break;
      case 'fanfare': [523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * 0.14, i === 3 ? 0.7 : 0.2, { type: 'triangle', gain: 0.2 })); break;
      case 'lullaby': [784, 988, 1175].forEach((f, i) => tone(f, t + i * 0.16, 0.5, { type: 'sine', gain: 0.14 })); break;
      case 'heehaw': tone(620, t, 0.22, { type: 'sawtooth', gain: 0.1, to: 900 }); tone(330, t + 0.24, 0.4, { type: 'sawtooth', gain: 0.1, to: 210 }); break;
      case 'baa': {
        const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter(), l = ctx.createOscillator(), lg = ctx.createGain();
        o.type = 'sawtooth'; o.frequency.setValueAtTime(430, t); o.frequency.linearRampToValueAtTime(370, t + 0.5);
        l.frequency.value = 11; lg.gain.value = 22; l.connect(lg); lg.connect(o.frequency);
        f.type = 'bandpass'; f.frequency.value = 1100; f.Q.value = 1.2;
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.3, t + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
        o.connect(f); f.connect(g); g.connect(sfxBus);
        o.start(t); l.start(t); o.stop(t + 0.6); l.stop(t + 0.6);
        break;
      }
      case 'magic':
        for (let i = 0; i < 14; i++) tone(700 + i * 130 + Math.random() * 60, t + i * 0.07, 0.3, { type: 'triangle', gain: 0.1 });
        noise(t, 1.1, { freq: 2000, to: 7000, q: 2, gain: 0.06 });
        break;
      default: break;
    }
  },

  /** Read text aloud; onWord(i) fires with the index of the word being spoken. */
  speak(text, { slow = false, onWord, onEnd } = {}) {
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voice) u.voice = voice;
    u.lang = voice?.lang || 'en-US';
    u.rate = slow ? 0.8 : 0.9;
    u.pitch = 1.1;
    const starts = [];
    text.replace(/\S+/g, (m, off) => { starts.push(off); return m; });
    u.onboundary = (e) => {
      if (e.name && e.name !== 'word') return;
      let i = starts.length - 1;
      while (i > 0 && starts[i] > e.charIndex) i--;
      onWord?.(i);
    };
    u.onend = () => onEnd?.();
    this._utter = u; // keep a reference: some browsers drop events otherwise
    synth.speak(u);
  },

  hush() { synth?.cancel(); },
};
