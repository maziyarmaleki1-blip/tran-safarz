#!/usr/bin/env bash
###############################################################################
#  🚀 Safarz - One-Click Build & Deploy Script
#  -------------------------------------------------------------------------
#  این اسکریپت به صورت خودکار:
#    1. وابستگی‌ها رو با رجیستری ایرانی (npmmirror) نصب می‌کنه
#    2. متغیرهای محیطی رو تنظیم می‌کنه (.env)
#    3. پروژه رو Build می‌کنه
#    4. خروجی رو در یک فایل tar.gz بسته‌بندی می‌کنه
#    5. (اختیاری) روی سرور deploy می‌کنه + Nginx رو تنظیم می‌کنه
#
#  نحوه استفاده:
#    chmod +x build.sh
#    ./build.sh                     # فقط build + بسته‌بندی
#    ./build.sh --deploy            # build + deploy روی همین سرور
#    ./build.sh --deploy --nginx    # build + deploy + تنظیم Nginx
###############################################################################

set -e  # توقف در صورت خطا

# ----- رنگ‌ها برای خروجی زیباتر -----
R='\033[0;31m'; G='\033[0;32m'; Y='\033[1;33m'; B='\033[0;34m'; N='\033[0m'
log()  { echo -e "${B}[$(date +%H:%M:%S)]${N} $1"; }
ok()   { echo -e "${G}✔${N} $1"; }
warn() { echo -e "${Y}⚠${N} $1"; }
err()  { echo -e "${R}✖${N} $1"; exit 1; }

# ----- پیکربندی (در صورت نیاز ویرایش کن) -----
POCKETBASE_URL="${POCKETBASE_URL:-http://185.8.174.236:8090}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/safarz}"
SERVER_NAME="${SERVER_NAME:-_}"   # مثلاً yourdomain.ir
NGINX_PORT="${NGINX_PORT:-80}"
NPM_REGISTRY="${NPM_REGISTRY:-https://registry.npmmirror.com}"
OUTPUT_ARCHIVE="safarz-dist-$(date +%Y%m%d-%H%M%S).tar.gz"

DO_DEPLOY=false
DO_NGINX=false
for arg in "$@"; do
  case $arg in
    --deploy) DO_DEPLOY=true ;;
    --nginx)  DO_NGINX=true ;;
    --help|-h)
      grep '^#' "$0" | head -25
      exit 0 ;;
  esac
done

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║   Safarz - سفر بدون مرز - Build Script           ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

###############################################################################
# مرحله 1: بررسی پیش‌نیازها
###############################################################################
log "بررسی پیش‌نیازها..."

if ! command -v node >/dev/null 2>&1; then
  err "Node.js نصب نیست. ابتدا نصب کن: curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt install -y nodejs"
fi
ok "Node.js نسخه $(node -v) موجود است"

# انتخاب package manager: ترجیح bun، سپس pnpm، سپس npm
if command -v bun >/dev/null 2>&1; then
  PM="bun"
elif command -v pnpm >/dev/null 2>&1; then
  PM="pnpm"
else
  PM="npm"
fi
ok "از $PM استفاده می‌شود"

###############################################################################
# مرحله 2: تنظیم رجیستری ایرانی (برای دور زدن تحریم)
###############################################################################
log "تنظیم رجیستری npm ایرانی (npmmirror)..."
case $PM in
  bun)
    mkdir -p ~/.bun
    echo "[install]" > ~/.bunfig.toml
    echo "registry = \"$NPM_REGISTRY\"" >> ~/.bunfig.toml
    ;;
  *)
    $PM config set registry "$NPM_REGISTRY"
    ;;
esac
ok "رجیستری روی $NPM_REGISTRY تنظیم شد"

###############################################################################
# مرحله 3: ساخت فایل .env
###############################################################################
log "ساخت فایل .env..."
cat > .env <<EOF
VITE_POCKETBASE_URL=$POCKETBASE_URL
EOF
ok ".env ساخته شد با POCKETBASE_URL=$POCKETBASE_URL"

###############################################################################
# مرحله 4: نصب وابستگی‌ها
###############################################################################
log "نصب وابستگی‌ها (ممکنه چند دقیقه طول بکشه)..."
case $PM in
  bun)  bun install ;;
  pnpm) pnpm install ;;
  npm)  npm install --legacy-peer-deps ;;
esac
ok "وابستگی‌ها نصب شدند"

###############################################################################
# مرحله 5: Build کردن پروژه
###############################################################################
log "Build کردن پروژه..."
case $PM in
  bun)  bun run build ;;
  *)    $PM run build ;;
esac

if [ ! -d "dist" ]; then
  err "پوشه dist ساخته نشد. Build ناموفق بود."
fi
ok "Build موفقیت‌آمیز بود. خروجی در پوشه dist/"

###############################################################################
# مرحله 6: بسته‌بندی خروجی به صورت tar.gz
###############################################################################
log "بسته‌بندی خروجی..."
tar -czf "$OUTPUT_ARCHIVE" -C dist .
SIZE=$(du -h "$OUTPUT_ARCHIVE" | cut -f1)
ok "فایل آماده است: $OUTPUT_ARCHIVE ($SIZE)"

###############################################################################
# مرحله 7: Deploy (اختیاری)
###############################################################################
if [ "$DO_DEPLOY" = true ]; then
  log "Deploy روی $DEPLOY_PATH..."
  
  if [ "$EUID" -ne 0 ]; then
    err "برای deploy باید با sudo اجرا کنی: sudo ./build.sh --deploy"
  fi
  
  mkdir -p "$DEPLOY_PATH"
  
  # بکاپ نسخه قبلی
  if [ -f "$DEPLOY_PATH/index.html" ]; then
    BACKUP="$DEPLOY_PATH.backup-$(date +%Y%m%d-%H%M%S)"
    cp -r "$DEPLOY_PATH" "$BACKUP"
    ok "بکاپ نسخه قبلی: $BACKUP"
  fi
  
  rm -rf "$DEPLOY_PATH"/*
  cp -r dist/* "$DEPLOY_PATH/"
  chown -R www-data:www-data "$DEPLOY_PATH" 2>/dev/null || true
  ok "فایل‌ها در $DEPLOY_PATH قرار گرفتند"
fi

###############################################################################
# مرحله 8: تنظیم Nginx (اختیاری)
###############################################################################
if [ "$DO_NGINX" = true ]; then
  log "تنظیم Nginx..."
  
  if ! command -v nginx >/dev/null 2>&1; then
    warn "Nginx نصب نیست. نصب می‌کنم..."
    apt-get update && apt-get install -y nginx
  fi
  
  NGINX_CONF="/etc/nginx/sites-available/safarz"
  cat > "$NGINX_CONF" <<NGINX
server {
    listen $NGINX_PORT;
    server_name $SERVER_NAME;

    root $DEPLOY_PATH;
    index index.html;

    # SPA routing - همه مسیرها به index.html
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Proxy به PocketBase
    location /pb/ {
        proxy_pass $POCKETBASE_URL/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # کش طولانی برای asset ها
    location ~* \.(woff2?|ttf|otf|eot|jpg|jpeg|png|svg|webp|js|css|ico)\$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # فشرده‌سازی gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss image/svg+xml;

    # هدرهای امنیتی
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    client_max_body_size 20M;
}
NGINX
  
  ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/safarz
  rm -f /etc/nginx/sites-enabled/default
  
  nginx -t || err "تنظیمات Nginx معتبر نیست"
  systemctl reload nginx || systemctl restart nginx
  ok "Nginx تنظیم و reload شد"
fi

###############################################################################
# پایان
###############################################################################
echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║              ✅  همه چیز آماده است!              ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "📦 فایل بسته‌بندی شده: $OUTPUT_ARCHIVE"
echo "📁 پوشه خروجی:        ./dist/"
if [ "$DO_DEPLOY" = true ]; then
  echo "🚀 مسیر Deploy:        $DEPLOY_PATH"
fi
if [ "$DO_NGINX" = true ]; then
  echo "🌐 آدرس:               http://$SERVER_NAME:$NGINX_PORT"
fi
echo ""
echo "💡 برای انتقال به سرور دیگه:"
echo "   scp $OUTPUT_ARCHIVE user@server:/tmp/"
echo "   ssh user@server 'sudo mkdir -p $DEPLOY_PATH && sudo tar -xzf /tmp/$OUTPUT_ARCHIVE -C $DEPLOY_PATH'"
echo ""
