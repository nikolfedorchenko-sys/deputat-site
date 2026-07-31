# HANDOFF — стан проєкту (для продовження на іншому ПК / у новій сесії)

## Що це
`deputat-site` — односторінковий сайт-лендінг депутата Київради **Тихоновича Юрія
Станіславовича** + адмінка контенту `/manager`. Дизайн — hi-fi індиго/ціан (e-Ukraine).

## Де що
- **Живий сайт:** https://deputat-site.onrender.com (адмінка — `/manager`)
- **Репозиторій:** https://github.com/nikolfedorchenko-sys/deputat-site (гілка `main`)
- **Хостинг:** Render (free), blueprint `render.yaml`, автодеплой при кожному `git push` у `main`.
  Node зафіксовано на **22** (`.nvmrc` + `engines` + `NODE_VERSION`). Сесії — `better-sqlite3-session-store`.

## Запуск локально
1. Встановити **Node.js 22** і **git**.
2. `git clone https://github.com/nikolfedorchenko-sys/deputat-site.git`
3. `cd deputat-site` → `npm install`
4. `copy .env.example .env` (Windows) і вписати `SESSION_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`.
   Секрет: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
5. `npm start` → http://localhost:3000 (адмінка `/manager`).

> ⚠️ `.env` навмисно НЕ в git (містить пароль). На кожному ПК створюється заново.
> На Render змінні задані окремо в дашборді — локальний `.env` на прод не впливає.

## Архітектура (важливо для правок)
- Express + EJS (SSR) + SQLite (`better-sqlite3`) + multer/sharp.
- Контент секцій — з таблиць `settings` та `achievements`, які **сідяться у `db/database.js`**.
- Блок «Освіта та кар'єра» (таймлайн) і секція «Підтримка Захисників» — **захардкоджені у
  `views/index.ejs`**.
- **Диск Render безкоштовний ефемерний** → правки через `/manager` скидаються при рестарті.
  Тому реальний контент тримаємо **в коді** (seed + hardcode), а не через адмінку.

## Джерела даних (наповнення)
- Офіційний профіль: `old.kmr.gov.ua/uk/users/tykhonovychyurii`
  (кодування cp1251; фетчиться лише з браузерним User-Agent — WebFetch дає 403).
- Звіт депутата за 2025 рік (PDF, minio.kyivcity.gov.ua; текст брати через PyMuPDF/fitz).
- Використані цифри в «Результати роботи»: 2287 осіб / 7 975 553 грн допомоги; 95 рішень
  (підрахунок зі списку профілю); 352 звернення; 17 млн грн на школи/садки.

## Відкриті питання / TODO
- [ ] «95 рішень» — це наш підрахунок зі списку профілю (не офіційно заявлена цифра).
      Вирішити: лишити 95 чи замінити на офіційну зі звіту (21 проєкт рішення 2025).
- [ ] Секція «Підтримка Захисників» — зараз текстові картки; додати реальні фото передач.
- [ ] Наповнити реальними новинами (через `/manager` або seed).
- [ ] Перед показом виборцям прибрати «засинання» Render (keep-alive або платний план ~$7/міс).
- [ ] За потреби — постійне збереження правок `/manager` (Firebase + Cloudinary), бо диск ефемерний.
- [ ] У репозиторії `kmb-tracker` лишилася стара копія-дубль `deputat-site/` — за бажанням прибрати.
