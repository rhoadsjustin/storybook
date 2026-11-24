// The story engine: turns the answers into a title and a list of pages,
// each with its text and a description of the picture to draw.
import { rng } from './scenes.js';

export const OPTIONS = {
  hero: { bunny: 'Bunny', fox: 'Fox', bear: 'Bear', cat: 'Kitten', dragon: 'Dragon', robot: 'Robot' },
  setting: { forest: 'Whispering Woods', ocean: 'Coral Kingdom', space: 'Marshmallow Moon', snow: 'Snowy Peaks' },
  friend: { bird: 'Bluebird', firefly: 'Firefly', turtle: 'Turtle', star: 'Little star' },
  item: { lantern: 'Glowing lantern', brush: 'Magic paintbrush', shell: 'Singing seashell', bell: 'Golden bell' },
  quest: { treasure: 'Find a treasure', friend: 'Make a new friend', rescue: 'Help someone home', brave: 'Be brave in the dark' },
  mood: { bedtime: 'Sleepy bedtime', adventure: 'Big adventure' },
};

export const NAMES = ['Pip', 'Momo', 'Tiko', 'Lulu', 'Bibi', 'Zuzu', 'Nori', 'Fig', 'Juno', 'Milo', 'Poppy', 'Olly'];

const KIND = { bunny: 'bunny', fox: 'fox', bear: 'bear', cat: 'kitten', dragon: 'dragon', robot: 'robot' };
const FRIEND = { bird: 'a little bluebird', firefly: 'a tiny firefly', turtle: 'a small green turtle', star: 'a little twinkling star' };
const ITEM = { lantern: 'glowing lantern', brush: 'magic paintbrush', shell: 'singing seashell', bell: 'golden bell' };
const PRONOUNS = {
  he: { he: 'he', He: 'He', him: 'him', his: 'his', himself: 'himself', was: 'was' },
  she: { he: 'she', He: 'She', him: 'her', his: 'her', himself: 'herself', was: 'was' },
  they: { he: 'they', He: 'They', him: 'them', his: 'their', himself: 'themself', was: 'were' },
};

const WORLD = {
  forest: {
    place: 'the Whispering Woods', home: 'a snug little cottage beneath the oldest oak tree',
    paths: ['hopped over mossy logs', 'ducked under ferns as tall as towers', 'tiptoed past sleepy mushrooms', 'splashed across a giggling stream'],
    sound: 'The leaves went hush, hush, hush.',
    obstacle: 'a great tangle of thorny brambles', obsThe: 'the brambles',
    treasure: 'Golden Acorn', critter: 'hedgehog', lights: 'Firefly Dance',
    lightsDesc: 'Thousands of tiny fireflies swirled up through the trees, twinkling gold and green',
    night: 'the owls began their sleepy songs',
  },
  ocean: {
    place: 'the Coral Kingdom, deep beneath the waves', home: 'a shiny shell house tucked in the sea grass',
    paths: ['swished past waving seaweed', 'glided over gardens of coral', 'followed a parade of tiny silver fish', 'drifted through a tunnel of bubbles'],
    sound: 'The bubbles went blub, blub, blub.',
    obstacle: 'a dark and swirling current', obsThe: 'the current',
    treasure: 'Moon Pearl', critter: 'octopus', lights: 'Jellyfish Lantern Parade',
    lightsDesc: 'Hundreds of jellyfish drifted up from the deep, glowing pink and blue like floating lanterns',
    night: 'the sea turned a deep and dreamy blue',
  },
  space: {
    place: 'the Marshmallow Moon, far out among the stars', home: 'a little red rocket parked beside a crater',
    paths: ['bounced over silvery craters', 'floated past a planet with a hula-hoop ring', 'hopped from moon rock to moon rock', 'slid down a hill of soft moon dust'],
    sound: 'The stars hummed a quiet tune.',
    obstacle: 'a tumbling field of grumbly space rocks', obsThe: 'the space rocks',
    treasure: 'Star Gem', critter: 'moon sprout', lights: 'Rainbow Comet Shower',
    lightsDesc: 'Comets of every color streaked across the sky, trailing long ribbons of light',
    night: 'the faraway planets glowed like night-lights',
  },
  snow: {
    place: 'the Snowy Peaks, where the mountains wear white hats', home: 'a warm wooden cabin with a curl of chimney smoke',
    paths: ['crunched through sparkling snow', 'slid down a smooth, swooshy hill', 'tiptoed across a frozen pond', 'followed a trail of tiny paw prints'],
    sound: 'The snow went crunch, crunch, crunch.',
    obstacle: 'a howling, whirling blizzard', obsThe: 'the blizzard',
    treasure: 'Crystal Snowflake', critter: 'penguin', lights: 'Northern Lights',
    lightsDesc: 'Ribbons of green and violet light danced across the whole wide sky',
    night: 'the stars came out one by one',
  },
};

const ITEM_LINE = {
  lantern: '{He} held it up high. Its warm, golden light shone right through {obsThe}, and there it was: a safe little path that nobody had noticed before.',
  brush: 'Swish, swish, swoosh! With three big strokes, {he} painted a shimmering rainbow bridge that curved right over {obsThe}.',
  shell: '{He} blew one soft, low note. Hoooom. {ObsThe} grew quiet and still, as if listening, and gently opened the way.',
  bell: 'Ting-a-ling-a-ling! The sound was so bright and cheerful that {obsThe} seemed to forget all about being scary, and the way opened wide.',
};

const QUEST = {
  treasure: {
    title: '{N} and the {treasure}',
    start: 'One morning, {N} found an old map tucked under {his} pillow. It showed the way to the lost {treasure}! “I’m going to find it,” said {N}, and {he} packed {his} {item}, just in case.',
    goalShort: '“To find the {treasure},” said {N}.',
    teamUp: '“That sounds like a job for two!” said {F}.',
    goal: 'And there, on the other side, sat the {treasure}, glowing like a tiny sun. But {N} didn’t keep it all to {himself}. {He} carried it home, so that everyone could share its light.',
  },
  friend: {
    title: '{N} Finds a Friend',
    start: '{N} knew lots of games, but had nobody to play them with. “Today,” said {N}, “I’m going to find a friend.” So {he} picked up {his} {item} and set off.',
    goalShort: '“To find a friend,” said {N}.',
    teamUp: '{F} giggled. “You just found one! Let’s go and find another.”',
    goal: 'On the other side sat a shy little {critter}, all alone. “Would you like to play with us?” asked {N}. The {critter} smiled the biggest smile. “Yes, please! I was hoping someone would ask.”',
  },
  rescue: {
    title: '{N} and the Lost Little {Critter}',
    start: 'One morning, {N} heard a tiny sniffle. It was a baby {critter}, all alone. “I can’t find my family,” it squeaked. “Don’t worry,” said {N}, picking up {his} {item}. “I’ll help you get home.”',
    goalShort: '“To take this little one home,” said {N}.',
    teamUp: '“That sounds like a job for three!” said {F}.',
    goal: 'And there, on the other side, was the whole {critter} family! “Our baby!” they cried. There were hugs, and happy tears, and more hugs. “Thank you, {N},” said the little one. “You’re the kindest {kind} I know.”',
  },
  brave: {
    title: '{N} and the {lights}',
    start: 'Everyone was talking about the {lights}. But it only happened after dark, and {N} {was} a little bit afraid of the dark. “I still want to see it,” whispered {N}, and {he} held {his} {item} tight.',
    goalShort: '“To see the {lights},” said {N}.',
    teamUp: '“Ooh! May I come too?” said {F}. “Things are less scary with two.”',
    goal: 'They arrived just as the sky grew dark. {N} held {F} close… and then it began. {lightsDesc}. “Ohhh,” breathed {N}. The dark wasn’t scary at all. It was where the most beautiful things were hiding.',
  },
};

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const fill = (t, v) => t.replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m));

export function cleanName(raw) {
  const s = String(raw || '').replace(/[^\p{L}\p{M}' -]/gu, '').trim().slice(0, 14);
  return s ? cap(s) : '';
}

export function randomAnswers(seed = Date.now()) {
  const r = rng(seed);
  const pick = (o) => { const k = Array.isArray(o) ? o : Object.keys(o); return k[Math.floor(r() * k.length)]; };
  return {
    hero: pick(OPTIONS.hero), name: pick(NAMES), pro: pick(['he', 'she', 'they']), setting: pick(OPTIONS.setting),
    friend: pick(OPTIONS.friend), item: pick(OPTIONS.item), quest: pick(OPTIONS.quest), mood: pick(OPTIONS.mood),
  };
}

export function makeStory(a, seed) {
  const r = rng(seed);
  const pick = (arr) => arr[Math.floor(r() * arr.length)];
  const w = WORLD[a.setting], q = QUEST[a.quest];
  const N = cleanName(a.name) || 'Pip';
  const F = pick(NAMES.filter((n) => n.toLowerCase() !== N.toLowerCase()));
  const paths = [...w.paths].sort(() => r() - 0.5);

  const v = {
    ...PRONOUNS[a.pro] || PRONOUNS.they, N, F, kind: KIND[a.hero], fk: FRIEND[a.friend], item: ITEM[a.item],
    place: w.place, home: w.home, sound: w.sound, obstacle: w.obstacle, Obstacle: cap(w.obstacle), obsThe: w.obsThe, ObsThe: cap(w.obsThe),
    treasure: w.treasure, critter: w.critter, Critter: cap(w.critter), lights: w.lights, lightsDesc: w.lightsDesc, night: w.night,
    adj: pick(['curious', 'cheerful', 'gentle', 'clever', 'giggly']), path1: paths[0], path2: paths[1],
  };
  const t = (s) => fill(fill(s, v), v);

  const bedtime = a.mood === 'bedtime';
  const base = { setting: a.setting, item: a.item };
  const H = (mood, pose) => ({ kind: a.hero, mood, pose });
  const rescue = a.quest === 'rescue', brave = a.quest === 'brave';
  const goalProp = { treasure: 'treasure', friend: 'critter', rescue: 'family', brave: null }[a.quest];
  const late = brave ? 'dusk' : 'day';

  const pages = [
    { kind: 'cover', text: t(q.title), scene: { ...base, time: 'day', hero: H('cheer', 'cheer'), fx: 'sparkle' } },
    {
      text: t('Once upon a time, in {place}, there lived a {adj} little {kind} named {N}. {N} lived in {home}. {sound}'),
      scene: { ...base, time: 'morning', hero: H('happy', 'idle'), prop: 'home' },
    },
    { text: t(q.start), scene: { ...base, time: 'morning', hero: H(brave ? 'worried' : 'happy', 'idle'), prop: 'home', baby: rescue } },
    {
      text: t(`Before long, {N} met {F}, {fk}. “Where are you going?” asked {F}. ${q.goalShort} ${q.teamUp} And just like that, they were a team.`),
      scene: { ...base, time: 'day', hero: H('happy', 'idle'), friend: a.friend, baby: rescue },
    },
    {
      text: t('Together they {path1}. Then they {path2}. {sound} “Are we nearly there?” asked {F}. “Nearly,” said {N}. “I think.”'),
      scene: { ...base, time: late, hero: H('happy', 'walk'), friend: a.friend, baby: rescue },
    },
    {
      text: t('But then… oh no! {Obstacle} blocked the way. {N}’s knees went wobbly, and {F} hid behind {him}. “It’s too big,” whispered {F}. “It’s too scary.” {N} took one slow, deep breath.'),
      scene: { ...base, time: 'dark', hero: H('worried', 'idle'), friend: a.friend, prop: 'obstacle' },
      dark: true,
    },
    {
      text: t(`Then {N} remembered {his} {item}. ${ITEM_LINE[a.item]} “You did it!” cheered {F}. “We did it,” said {N}.`),
      scene: { ...base, time: late, hero: H('cheer', 'cheer'), friend: a.friend, fx: 'sparkle', baby: rescue },
      sfx: 'sparkle',
    },
    {
      text: t(q.goal),
      scene: { ...base, time: brave ? 'night' : 'dusk', hero: H('cheer', brave ? 'idle' : 'cheer'), friend: a.friend, prop: goalProp, lights: brave, baby: rescue },
      sfx: 'fanfare',
    },
    bedtime
      ? {
        text: t('That night, as {night}, {N} snuggled into bed, with {F} curled up close by. “Tomorrow,” yawned {N}, “let’s have another adventure.” But for now, it was time to dream. Goodnight, {N}.'),
        scene: { ...base, item: null, time: 'night', hero: H('sleep', 'sleep'), friend: a.friend, prop: 'home' },
      }
      : {
        text: t('Back home, everybody cheered! There was dancing, and giggling, and a very big cake. “What shall we do tomorrow?” asked {F}. {N} grinned. “Something even bigger!”'),
        scene: { ...base, time: 'dusk', hero: H('cheer', 'cheer'), friend: a.friend, prop: 'home', fx: 'confetti' },
      },
  ];
  pages[pages.length - 1].last = true;
  pages.forEach((p, i) => { p.scene.seed = seed + i * 101; });
  return { title: pages[0].text, pages, answers: { ...a, name: N }, seed, bedtime };
}
