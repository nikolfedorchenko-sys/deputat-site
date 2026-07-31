'use strict';

/**
 * Публічні маршрути читання (відкриті всім) + приймання звернень з форми.
 * Запис можливий лише через захищене /api/admin/* (див. routes/admin.js).
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const { db, getAllSettings } = require('../db/database');

const router = express.Router();

// ── Читання ────────────────────────────────────────────────────────────────
router.get('/settings', (req, res) => {
  res.json(getAllSettings());
});

router.get('/news', (req, res) => {
  const rows = db
    .prepare(
      `SELECT id, title, date, tag, body, cover_image, created_at
         FROM news WHERE status = 'published'
        ORDER BY date DESC, id DESC`
    )
    .all();
  res.json(rows);
});

router.get('/news/:id', (req, res) => {
  const id = Number(req.params.id);
  const post = db
    .prepare(`SELECT * FROM news WHERE id = ? AND status = 'published'`)
    .get(id);
  if (!post) return res.status(404).json({ error: 'Новину не знайдено' });
  post.images = db
    .prepare('SELECT id, path FROM news_images WHERE news_id = ?')
    .all(id);
  res.json(post);
});

router.get('/gallery', (req, res) => {
  const rows = db
    .prepare('SELECT id, path, caption FROM gallery ORDER BY sort_order ASC, id ASC')
    .all();
  res.json(rows);
});

router.get('/achievements', (req, res) => {
  const rows = db
    .prepare('SELECT id, title, body FROM achievements ORDER BY sort_order ASC, id ASC')
    .all();
  res.json(rows);
});

// ── Звернення з форми приймальні ─────────────────────────────────────────────
// Захист від спаму: rate-limit (5 звернень / 10 хв з IP) + honeypot-поле "website".
const submitLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Забагато звернень. Спробуйте трохи згодом.' },
});

router.post('/submissions', submitLimiter, (req, res) => {
  const { name, contact, subject, message, website } = req.body || {};

  // Honeypot: приховане поле "website" має лишатися порожнім у людини.
  if (website && String(website).trim() !== '') {
    // Вдаємо успіх, але нічого не зберігаємо.
    return res.status(200).json({ ok: true });
  }

  // Валідація вхідних даних на бекенді
  const errors = [];
  const cleanName = String(name || '').trim();
  const cleanContact = String(contact || '').trim();
  const cleanMessage = String(message || '').trim();
  const cleanSubject = String(subject || '').trim().slice(0, 80);

  if (cleanName.length < 2 || cleanName.length > 120) errors.push('Вкажіть ім’я (2–120 символів).');
  if (cleanContact.length < 3 || cleanContact.length > 200) errors.push('Вкажіть контакт (телефон або email).');
  if (cleanMessage.length < 5 || cleanMessage.length > 4000) errors.push('Опишіть звернення (5–4000 символів).');

  if (errors.length) return res.status(400).json({ error: errors.join(' ') });

  db.prepare(
    'INSERT INTO submissions (name, contact, subject, message) VALUES (?, ?, ?, ?)'
  ).run(cleanName, cleanContact, cleanSubject, cleanMessage);

  res.status(201).json({ ok: true });
});

module.exports = router;
