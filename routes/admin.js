'use strict';

/**
 * Захищені CRUD-маршрути адмінки. Монтуються у server.js як /api/admin/*
 * ПІД захистом requireAuthApi — тож тут авторизація вже гарантована.
 */

const express = require('express');
const { db } = require('../db/database');
const { memoryUpload, processImage, removeUpload } = require('../middleware/upload');

const router = express.Router();

// Дрібний хелпер, щоб не дублювати try/catch у кожному async-маршруті
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// ─────────────────────────────── SETTINGS ──────────────────────────────────
// Оновлення текстів секцій/контактів: приймаємо об'єкт { key: value, ... }
router.put('/settings', (req, res) => {
  const body = req.body || {};
  const upsert = db.prepare(`
    INSERT INTO settings (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `);
  const tx = db.transaction((entries) => {
    for (const [key, value] of entries) upsert.run(String(key), value == null ? '' : String(value));
  });
  tx(Object.entries(body));
  res.json({ ok: true });
});

// Універсальне завантаження одного зображення (для головного фото, логотипа, og:image).
// Повертає публічний шлях; далі клієнт зберігає його через PUT /settings.
router.post(
  '/upload',
  memoryUpload.single('image'),
  wrap(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Файл не надіслано' });
    const path = await processImage(req.file.buffer);
    res.status(201).json({ path });
  })
);

// ──────────────────────────────── NEWS ─────────────────────────────────────
router.get('/news', (req, res) => {
  const rows = db.prepare('SELECT * FROM news ORDER BY date DESC, id DESC').all();
  res.json(rows);
});

router.get('/news/:id', (req, res) => {
  const post = db.prepare('SELECT * FROM news WHERE id = ?').get(Number(req.params.id));
  if (!post) return res.status(404).json({ error: 'Не знайдено' });
  post.images = db.prepare('SELECT id, path FROM news_images WHERE news_id = ?').all(post.id);
  res.json(post);
});

const newsUpload = memoryUpload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'images', maxCount: 20 },
]);

function validateNews({ title, date }) {
  const errors = [];
  if (!title || String(title).trim().length < 2) errors.push('Вкажіть заголовок.');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(String(date))) errors.push('Вкажіть дату у форматі РРРР-ММ-ДД.');
  return errors;
}

router.post(
  '/news',
  newsUpload,
  wrap(async (req, res) => {
    const { title, date, tag = '', body = '', status = 'draft' } = req.body;
    const errors = validateNews({ title, date });
    if (errors.length) return res.status(400).json({ error: errors.join(' ') });

    let coverPath = '';
    if (req.files?.cover?.[0]) coverPath = await processImage(req.files.cover[0].buffer);

    const info = db
      .prepare(
        `INSERT INTO news (title, date, tag, body, cover_image, status)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(String(title).trim(), date, String(tag).trim(), String(body), status === 'published' ? 'published' : 'draft');

    const newsId = info.lastInsertRowid;

    // Додаткові фото поста
    if (req.files?.images?.length) {
      const insertImg = db.prepare('INSERT INTO news_images (news_id, path) VALUES (?, ?)');
      for (const f of req.files.images) {
        const p = await processImage(f.buffer);
        insertImg.run(newsId, p);
      }
    }

    res.status(201).json({ id: newsId });
  })
);

router.put(
  '/news/:id',
  newsUpload,
  wrap(async (req, res) => {
    const id = Number(req.params.id);
    const existing = db.prepare('SELECT * FROM news WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: 'Не знайдено' });

    const { title, date, tag = '', body = '', status, removeCover } = req.body;
    const errors = validateNews({ title, date });
    if (errors.length) return res.status(400).json({ error: errors.join(' ') });

    let coverPath = existing.cover_image;
    if (String(removeCover) === '1' && coverPath) {
      removeUpload(coverPath);
      coverPath = '';
    }
    if (req.files?.cover?.[0]) {
      if (coverPath) removeUpload(coverPath);
      coverPath = await processImage(req.files.cover[0].buffer);
    }

    db.prepare(
      `UPDATE news SET title = ?, date = ?, tag = ?, body = ?, cover_image = ?, status = ?
        WHERE id = ?`
    ).run(
      String(title).trim(),
      date,
      String(tag).trim(),
      String(body),
      coverPath,
      status === 'published' ? 'published' : 'draft',
      id
    );

    // Додати нові фото до поста
    if (req.files?.images?.length) {
      const insertImg = db.prepare('INSERT INTO news_images (news_id, path) VALUES (?, ?)');
      for (const f of req.files.images) {
        const p = await processImage(f.buffer);
        insertImg.run(id, p);
      }
    }

    res.json({ ok: true });
  })
);

// Видалити окреме фото поста
router.delete('/news/:id/images/:imageId', (req, res) => {
  const img = db.prepare('SELECT * FROM news_images WHERE id = ? AND news_id = ?')
    .get(Number(req.params.imageId), Number(req.params.id));
  if (!img) return res.status(404).json({ error: 'Не знайдено' });
  removeUpload(img.path);
  db.prepare('DELETE FROM news_images WHERE id = ?').run(img.id);
  res.json({ ok: true });
});

router.delete('/news/:id', (req, res) => {
  const id = Number(req.params.id);
  const post = db.prepare('SELECT * FROM news WHERE id = ?').get(id);
  if (!post) return res.status(404).json({ error: 'Не знайдено' });
  // Прибираємо файли: обкладинку + фото поста
  if (post.cover_image) removeUpload(post.cover_image);
  db.prepare('SELECT path FROM news_images WHERE news_id = ?').all(id).forEach((r) => removeUpload(r.path));
  db.prepare('DELETE FROM news WHERE id = ?').run(id); // news_images видаляться каскадом
  res.json({ ok: true });
});

// ─────────────────────────────── GALLERY ───────────────────────────────────
router.get('/gallery', (req, res) => {
  res.json(db.prepare('SELECT id, path, caption, sort_order FROM gallery ORDER BY sort_order ASC, id ASC').all());
});

router.post(
  '/gallery',
  memoryUpload.array('images', 30),
  wrap(async (req, res) => {
    if (!req.files?.length) return res.status(400).json({ error: 'Оберіть хоча б одне зображення' });
    const maxRow = db.prepare('SELECT COALESCE(MAX(sort_order), 0) AS m FROM gallery').get();
    let order = maxRow.m;
    const insert = db.prepare('INSERT INTO gallery (path, caption, sort_order) VALUES (?, ?, ?)');
    const created = [];
    for (const f of req.files) {
      const p = await processImage(f.buffer);
      order += 1;
      const info = insert.run(p, '', order);
      created.push({ id: info.lastInsertRowid, path: p });
    }
    res.status(201).json({ created });
  })
);

router.put('/gallery/reorder', (req, res) => {
  const order = Array.isArray(req.body?.order) ? req.body.order : [];
  const upd = db.prepare('UPDATE gallery SET sort_order = ? WHERE id = ?');
  const tx = db.transaction((ids) => ids.forEach((id, idx) => upd.run(idx + 1, Number(id))));
  tx(order);
  res.json({ ok: true });
});

router.put('/gallery/:id', (req, res) => {
  const caption = String(req.body?.caption ?? '').slice(0, 300);
  const info = db.prepare('UPDATE gallery SET caption = ? WHERE id = ?').run(caption, Number(req.params.id));
  if (!info.changes) return res.status(404).json({ error: 'Не знайдено' });
  res.json({ ok: true });
});

router.delete('/gallery/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM gallery WHERE id = ?').get(Number(req.params.id));
  if (!row) return res.status(404).json({ error: 'Не знайдено' });
  removeUpload(row.path);
  db.prepare('DELETE FROM gallery WHERE id = ?').run(row.id);
  res.json({ ok: true });
});

// ───────────────────────────── ACHIEVEMENTS ────────────────────────────────
router.get('/achievements', (req, res) => {
  res.json(db.prepare('SELECT * FROM achievements ORDER BY sort_order ASC, id ASC').all());
});

router.post('/achievements', (req, res) => {
  const title = String(req.body?.title || '').trim();
  const body = String(req.body?.body || '').trim();
  if (title.length < 2) return res.status(400).json({ error: 'Вкажіть назву картки.' });
  const maxRow = db.prepare('SELECT COALESCE(MAX(sort_order), 0) AS m FROM achievements').get();
  const info = db.prepare('INSERT INTO achievements (title, body, sort_order) VALUES (?, ?, ?)')
    .run(title, body, maxRow.m + 1);
  res.status(201).json({ id: info.lastInsertRowid });
});

router.put('/achievements/:id', (req, res) => {
  const title = String(req.body?.title || '').trim();
  const body = String(req.body?.body || '').trim();
  if (title.length < 2) return res.status(400).json({ error: 'Вкажіть назву картки.' });
  const info = db.prepare('UPDATE achievements SET title = ?, body = ? WHERE id = ?')
    .run(title, body, Number(req.params.id));
  if (!info.changes) return res.status(404).json({ error: 'Не знайдено' });
  res.json({ ok: true });
});

router.put('/achievements/reorder', (req, res) => {
  const order = Array.isArray(req.body?.order) ? req.body.order : [];
  const upd = db.prepare('UPDATE achievements SET sort_order = ? WHERE id = ?');
  const tx = db.transaction((ids) => ids.forEach((id, idx) => upd.run(idx + 1, Number(id))));
  tx(order);
  res.json({ ok: true });
});

router.delete('/achievements/:id', (req, res) => {
  const info = db.prepare('DELETE FROM achievements WHERE id = ?').run(Number(req.params.id));
  if (!info.changes) return res.status(404).json({ error: 'Не знайдено' });
  res.json({ ok: true });
});

// ───────────────────────────── SUBMISSIONS ─────────────────────────────────
router.get('/submissions', (req, res) => {
  res.json(db.prepare('SELECT * FROM submissions ORDER BY processed ASC, created_at DESC').all());
});

router.put('/submissions/:id', (req, res) => {
  const processed = req.body?.processed ? 1 : 0;
  const info = db.prepare('UPDATE submissions SET processed = ? WHERE id = ?')
    .run(processed, Number(req.params.id));
  if (!info.changes) return res.status(404).json({ error: 'Не знайдено' });
  res.json({ ok: true });
});

router.delete('/submissions/:id', (req, res) => {
  const info = db.prepare('DELETE FROM submissions WHERE id = ?').run(Number(req.params.id));
  if (!info.changes) return res.status(404).json({ error: 'Не знайдено' });
  res.json({ ok: true });
});

// ── Обробник помилок цього роутера (multer/валідація/sharp) ──────────────────
router.use((err, req, res, next) => {
  console.error('[admin] помилка:', err.message);
  const status = err.message && err.message.includes('Дозволені лише') ? 400 : 500;
  res.status(status).json({ error: err.message || 'Внутрішня помилка' });
});

module.exports = router;
