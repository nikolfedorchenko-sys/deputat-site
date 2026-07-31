'use strict';

/**
 * Вхід/вихід адміністратора.
 * Логін порівнюється напряму, пароль — через bcrypt.compare з хешем,
 * який обчислюється на старті сервера з ADMIN_PASSWORD (.env).
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Обмеження спроб входу: 10 спроб / 15 хв з однієї IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Забагато спроб входу. Спробуйте пізніше.',
});

// Форма входу
router.get('/login', (req, res) => {
  if (req.session && req.session.authenticated) return res.redirect('/manager');
  res.render('manager/login', { error: null });
});

// Обробка входу
router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body || {};
  const { ADMIN_USERNAME, adminPasswordHash } = req.app.locals;

  const userOk = typeof username === 'string' && username === ADMIN_USERNAME;
  const passOk =
    typeof password === 'string' &&
    (await bcrypt.compare(password, adminPasswordHash).catch(() => false));

  if (userOk && passOk) {
    req.session.authenticated = true;
    req.session.username = username;
    return res.redirect('/manager');
  }

  res.status(401).render('manager/login', { error: 'Невірний логін або пароль' });
});

// Вихід
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/manager/login'));
});

module.exports = router;
