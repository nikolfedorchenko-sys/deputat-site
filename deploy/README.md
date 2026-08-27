# Деплой на власний VPS

Односкриптовий деплой на чистий Ubuntu 22.04/24.04.

## Порядок дій
1. Створити VPS (Hetzner/DigitalOcean), Ubuntu, отримати IP.
2. Купити домен і в DNS створити **A-записи** `@` і `www` → IP сервера.
   Дочекатися, поки домен почне вказувати на сервер (`ping домен` показує IP).
3. Зайти на сервер по SSH і запустити:

```bash
curl -fsSL https://raw.githubusercontent.com/nikolfedorchenko-sys/deputat-site/main/deploy/setup.sh -o setup.sh
export DOMAIN="tykhonovych.kyiv.ua"
export LE_EMAIL="you@example.com"
export ADMIN_USERNAME="admin"
export ADMIN_PASSWORD="надійний_пароль"
bash setup.sh
```

Скрипт підніме Node 22, застосунок (systemd), nginx і HTTPS (Let's Encrypt).

## Оновлення сайту
Після `git push` у `main` — на сервері повторно запустити `bash setup.sh`
(підтягне свіжий код і перезапустить сервіс). Дані (`db/data.sqlite`, `uploads/`)
зберігаються між оновленнями.

## Корисне
- Логи:        `journalctl -u deputat-site -f`
- Перезапуск:  `systemctl restart deputat-site`
- Бекап:       зберігати `db/data.sqlite` та теку `uploads/`
