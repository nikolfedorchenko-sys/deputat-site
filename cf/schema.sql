-- Схема D1 (Cloudflare) для сайту депутата. Ідемпотентна.
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL DEFAULT '');
CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, date TEXT NOT NULL,
  tag TEXT DEFAULT '', body TEXT NOT NULL DEFAULT '', cover_image TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft', created_at TEXT NOT NULL DEFAULT (datetime('now')));
CREATE TABLE IF NOT EXISTS news_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT, news_id INTEGER NOT NULL, path TEXT NOT NULL,
  FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS gallery (
  id INTEGER PRIMARY KEY AUTOINCREMENT, path TEXT NOT NULL, caption TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, body TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, contact TEXT NOT NULL,
  subject TEXT DEFAULT '', message TEXT NOT NULL, processed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')));
-- Службові дані (НЕ віддаються публічним API): логін/хеш пароля адміна, секрет сесій
CREATE TABLE IF NOT EXISTS auth (key TEXT PRIMARY KEY, value TEXT NOT NULL);
-- Лічильник подій для обмеження частоти (вхід, звернення)
CREATE TABLE IF NOT EXISTS rate_events (kind TEXT NOT NULL, ip TEXT NOT NULL, ts INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS idx_rate ON rate_events(kind, ip, ts);
