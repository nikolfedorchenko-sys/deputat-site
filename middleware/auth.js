'use strict';

/**
 * Захист маршрутів адмінки.
 * - requireAuthPage: для сторінок /manager — неавторизованого редіректить на форму входу.
 * - requireAuthApi:  для API /api/admin/* — повертає 401 JSON.
 */

function requireAuthPage(req, res, next) {
  if (req.session && req.session.authenticated) return next();
  return res.redirect('/manager/login');
}

function requireAuthApi(req, res, next) {
  if (req.session && req.session.authenticated) return next();
  return res.status(401).json({ error: 'Потрібна авторизація' });
}

module.exports = { requireAuthPage, requireAuthApi };
