'use strict';

/**
 * Точка входу. Express-застосунок:
 *  - SSR публічної сторінки (EJS) з даними з SQLite → добрий SEO/OpenGraph;
 *  - захищена адмінка /manager + REST API /api/admin/*;
 *  - публічне API читання /api/* та приймання звернень.
 */

require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('better-sqlite3-session-store')(session);
const helmet = require('helmet');
const bcrypt = require('bcryptjs');

const { db, getAllSettings } = require('./db/database');
const { requireAuthPage, requireAuthApi } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Обов'язкові змінні оточення ──────────────────────────────────────────────
if (!process.env.SESSION_SECRET || !process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
  console.error('❌ Відсутні змінні у .env (SESSION_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD). Див. .env.example');
  process.exit(1);
}

// Пароль адміна хешуємо на старті (bcrypt) і далі порівнюємо лише з хешем.
app.locals.ADMIN_USERNAME = process.env.ADMIN_USERNAME;
app.locals.adminPasswordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);

// Хелпери для шаблонів: екранування HTML і безпечне перетворення переносів рядків.
function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
app.locals.esc = escapeHtml;
app.locals.nl2br = (str) => escapeHtml(str).replace(/\r?\n/g, '<br>');
// Абзаци з тексту, розділеного порожнім рядком
app.locals.paragraphs = (str) =>
  String(str || '')
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`)
    .join('');

// Регексп маркера фото в тексті новини: [фото1], [ photo 2 ] тощо
const PHOTO_TOKEN = /^\[\s*(?:фото|photo)\s*(\d+)\s*\]$/i;

/**
 * Рендер тіла новини: абзаци тексту + фото, вставлені маркером [фотоN]
 * (окремим рядком) у потрібному місці. Повертає { html, leftover } —
 * leftover — фото, які не вставлені в текст (показуються галереєю внизу).
 */
function renderArticleBody(body, images) {
  const imgs = Array.isArray(images) ? images : [];
  const used = new Set();
  const blocks = String(body || '').replace(/\r\n/g, '\n').split(/\n{2,}/);
  const html = blocks
    .map((block) => {
      const t = block.trim();
      if (!t) return '';
      const m = t.match(PHOTO_TOKEN);
      if (m) {
        const idx = Number(m[1]) - 1;
        const img = imgs[idx];
        if (!img) return '';
        used.add(idx);
        return `<figure class="news-inline"><img src="${escapeHtml(img.path)}" alt="Фото до новини" loading="lazy"></figure>`;
      }
      return `<p>${escapeHtml(t).replace(/\r?\n/g, '<br>')}</p>`;
    })
    .join('\n');
  const leftover = imgs.filter((_, i) => !used.has(i));
  return { html, leftover };
}
app.locals.stripPhotoTokens = (str) =>
  String(str || '').replace(/\[\s*(?:фото|photo)\s*\d+\s*\]/gi, ' ');

// ── View engine ──────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// За реверс-проксі (nginx) довіряємо заголовкам X-Forwarded-* — потрібно для rate-limit і secure cookie
app.set('trust proxy', 1);

// ── Безпека / заголовки ──────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        // Дозволяємо власні стилі/скрипти + inline (невеликі вставки в шаблонах)
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
        // e-Ukraine (jsdelivr) + Google Fonts (Manrope)
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdn.jsdelivr.net', 'data:'],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        // Вбудована карта: Google або OpenStreetMap (редактор може вставити свій <iframe>)
        frameSrc: ["'self'", 'https://www.google.com', 'https://maps.google.com', 'https://www.openstreetmap.org'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: null,
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// ── Парсери тіла ─────────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));

// ── Сесії ────────────────────────────────────────────────────────────────────
// Зберігаємо у тій самій БД better-sqlite3 (таблиця sessions), тож не потрібен
// окремий драйвер node-sqlite3. Прострочені сесії чистяться раз на 15 хв.
app.use(
  session({
    store: new SQLiteStore({
      client: db,
      expired: { clear: true, intervalMs: 15 * 60 * 1000 },
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.SECURE_COOKIES === '1',
      maxAge: 1000 * 60 * 60 * 8, // 8 годин
    },
  })
);

// ── Статика ──────────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Маршрути ─────────────────────────────────────────────────────────────────
// Публічне API читання + звернення
app.use('/api', require('./routes/public'));
// Захищене API запису
app.use('/api/admin', requireAuthApi, require('./routes/admin'));
// Вхід/вихід адміна
app.use('/manager', require('./routes/auth'));

// Головна публічна сторінка (SSR з усіма секціями)
app.get('/', (req, res) => {
  const s = getAllSettings();
  const news = db
    .prepare(
      `SELECT id, title, date, tag, body, cover_image FROM news
        WHERE status = 'published' ORDER BY date DESC, id DESC LIMIT 12`
    )
    .all();
  const gallery = db
    .prepare('SELECT id, path, caption FROM gallery ORDER BY sort_order ASC, id ASC LIMIT 24')
    .all();
  const achievements = db
    .prepare('SELECT id, title, body FROM achievements ORDER BY sort_order ASC, id ASC')
    .all();

  res.render('index', { s, news, gallery, achievements });
});

// Окрема сторінка новини (повний текст + фото)
app.get('/news/:id', (req, res) => {
  const id = Number(req.params.id);
  const post = db.prepare(`SELECT * FROM news WHERE id = ? AND status = 'published'`).get(id);
  if (!post) return res.status(404).send('Новину не знайдено');
  post.images = db.prepare('SELECT id, path FROM news_images WHERE news_id = ?').all(id);
  const { html, leftover } = renderArticleBody(post.body, post.images);
  res.render('news', { s: getAllSettings(), post, bodyHtml: html, extraImages: leftover });
});

// Окрема сторінка галереї (усі фото)
app.get('/gallery', (req, res) => {
  const s = getAllSettings();
  const gallery = db
    .prepare('SELECT id, path, caption FROM gallery ORDER BY sort_order ASC, id ASC')
    .all();
  res.render('gallery', { s, gallery });
});

// Адмінпанель (сторінка) — під захистом
app.get('/manager', requireAuthPage, (req, res) => {
  res.render('manager/dashboard', { username: req.session.username });
});

// 404
app.use((req, res) => {
  res.status(404).send('Сторінку не знайдено');
});

// Глобальний обробник помилок
app.use((err, req, res, next) => {
  console.error('Помилка сервера:', err);
  res.status(500).json({ error: 'Внутрішня помилка сервера' });
});

app.listen(PORT, () => {
  console.log(`✅ Сайт працює: http://localhost:${PORT}`);
  console.log(`🔐 Адмінка:     http://localhost:${PORT}/manager`);
});
