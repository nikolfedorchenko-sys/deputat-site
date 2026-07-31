'use strict';

/**
 * Ініціалізація SQLite (better-sqlite3): створення схеми та наповнення
 * стартовим (seed) контентом реальними фактами про депутата.
 *
 * БД — один файл db/data.sqlite. Для простого хостингу цього достатньо.
 */

const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, 'data.sqlite');
const db = new Database(DB_PATH);

// WAL — швидше й безпечніше для одночасних читань/записів
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Схема ────────────────────────────────────────────────────────────────
db.exec(`
  -- Довільні тексти/налаштування секцій у форматі ключ→значення
  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT ''
  );

  -- Новини
  CREATE TABLE IF NOT EXISTS news (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    date        TEXT NOT NULL,                       -- YYYY-MM-DD
    tag         TEXT DEFAULT '',
    body        TEXT NOT NULL DEFAULT '',
    cover_image TEXT DEFAULT '',                     -- /uploads/...
    status      TEXT NOT NULL DEFAULT 'draft',       -- draft | published
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Додаткові фото до конкретного поста (галерея поста)
  CREATE TABLE IF NOT EXISTS news_images (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    news_id INTEGER NOT NULL,
    path    TEXT NOT NULL,
    FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
  );

  -- Загальна фотогалерея
  CREATE TABLE IF NOT EXISTS gallery (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    path       TEXT NOT NULL,
    caption    TEXT DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  -- Досягнення/картки діяльності
  CREATE TABLE IF NOT EXISTS achievements (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT NOT NULL,
    body       TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  -- Звернення з форми приймальні
  CREATE TABLE IF NOT EXISTS submissions (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    contact    TEXT NOT NULL,
    subject    TEXT DEFAULT '',                      -- тема звернення (ЖКГ/благоустрій/інше)
    message    TEXT NOT NULL,
    processed  INTEGER NOT NULL DEFAULT 0,           -- 0|1
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// М'яка міграція: додаємо колонку subject, якщо БД створена ще до її появи.
try {
  const cols = db.prepare('PRAGMA table_info(submissions)').all();
  if (!cols.some((c) => c.name === 'subject')) {
    db.exec("ALTER TABLE submissions ADD COLUMN subject TEXT DEFAULT ''");
  }
} catch (_) { /* колонка вже є */ }

// ── Хелпери для settings ───────────────────────────────────────────────────
const getSettingStmt = db.prepare('SELECT value FROM settings WHERE key = ?');
const upsertSettingStmt = db.prepare(`
  INSERT INTO settings (key, value) VALUES (@key, @value)
  ON CONFLICT(key) DO UPDATE SET value = excluded.value
`);

function getSetting(key, fallback = '') {
  const row = getSettingStmt.get(key);
  return row ? row.value : fallback;
}
function setSetting(key, value) {
  upsertSettingStmt.run({ key, value: value == null ? '' : String(value) });
}
function getAllSettings() {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

// ── Стартовий контент (seed) ────────────────────────────────────────────────
// Значення пишемо лише якщо ключ ще не існує — щоб не перезатирати правки редактора.
const SEED_SETTINGS = {
  // Hero
  hero_name: 'Тихонович Юрій Станіславович',
  hero_role1: 'Депутат Київської міської ради IX скликання',
  hero_role2: 'Член правління ПрАТ «ХК «Київміськбуд»',
  hero_faction: 'Фракція «Європейська Солідарність»',
  hero_eyebrow: 'Округ №12 · Солом’янський район',
  hero_slogan:
    'Господарський підхід до кожного двору Солом’янки: житлово-комунальне ' +
    'господарство, енергетика, робота зі зверненнями мешканців.',
  hero_photo: '/img/deputy.jpg',
  logo: '/img/logo-placeholder.svg',

  // Про депутата
  bio: 'Юрій Станіславович Тихонович (1970 р. н.) — депутат Київської міської ради ' +
       'IX скликання, член правління ПрАТ «Холдингова компанія «Київміськбуд». ' +
       'Понад два десятиліття професійно працює у сфері міського будівництва та ' +
       'житлово-комунального господарства столиці.',
  education:
    '2011 — Київський національний університет будівництва і архітектури, ' +
    'спеціальність «Міське будівництво та господарство».\n' +
    '2007 — Київський славістичний університет, спеціальність «Менеджмент організацій».',
  career:
    '2004–2006 — заступник директора КП «Інженерний центр».\n' +
    '2005–2007 — помічник-консультант народних депутатів України.\n' +
    '2011, 2013 — засновник інвестиційно-будівельних компаній.\n' +
    'з 2020 — заступник директора ТОВ «АЙ СІ ТІ».',

  // Депутатська діяльність
  activity_district: 'Округ №12, Солом’янський район м. Києва',
  activity_position:
    'Перший заступник голови постійної комісії Київради з питань ' +
    'житлово-комунального господарства та паливно-енергетичного комплексу',
  activity_intro:
    'Основні напрямки роботи — модернізація житлово-комунального господарства, ' +
    'надійність тепло- та енергопостачання, благоустрій і розвиток інфраструктури ' +
    'Солом’янського району.',
  board_zone: '[УТОЧНИТИ — зона відповідальності в правлінні Київміськбуду]',

  // Контакти / приймальня
  contact_address: '03057, м. Київ, вул. Михайла Брайчевського, 9',
  contact_phones: '063-517-06-39, (044) 456-59-21, (044) 456-59-22',
  contact_phones_note: '[УТОЧНИТИ актуальність телефонів]',
  contact_email: '[УТОЧНИТИ email]',
  contact_hours: '[УТОЧНИТИ — графік прийому]',
  facebook_url: 'https://www.facebook.com/YuriiTykhonovych/',
  kyivrada_url: 'https://kmr.gov.ua/',
  map_embed: '', // за бажанням — HTML-код <iframe> карти Google, редагується в адмінці

  // SEO / OpenGraph
  meta_title: 'Тихонович Юрій Станіславович — депутат Київради',
  meta_description:
    'Офіційний сайт Тихоновича Юрія Станіславовича — депутата Київської міської ради ' +
    'IX скликання, округ №12 (Солом’янський район). Новини, діяльність, приймальня.',
  og_image: '/img/deputy.jpg',
};

for (const [key, value] of Object.entries(SEED_SETTINGS)) {
  if (getSettingStmt.get(key) === undefined) setSetting(key, value);
}

// Досягнення-картки (плейсхолдери) — тільки якщо таблиця порожня
const achievementsCount = db.prepare('SELECT COUNT(*) AS c FROM achievements').get().c;
if (achievementsCount === 0) {
  const insert = db.prepare(
    'INSERT INTO achievements (title, body, sort_order) VALUES (?, ?, ?)'
  );
  // Картки секції «Результати роботи». Якщо заголовок починається з числа —
  // на публічній сторінці воно анімується (count-up 0→N).
  const seed = [
    ['15 з 17', 'пленарних засідань Київради відвідано у 2022 році (за даними руху ЧЕСНО)', 1],
    ['[ N ]', '[ звернень мешканців опрацьовано — дані від приймальні ]', 2],
    ['[ N ]', '[ проєктів рішень подано / підтримано — дані Київради ]', 3],
    ['[ N ]', '[ дворів / об’єктів відремонтовано на окрузі — дані від команди ]', 4],
  ];
  const tx = db.transaction((rows) => rows.forEach((r) => insert.run(...r)));
  tx(seed);
}

// Приклад новини — тільки якщо таблиця порожня
const newsCount = db.prepare('SELECT COUNT(*) AS c FROM news').get().c;
if (newsCount === 0) {
  db.prepare(
    `INSERT INTO news (title, date, tag, body, status)
     VALUES (@title, @date, @tag, @body, 'published')`
  ).run({
    title: 'Вітаю на офіційному сайті',
    date: new Date().toISOString().slice(0, 10),
    tag: 'Загальне',
    body:
      'Це стартова новина-приклад. Її, як і всі інші матеріали сайту, можна ' +
      'відредагувати або видалити в адмінпанелі за адресою /manager.',
  });
}

module.exports = {
  db,
  getSetting,
  setSetting,
  getAllSettings,
};
