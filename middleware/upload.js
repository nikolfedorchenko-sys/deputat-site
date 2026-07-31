'use strict';

/**
 * Завантаження зображень:
 *  1) multer тримає файл у пам'яті (memoryStorage);
 *  2) валідація типу (лише зображення) і розміру (до 8 МБ);
 *  3) sharp автоматично стискає: масштабує до макс. 1600px по ширині
 *     та зберігає як прогресивний JPEG (якість 80).
 *
 * Готові файли складаються у /uploads. Повертається публічний шлях /uploads/<file>.
 */

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const sharp = require('sharp');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

// multer у пам'ять — щоб передати буфер у sharp
const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 МБ
  fileFilter(req, file, cb) {
    if (ALLOWED_MIME.has(file.mimetype)) return cb(null, true);
    cb(new Error('Дозволені лише зображення (JPEG, PNG, WEBP, GIF)'));
  },
});

/**
 * Обробити один буфер зображення через sharp і зберегти у /uploads.
 * @returns {Promise<string>} публічний шлях, напр. /uploads/1699999999-ab12.jpg
 */
async function processImage(buffer) {
  const name = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.jpg`;
  const outPath = path.join(UPLOAD_DIR, name);

  await sharp(buffer)
    .rotate() // враховуємо EXIF-орієнтацію
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80, progressive: true, mozjpeg: true })
    .toFile(outPath);

  return `/uploads/${name}`;
}

/**
 * Видалити файл з /uploads за його публічним шляхом (безпечно, тільки в межах папки).
 */
function removeUpload(publicPath) {
  if (!publicPath || !publicPath.startsWith('/uploads/')) return;
  const filename = path.basename(publicPath); // захист від ../
  const full = path.join(UPLOAD_DIR, filename);
  fs.promises.unlink(full).catch(() => {}); // ігноруємо, якщо файлу вже немає
}

module.exports = {
  UPLOAD_DIR,
  memoryUpload,
  processImage,
  removeUpload,
};
