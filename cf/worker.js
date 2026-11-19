/**
 * Сайт депутата на Cloudflare Workers.
 *
 * Те саме, що server.js (Express), але без сервера:
 *  - статика (public/) віддається Cloudflare напряму (assets);
 *  - дані — у D1 (SQLite у Cloudflare), прив'язка env.DB;
 *  - завантажені фото — у KV, прив'язка env.UPLOADS, віддаються як /uploads/<файл>;
 *  - сторінки рендеряться з тих самих EJS-шаблонів (попередньо скомпільованих
 *    у cf/templates.js, див. scripts/build-templates.mjs);
 *  - адмінка /manager: логін/хеш пароля і секрет сесій лежать у таблиці auth (D1).
 */
import { templates } from './templates.js';
import { SCHEMA, SEED, ADMIN_USERNAME, ADMIN_PASSWORD_HASH } from './seed.js';

// ───────────────────────────── Хелпери шаблонів ─────────────────────────────
function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
const helpers = {
  esc: escapeHtml,
  nl2br: (str) => escapeHtml(str).replace(/\r?\n/g, '<br>'),
  paragraphs: (str) => String(str || '').replace(/\r\n/g, '\n').split(/\n{2,}/)
    .map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`).join(''),
  stripPhotoTokens: (str) => String(str || '').replace(/\[\s*(?:фото|photo)\s*\d+\s*\]/gi, ' '),
};

// Робить http(s)-посилання в (уже екранованому) тексті клікабельними
const linkify = (escaped) => escaped.replace(/https?:\/\/[^\s<]+[^\s<.,;:!?)»”"']/g,
  (u) => `<a href="${u}" target="_blank" rel="noopener">${u}</a>`);
const PHOTO_TOKEN = /^\[\s*(?:фото|photo)\s*(\d+)\s*\]$/i;
function renderArticleBody(body, images) {
  const imgs = Array.isArray(images) ? images : [];
  const used = new Set();
  const html = String(body || '').replace(/\r\n/g, '\n').split(/\n{2,}/).map((block) => {
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
    return `<p>${linkify(escapeHtml(t)).replace(/\r?\n/g, '<br>')}</p>`;
  }).join('\n');
  return { html, leftover: imgs.filter((_, i) => !used.has(i)) };
}

// ───────────────────────────── Відповіді ────────────────────────────────────
const SECURITY_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
    "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net data:",
    "script-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "frame-src 'self' https://www.google.com https://maps.google.com https://www.openstreetmap.org",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'SAMEORIGIN',
  'Strict-Transport-Security': 'max-age=15552000; includeSubDomains',
  // Позначка версії: видно, чи опублікувалася остання збірка
  'X-Site-Version': '2026-11-19.1',
};

function html(body, status = 200, extra = {}) {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...SECURITY_HEADERS, ...extra },
  });
}
function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...SECURITY_HEADERS, ...extra },
  });
}
function redirect(location, extra = {}) {
  return new Response(null, { status: 303, headers: { Location: location, ...extra } });
}
function render(name, data, status = 200, extra = {}) {
  return html(templates[name]({ ...helpers, ...data }), status, extra);
}
class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

// ───────────────────────────── База даних ───────────────────────────────────
const all = async (db, sql, ...p) => (await db.prepare(sql).bind(...p).all()).results;
const first = (db, sql, ...p) => db.prepare(sql).bind(...p).first();
const run = (db, sql, ...p) => db.prepare(sql).bind(...p).run();

async function getAllSettings(db) {
  const rows = await all(db, 'SELECT key, value FROM settings');
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}
async function getAuth(db, key) {
  const row = await first(db, 'SELECT value FROM auth WHERE key = ?', key);
  return row ? row.value : null;
}

// ───────────────────────────── Крипто / сесії ───────────────────────────────
const enc = new TextEncoder();
const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)))
  .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64 = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
async function hmac(secret, data) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}
// Формат хеша: pbkdf2$<ітерації>$<сіль base64>$<хеш base64> (SHA-256, 32 байти)
async function verifyPassword(password, stored) {
  const [alg, iter, salt, hash] = String(stored || '').split('$');
  if (alg !== 'pbkdf2') return false;
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: fromB64(salt), iterations: Number(iter) }, key, 256);
  return timingSafeEqual(btoa(String.fromCharCode(...new Uint8Array(bits))), hash);
}

const SESSION_COOKIE = 'dsid';
const SESSION_TTL = 8 * 60 * 60; // 8 годин

function getCookie(request, name) {
  const header = request.headers.get('Cookie') || '';
  for (const part of header.split(/;\s*/)) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i) === name) return part.slice(i + 1);
  }
  return null;
}
async function createSession(db, username) {
  const secret = await getAuth(db, 'session_secret');
  const payload = b64url(enc.encode(JSON.stringify({ u: username, exp: Math.floor(Date.now() / 1000) + SESSION_TTL })));
  const sig = await hmac(secret, payload);
  return `${SESSION_COOKIE}=${payload}.${sig}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_TTL}`;
}
async function readSession(request, db) {
  const raw = getCookie(request, SESSION_COOKIE);
  if (!raw || !raw.includes('.')) return null;
  const [payload, sig] = raw.split('.');
  const secret = await getAuth(db, 'session_secret');
  if (!secret || !timingSafeEqual(await hmac(secret, payload), sig)) return null;
  try {
    const data = JSON.parse(new TextDecoder().decode(fromB64(payload)));
    if (!data.exp || data.exp < Date.now() / 1000) return null;
    return data;
  } catch { return null; }
}
const clearSessionCookie = `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

// ───────────────────────────── Обмеження частоти ────────────────────────────
async function tooMany(db, kind, ip, windowSec, max) {
  const since = Math.floor(Date.now() / 1000) - windowSec;
  const row = await first(db, 'SELECT COUNT(*) AS c FROM rate_events WHERE kind = ? AND ip = ? AND ts > ?', kind, ip, since);
  return row.c >= max;
}
async function hit(db, kind, ip) {
  const now = Math.floor(Date.now() / 1000);
  await db.batch([
    db.prepare('INSERT INTO rate_events (kind, ip, ts) VALUES (?, ?, ?)').bind(kind, ip, now),
    db.prepare('DELETE FROM rate_events WHERE ts < ?').bind(now - 86400),
  ]);
}

// ───────────────────────────── Завантаження фото ────────────────────────────
const ALLOWED_MIME = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
const MAX_UPLOAD = 8 * 1024 * 1024;

const isFile = (v) => v && typeof v === 'object' && typeof v.arrayBuffer === 'function';

async function saveUpload(env, file) {
  const ext = ALLOWED_MIME[file.type];
  if (!ext) throw new HttpError(400, 'Дозволені лише зображення (JPEG, PNG, WEBP, GIF)');
  if (file.size > MAX_UPLOAD) throw new HttpError(400, 'Файл завеликий (максимум 8 МБ)');
  const rnd = b64url(crypto.getRandomValues(new Uint8Array(6))).replace(/[-_]/g, 'x');
  const name = `${Date.now()}-${rnd}.${ext}`;
  await env.UPLOADS.put(name, await file.arrayBuffer(), { metadata: { type: file.type } });
  return `/uploads/${name}`;
}
async function removeUpload(env, publicPath) {
  if (!publicPath || !publicPath.startsWith('/uploads/')) return;
  const name = publicPath.slice('/uploads/'.length);
  if (!/^[\w.-]+$/.test(name)) return;
  await env.UPLOADS.delete(name).catch(() => {});
}

async function readBody(request) {
  const type = request.headers.get('Content-Type') || '';
  if (type.includes('application/json')) return request.json().catch(() => ({}));
  if (type.includes('multipart/form-data') || type.includes('application/x-www-form-urlencoded')) {
    const fd = await request.formData();
    const obj = { _fd: fd };
    for (const [k, v] of fd.entries()) if (!isFile(v)) obj[k] = v;
    return obj;
  }
  return {};
}
const filesOf = (body, field) => (body._fd ? body._fd.getAll(field).filter((f) => isFile(f) && f.size > 0) : []);

// ───────────────────────────── Публічні сторінки ────────────────────────────
async function pageHome(env) {
  const db = env.DB;
  const [s, news, gallery, achievements] = await Promise.all([
    getAllSettings(db),
    all(db, `SELECT id, title, date, tag, body, cover_image FROM news
              WHERE status = 'published' ORDER BY date DESC, id DESC LIMIT 12`),
    all(db, 'SELECT id, path, caption FROM gallery ORDER BY sort_order ASC, id ASC LIMIT 24'),
    all(db, 'SELECT id, title, body FROM achievements ORDER BY sort_order ASC, id ASC'),
  ]);
  return render('index', { s, news, gallery, achievements });
}

async function pageNews(env, id) {
  const db = env.DB;
  const post = await first(db, `SELECT * FROM news WHERE id = ? AND status = 'published'`, id);
  if (!post) return html('Новину не знайдено', 404);
  post.images = await all(db, 'SELECT id, path FROM news_images WHERE news_id = ?', id);
  const { html: bodyHtml, leftover } = renderArticleBody(post.body, post.images);
  return render('news', { s: await getAllSettings(db), post, bodyHtml, extraImages: leftover });
}

// ───────────────────────────── Публічне API ─────────────────────────────────
async function publicApi(request, env, path, ip) {
  const db = env.DB;
  const m = request.method;
  if (m === 'GET' && path === '/api/settings') return json(await getAllSettings(db));
  if (m === 'GET' && path === '/api/news') {
    return json(await all(db, `SELECT id, title, date, tag, body, cover_image, created_at
      FROM news WHERE status = 'published' ORDER BY date DESC, id DESC`));
  }
  let mm;
  if (m === 'GET' && (mm = path.match(/^\/api\/news\/(\d+)$/))) {
    const post = await first(db, `SELECT * FROM news WHERE id = ? AND status = 'published'`, Number(mm[1]));
    if (!post) return json({ error: 'Новину не знайдено' }, 404);
    post.images = await all(db, 'SELECT id, path FROM news_images WHERE news_id = ?', post.id);
    return json(post);
  }
  if (m === 'GET' && path === '/api/gallery') {
    return json(await all(db, 'SELECT id, path, caption FROM gallery ORDER BY sort_order ASC, id ASC'));
  }
  if (m === 'GET' && path === '/api/achievements') {
    return json(await all(db, 'SELECT id, title, body FROM achievements ORDER BY sort_order ASC, id ASC'));
  }
  if (m === 'POST' && path === '/api/submissions') {
    const { name, contact, subject, message, website } = await readBody(request);
    if (website && String(website).trim() !== '') return json({ ok: true }); // honeypot
    if (await tooMany(db, 'submit', ip, 600, 5)) return json({ error: 'Забагато звернень. Спробуйте трохи згодом.' }, 429);
    const cleanName = String(name || '').trim();
    const cleanContact = String(contact || '').trim();
    const cleanMessage = String(message || '').trim();
    const cleanSubject = String(subject || '').trim().slice(0, 80);
    const errors = [];
    if (cleanName.length < 2 || cleanName.length > 120) errors.push('Вкажіть ім’я (2–120 символів).');
    if (cleanContact.length < 3 || cleanContact.length > 200) errors.push('Вкажіть контакт (телефон або email).');
    if (cleanMessage.length < 5 || cleanMessage.length > 4000) errors.push('Опишіть звернення (5–4000 символів).');
    if (errors.length) return json({ error: errors.join(' ') }, 400);
    await run(db, 'INSERT INTO submissions (name, contact, subject, message) VALUES (?, ?, ?, ?)',
      cleanName, cleanContact, cleanSubject, cleanMessage);
    await hit(db, 'submit', ip);
    return json({ ok: true }, 201);
  }
  return null;
}

// ───────────────────────────── Адмін API ────────────────────────────────────
function validateNews({ title, date }) {
  const errors = [];
  if (!title || String(title).trim().length < 2) errors.push('Вкажіть заголовок.');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(String(date))) errors.push('Вкажіть дату у форматі РРРР-ММ-ДД.');
  return errors;
}

async function adminApi(request, env, path) {
  const db = env.DB;
  const m = request.method;
  let mm;

  // SETTINGS
  if (m === 'PUT' && path === '/api/admin/settings') {
    const body = await readBody(request);
    const stmts = Object.entries(body).filter(([k]) => k !== '_fd').map(([k, v]) => db.prepare(
      'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
    ).bind(String(k), v == null ? '' : String(v)));
    if (stmts.length) await db.batch(stmts);
    return json({ ok: true });
  }
  if (m === 'POST' && path === '/api/admin/upload') {
    const body = await readBody(request);
    const [file] = filesOf(body, 'image');
    if (!file) return json({ error: 'Файл не надіслано' }, 400);
    return json({ path: await saveUpload(env, file) }, 201);
  }

  // NEWS
  if (m === 'GET' && path === '/api/admin/news') {
    return json(await all(db, 'SELECT * FROM news ORDER BY date DESC, id DESC'));
  }
  if (m === 'GET' && (mm = path.match(/^\/api\/admin\/news\/(\d+)$/))) {
    const post = await first(db, 'SELECT * FROM news WHERE id = ?', Number(mm[1]));
    if (!post) return json({ error: 'Не знайдено' }, 404);
    post.images = await all(db, 'SELECT id, path FROM news_images WHERE news_id = ?', post.id);
    return json(post);
  }
  if (m === 'POST' && path === '/api/admin/news') {
    const body = await readBody(request);
    const { title, date, tag = '', status = 'draft' } = body;
    const text = body.body == null ? '' : body.body;
    const errors = validateNews({ title, date });
    if (errors.length) return json({ error: errors.join(' ') }, 400);
    const [cover] = filesOf(body, 'cover');
    const coverPath = cover ? await saveUpload(env, cover) : '';
    const info = await run(db,
      'INSERT INTO news (title, date, tag, body, cover_image, status) VALUES (?, ?, ?, ?, ?, ?)',
      String(title).trim(), date, String(tag).trim(), String(text), coverPath,
      status === 'published' ? 'published' : 'draft');
    const newsId = info.meta.last_row_id;
    for (const f of filesOf(body, 'images').slice(0, 20)) {
      await run(db, 'INSERT INTO news_images (news_id, path) VALUES (?, ?)', newsId, await saveUpload(env, f));
    }
    return json({ id: newsId }, 201);
  }
  if (m === 'PUT' && (mm = path.match(/^\/api\/admin\/news\/(\d+)$/))) {
    const id = Number(mm[1]);
    const existing = await first(db, 'SELECT * FROM news WHERE id = ?', id);
    if (!existing) return json({ error: 'Не знайдено' }, 404);
    const body = await readBody(request);
    const { title, date, tag = '', status, removeCover } = body;
    const text = body.body == null ? '' : body.body;
    const errors = validateNews({ title, date });
    if (errors.length) return json({ error: errors.join(' ') }, 400);
    let coverPath = existing.cover_image;
    if (String(removeCover) === '1' && coverPath) { await removeUpload(env, coverPath); coverPath = ''; }
    const [cover] = filesOf(body, 'cover');
    if (cover) { if (coverPath) await removeUpload(env, coverPath); coverPath = await saveUpload(env, cover); }
    await run(db, 'UPDATE news SET title = ?, date = ?, tag = ?, body = ?, cover_image = ?, status = ? WHERE id = ?',
      String(title).trim(), date, String(tag).trim(), String(text), coverPath,
      status === 'published' ? 'published' : 'draft', id);
    for (const f of filesOf(body, 'images').slice(0, 20)) {
      await run(db, 'INSERT INTO news_images (news_id, path) VALUES (?, ?)', id, await saveUpload(env, f));
    }
    return json({ ok: true });
  }
  if (m === 'DELETE' && (mm = path.match(/^\/api\/admin\/news\/(\d+)\/images\/(\d+)$/))) {
    const img = await first(db, 'SELECT * FROM news_images WHERE id = ? AND news_id = ?', Number(mm[2]), Number(mm[1]));
    if (!img) return json({ error: 'Не знайдено' }, 404);
    await removeUpload(env, img.path);
    await run(db, 'DELETE FROM news_images WHERE id = ?', img.id);
    return json({ ok: true });
  }
  if (m === 'DELETE' && (mm = path.match(/^\/api\/admin\/news\/(\d+)$/))) {
    const id = Number(mm[1]);
    const post = await first(db, 'SELECT * FROM news WHERE id = ?', id);
    if (!post) return json({ error: 'Не знайдено' }, 404);
    if (post.cover_image) await removeUpload(env, post.cover_image);
    for (const r of await all(db, 'SELECT path FROM news_images WHERE news_id = ?', id)) await removeUpload(env, r.path);
    await db.batch([
      db.prepare('DELETE FROM news_images WHERE news_id = ?').bind(id),
      db.prepare('DELETE FROM news WHERE id = ?').bind(id),
    ]);
    return json({ ok: true });
  }

  // GALLERY
  if (m === 'GET' && path === '/api/admin/gallery') {
    return json(await all(db, 'SELECT id, path, caption, sort_order FROM gallery ORDER BY sort_order ASC, id ASC'));
  }
  if (m === 'POST' && path === '/api/admin/gallery') {
    const body = await readBody(request);
    const files = filesOf(body, 'images').slice(0, 30);
    if (!files.length) return json({ error: 'Оберіть хоча б одне зображення' }, 400);
    let order = (await first(db, 'SELECT COALESCE(MAX(sort_order), 0) AS m FROM gallery')).m;
    const created = [];
    for (const f of files) {
      const p = await saveUpload(env, f);
      order += 1;
      const info = await run(db, 'INSERT INTO gallery (path, caption, sort_order) VALUES (?, ?, ?)', p, '', order);
      created.push({ id: info.meta.last_row_id, path: p });
    }
    return json({ created }, 201);
  }
  for (const table of ['gallery', 'achievements']) {
    if (m === 'PUT' && path === `/api/admin/${table}/reorder`) {
      const body = await readBody(request);
      const order = Array.isArray(body.order) ? body.order : [];
      if (order.length) {
        await db.batch(order.map((id, idx) =>
          db.prepare(`UPDATE ${table} SET sort_order = ? WHERE id = ?`).bind(idx + 1, Number(id))));
      }
      return json({ ok: true });
    }
  }
  if (m === 'PUT' && (mm = path.match(/^\/api\/admin\/gallery\/(\d+)$/))) {
    const body = await readBody(request);
    const caption = String(body.caption ?? '').slice(0, 300);
    const info = await run(db, 'UPDATE gallery SET caption = ? WHERE id = ?', caption, Number(mm[1]));
    if (!info.meta.changes) return json({ error: 'Не знайдено' }, 404);
    return json({ ok: true });
  }
  if (m === 'DELETE' && (mm = path.match(/^\/api\/admin\/gallery\/(\d+)$/))) {
    const row = await first(db, 'SELECT * FROM gallery WHERE id = ?', Number(mm[1]));
    if (!row) return json({ error: 'Не знайдено' }, 404);
    await removeUpload(env, row.path);
    await run(db, 'DELETE FROM gallery WHERE id = ?', row.id);
    return json({ ok: true });
  }

  // ACHIEVEMENTS
  if (m === 'GET' && path === '/api/admin/achievements') {
    return json(await all(db, 'SELECT * FROM achievements ORDER BY sort_order ASC, id ASC'));
  }
  if (m === 'POST' && path === '/api/admin/achievements') {
    const body = await readBody(request);
    const title = String(body.title || '').trim();
    const text = String(body.body || '').trim();
    if (title.length < 2) return json({ error: 'Вкажіть назву картки.' }, 400);
    const max = (await first(db, 'SELECT COALESCE(MAX(sort_order), 0) AS m FROM achievements')).m;
    const info = await run(db, 'INSERT INTO achievements (title, body, sort_order) VALUES (?, ?, ?)', title, text, max + 1);
    return json({ id: info.meta.last_row_id }, 201);
  }
  if (m === 'PUT' && (mm = path.match(/^\/api\/admin\/achievements\/(\d+)$/))) {
    const body = await readBody(request);
    const title = String(body.title || '').trim();
    const text = String(body.body || '').trim();
    if (title.length < 2) return json({ error: 'Вкажіть назву картки.' }, 400);
    const info = await run(db, 'UPDATE achievements SET title = ?, body = ? WHERE id = ?', title, text, Number(mm[1]));
    if (!info.meta.changes) return json({ error: 'Не знайдено' }, 404);
    return json({ ok: true });
  }
  if (m === 'DELETE' && (mm = path.match(/^\/api\/admin\/achievements\/(\d+)$/))) {
    const info = await run(db, 'DELETE FROM achievements WHERE id = ?', Number(mm[1]));
    if (!info.meta.changes) return json({ error: 'Не знайдено' }, 404);
    return json({ ok: true });
  }

  // SUBMISSIONS
  if (m === 'GET' && path === '/api/admin/submissions') {
    return json(await all(db, 'SELECT * FROM submissions ORDER BY processed ASC, created_at DESC'));
  }
  if (m === 'PUT' && (mm = path.match(/^\/api\/admin\/submissions\/(\d+)$/))) {
    const body = await readBody(request);
    const info = await run(db, 'UPDATE submissions SET processed = ? WHERE id = ?', body.processed ? 1 : 0, Number(mm[1]));
    if (!info.meta.changes) return json({ error: 'Не знайдено' }, 404);
    return json({ ok: true });
  }
  if (m === 'DELETE' && (mm = path.match(/^\/api\/admin\/submissions\/(\d+)$/))) {
    const info = await run(db, 'DELETE FROM submissions WHERE id = ?', Number(mm[1]));
    if (!info.meta.changes) return json({ error: 'Не знайдено' }, 404);
    return json({ ok: true });
  }

  return json({ error: 'Не знайдено' }, 404);
}

// ───────────────────────────── Ініціалізація БД ─────────────────────────────
// При першому запуску (порожня D1) створюємо таблиці, стартовий контент,
// логін адміна і випадковий секрет сесій. Повторно — лише дешева перевірка.
let dbReady = null;
async function ensureDb(db) {
  const has = await db.prepare("SELECT value FROM auth WHERE key = 'session_secret'").first().catch(() => null);
  if (has) return;
  await db.batch(SCHEMA.map((sql) => db.prepare(sql)));
  const empty = !(await db.prepare('SELECT 1 FROM settings LIMIT 1').first());
  const stmts = [];
  if (empty) for (const [sql, params] of SEED) stmts.push(db.prepare(sql).bind(...params));
  const secret = b64url(crypto.getRandomValues(new Uint8Array(48)));
  stmts.push(
    db.prepare('INSERT OR IGNORE INTO auth (key, value) VALUES (?, ?)').bind('admin_username', ADMIN_USERNAME),
    db.prepare('INSERT OR IGNORE INTO auth (key, value) VALUES (?, ?)').bind('admin_password_hash', ADMIN_PASSWORD_HASH),
    db.prepare('INSERT OR IGNORE INTO auth (key, value) VALUES (?, ?)').bind('session_secret', secret),
  );
  await db.batch(stmts);
}

// ───────────────────────────── Головний обробник ────────────────────────────
async function handle(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const m = request.method;
  const ip = request.headers.get('CF-Connecting-IP') || '0.0.0.0';
  const db = env.DB;

  // Канонічний домен: www → без www
  if (url.hostname.startsWith('www.')) {
    url.hostname = url.hostname.slice(4);
    return Response.redirect(url.toString(), 301);
  }

  // Завантажені фото з KV
  if (m === 'GET' && path.startsWith('/uploads/')) {
    const name = path.slice('/uploads/'.length);
    if (!/^[\w.-]+$/.test(name)) return new Response('Not found', { status: 404 });
    const { value, metadata } = await env.UPLOADS.getWithMetadata(name, { type: 'arrayBuffer' });
    if (!value) return new Response('Not found', { status: 404 });
    return new Response(value, {
      headers: {
        'Content-Type': (metadata && metadata.type) || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }

  // Публічні сторінки
  if (m === 'GET' || m === 'HEAD') {
    if (path === '/') return pageHome(env);
    const nm = path.match(/^\/news\/(\d+)$/);
    if (nm) return pageNews(env, Number(nm[1]));
    if (path === '/report') return render('report', { s: await getAllSettings(db) });
    if (path === '/army') return render('army', { s: await getAllSettings(db) });
    if (path === '/news') {
      const [s, news] = await Promise.all([
        getAllSettings(db),
        all(db, `SELECT id, title, date, tag, body, cover_image FROM news
                  WHERE status = 'published' ORDER BY date DESC, id DESC`),
      ]);
      return render('news-list', { s, news });
    }
    // Галерею прибрано: старі посилання ведуть на головну
    if (path === '/gallery') return Response.redirect(new URL('/', request.url).toString(), 301);
  }

  // Адмінка: вхід / вихід / сторінка
  const noindex = { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' };
  if (path === '/manager/login') {
    if (m === 'GET') {
      if (await readSession(request, db)) return redirect('/manager');
      return render('manager/login', { error: null }, 200, noindex);
    }
    if (m === 'POST') {
      if (await tooMany(db, 'login', ip, 900, 10)) {
        return render('manager/login', { error: 'Забагато спроб входу. Спробуйте пізніше.' }, 429, noindex);
      }
      const { username, password } = await readBody(request);
      const [adminUser, adminHash] = await Promise.all([getAuth(db, 'admin_username'), getAuth(db, 'admin_password_hash')]);
      const userOk = typeof username === 'string' && !!adminUser && username === adminUser;
      const passOk = typeof password === 'string' && (await verifyPassword(password, adminHash).catch(() => false));
      if (userOk && passOk) return redirect('/manager', { 'Set-Cookie': await createSession(db, username) });
      await hit(db, 'login', ip);
      return render('manager/login', { error: 'Невірний логін або пароль' }, 401, noindex);
    }
  }
  if (path === '/manager/logout' && m === 'POST') {
    return redirect('/manager/login', { 'Set-Cookie': clearSessionCookie });
  }
  if (path === '/manager' && m === 'GET') {
    const session = await readSession(request, db);
    if (!session) return redirect('/manager/login');
    return render('manager/dashboard', { username: session.u }, 200, noindex);
  }

  // API
  if (path.startsWith('/api/admin/') || path === '/api/admin') {
    if (!(await readSession(request, db))) return json({ error: 'Потрібна авторизація' }, 401);
    return adminApi(request, env, path);
  }
  if (path.startsWith('/api/')) {
    const res = await publicApi(request, env, path, ip);
    if (res) return res;
    return json({ error: 'Не знайдено' }, 404);
  }

  return html('Сторінку не знайдено', 404);
}

export default {
  async fetch(request, env) {
    try {
      if (!dbReady) dbReady = ensureDb(env.DB).catch((e) => { dbReady = null; throw e; });
      await dbReady;
      return await handle(request, env);
    } catch (err) {
      if (err instanceof HttpError) return json({ error: err.message }, err.status);
      console.error('Помилка сервера:', err && err.stack ? err.stack : err);
      return json({ error: 'Внутрішня помилка сервера' }, 500);
    }
  },
};
