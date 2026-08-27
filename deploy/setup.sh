#!/usr/bin/env bash
#
# Автоматичний деплой сайту депутата на чистий Ubuntu (22.04/24.04) VPS.
# Піднімає: Node.js 22, застосунок (systemd), nginx (reverse proxy), HTTPS (Let's Encrypt).
#
# ЗАПУСК (від root на сервері):
#   export DOMAIN="tykhonovych.kyiv.ua"          # твій домен (без https://)
#   export LE_EMAIL="you@example.com"            # email для сертифіката Let's Encrypt
#   export ADMIN_USERNAME="admin"                # логін адмінки /manager
#   export ADMIN_PASSWORD="ЗМІНИ_надійний_пароль"
#   bash setup.sh
#
# Повторний запуск безпечний (оновлює код і перезапускає сервіс).

set -euo pipefail

REPO="https://github.com/nikolfedorchenko-sys/deputat-site.git"
APP_DIR="/var/www/deputat-site"
SERVICE="deputat-site"
PORT="3000"

: "${DOMAIN:?Вкажи DOMAIN, напр. export DOMAIN=tykhonovych.kyiv.ua}"
: "${LE_EMAIL:?Вкажи LE_EMAIL, напр. export LE_EMAIL=you@example.com}"
: "${ADMIN_USERNAME:?Вкажи ADMIN_USERNAME}"
: "${ADMIN_PASSWORD:?Вкажи ADMIN_PASSWORD}"

echo "==> [1/7] Системні пакети"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl git nginx ca-certificates ufw

echo "==> [2/7] Node.js 22 (NodeSource)"
if ! command -v node >/dev/null || [ "$(node -v | cut -d. -f1 | tr -d v)" -lt 22 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
node -v

echo "==> [3/7] Код застосунку"
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" fetch --all && git -C "$APP_DIR" reset --hard origin/main
else
  git clone "$REPO" "$APP_DIR"
fi
cd "$APP_DIR"
npm ci --omit=dev

echo "==> [4/7] .env (секрети)"
if [ ! -f "$APP_DIR/.env" ]; then
  SECRET="$(node -e "console.log(require('crypto').randomBytes(48).toString('hex'))")"
  cat > "$APP_DIR/.env" <<EOF
PORT=$PORT
SESSION_SECRET=$SECRET
ADMIN_USERNAME=$ADMIN_USERNAME
ADMIN_PASSWORD=$ADMIN_PASSWORD
SECURE_COOKIES=1
EOF
  echo "    Створено $APP_DIR/.env"
else
  echo "    .env уже існує — не чіпаю (зміни вручну за потреби)"
fi
# Дані (SQLite + uploads) лежать у $APP_DIR і зберігаються на диску VPS.

echo "==> [5/7] systemd-сервіс"
cat > "/etc/systemd/system/$SERVICE.service" <<EOF
[Unit]
Description=Deputat site (Express)
After=network.target

[Service]
Type=simple
WorkingDirectory=$APP_DIR
ExecStart=$(command -v node) server.js
Restart=always
Environment=NODE_ENV=production
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
EOF
chown -R www-data:www-data "$APP_DIR"
systemctl daemon-reload
systemctl enable "$SERVICE"
systemctl restart "$SERVICE"

echo "==> [6/7] nginx (reverse proxy на :$PORT)"
cat > "/etc/nginx/sites-available/$SERVICE" <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    client_max_body_size 12M;               # щоб проходили завантаження фото

    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
ln -sf "/etc/nginx/sites-available/$SERVICE" "/etc/nginx/sites-enabled/$SERVICE"
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "==> firewall"
ufw allow OpenSSH >/dev/null 2>&1 || true
ufw allow 'Nginx Full' >/dev/null 2>&1 || true
yes | ufw enable >/dev/null 2>&1 || true

echo "==> [7/7] HTTPS (Let's Encrypt)"
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m "$LE_EMAIL" --redirect || \
  echo "    ⚠️ certbot не зміг видати сертифікат — переконайся, що DNS домену вже вказує на цей сервер, і запусти: certbot --nginx -d $DOMAIN -d www.$DOMAIN"

echo ""
echo "✅ Готово. Сайт: https://$DOMAIN   Адмінка: https://$DOMAIN/manager"
echo "   Оновлення в майбутньому: повторний запуск цього скрипта (підтягне свіжий код із GitHub)."
