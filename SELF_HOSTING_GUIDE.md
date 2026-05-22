# 🇮🇷 راهنمای کامل اجرای پروژه روی سرور شخصی (Self-Hosting)

این راهنما برای کاربرانیه که به دلیل تحریم یا فیلترینگ، نمی‌تونن از سرویس‌های ابری خارجی (Lovable Cloud, Supabase, Vercel, Netlify) استفاده کنن و می‌خوان پروژه رو **۱۰۰٪ روی سرور شخصی** اجرا کنن.

---

## 🎯 معماری نهایی (همه چیز روی سرور خودت)

```
┌──────────────────────────────────────────────┐
│        سرور شخصی شما (مثلاً 185.8.174.236)   │
│                                              │
│  ┌────────────┐    ┌──────────────────────┐ │
│  │  Nginx     │───▶│ React Build (Static) │ │
│  │  (Port 80) │    │  /var/www/safarz     │ │
│  └────────────┘    └──────────────────────┘ │
│         │                                    │
│         └─────────▶ ┌──────────────────┐    │
│                     │ PocketBase :8090 │    │
│                     │ (DB + Auth + API)│    │
│                     └──────────────────┘    │
└──────────────────────────────────────────────┘
```

**هیچ وابستگی به سرور خارجی در زمان اجرا وجود نداره.** فقط برای نصب اولیه پکیج‌ها نیاز به دسترسی موقت داری (یا از رجیستری ایرانی استفاده کن).

---

## 📋 پیش‌نیازها روی سرور

- Ubuntu 22.04 یا Debian 12
- Node.js 20+ و bun یا npm
- Nginx
- PocketBase (دانلود از https://pocketbase.io/docs/)

---

## 🚀 مرحله ۱: نصب پکیج‌ها بدون نیاز به VPN

### استفاده از رجیستری npm ایرانی

```bash
# تنظیم رجیستری ایرانی (npmmirror چینی - بسیار سریع و قابل دسترس)
npm config set registry https://registry.npmmirror.com

# یا اگر bun استفاده می‌کنی:
echo 'registry = "https://registry.npmmirror.com"' > ~/.bunfig.toml

# نصب وابستگی‌ها
bun install
# یا
npm install
```

اگر رجیستری بالا کار نکرد، گزینه‌های جایگزین:
- `https://registry.npmjs.org` (با VPN)
- `https://npm.uupt.ir` (رجیستری ایرانی - ممکنه گاهی Down باشه)

---

## 🗄️ مرحله ۲: راه‌اندازی PocketBase روی سرور

```bash
# دانلود PocketBase (با VPN یا proxy یک بار)
cd /opt
wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.0/pocketbase_0.22.0_linux_amd64.zip
unzip pocketbase_0.22.0_linux_amd64.zip
chmod +x pocketbase

# اجرا
./pocketbase serve --http=0.0.0.0:8090
```

### اجرای دائمی با systemd

فایل `/etc/systemd/system/pocketbase.service`:

```ini
[Unit]
Description=PocketBase
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/pocketbase
ExecStart=/opt/pocketbase/pocketbase serve --http=0.0.0.0:8090
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
systemctl enable --now pocketbase
systemctl status pocketbase
```

### ساخت کالکشن‌ها

وارد پنل ادمین PocketBase شو: `http://185.8.174.236:8090/_/`

کالکشن‌های مورد نیاز (از فایل `PROJECT_PROMPT.md` بخش Backend):

- `users` (built-in auth)
- `profiles` (full_name, phone, balance, ...)
- `user_roles` (user, role: admin|user)
- `reservations`
- `transactions`
- `train_types`
- `routes`
- `route_fees`
- `payment_methods`
- `deposit_settings`
- `saved_passengers`
- `support_sessions`
- `support_messages`
- `employees`

---

## 🔐 مرحله ۳: تنظیم متغیرهای محیطی

فایل `.env` در ریشه پروژه:

```env
VITE_POCKETBASE_URL=http://185.8.174.236:8090
```

> ⚠️ فایل‌های `src/integrations/supabase/client.ts` و `types.ts` رو **حذف نکن** چون توسط سیستم خودکار مدیریت می‌شن. فقط دیگه import نکن.

---

## 🏗️ مرحله ۴: Build پروژه

```bash
bun run build
# خروجی: پوشه dist/
```

اگر در زمان build خطای دسترسی به CDN خارجی گرفتی:
- چک کن فونت‌ها از `/public/fonts/` لود می‌شن (نه `fonts.googleapis.com`)
- چک کن آیکون‌ها از `/public/icons/material-symbols/` لود می‌شن

---

## 🌐 مرحله ۵: تنظیم Nginx

فایل `/etc/nginx/sites-available/safarz`:

```nginx
server {
    listen 80;
    server_name 185.8.174.236;  # یا دامنه‌ی ایرانی شما

    root /var/www/safarz;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy به PocketBase (اختیاری - برای یکپارچگی)
    location /api/ {
        proxy_pass http://127.0.0.1:8090/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # کش طولانی برای فونت‌ها و asset
    location ~* \.(woff2?|ttf|otf|eot|jpg|jpeg|png|svg|webp|js|css)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
}
```

```bash
# Deploy
cp -r dist/* /var/www/safarz/

# فعال‌سازی
ln -s /etc/nginx/sites-available/safarz /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

---

## 🇮🇷 مرحله ۶: دامنه‌ی ایرانی + SSL

برای داشتن `https`:

1. یک دامنه `.ir` از [nic.ir](https://nic.ir) ثبت کن (تحت تحریم نیست).
2. رکورد A به IP سرورت بزن.
3. SSL رایگان با **ZeroSSL** (به جای Let's Encrypt که گاهی فیلتره):

```bash
# نصب acme.sh
curl https://get.acme.sh | sh
~/.acme.sh/acme.sh --register-account -m you@example.ir --server zerossl
~/.acme.sh/acme.sh --issue -d yourdomain.ir -w /var/www/safarz --server zerossl
```

---

## 📦 مرحله ۷: انتقال پروژه از Lovable به سرور خودت

### روش الف: کلون از GitHub
1. در Lovable روی **GitHub → Connect** بزن
2. ریپو ساخته می‌شه
3. روی سرورت:
   ```bash
   git clone https://github.com/USERNAME/safarz.git
   cd safarz
   bun install
   bun run build
   ```

### روش ب: دانلود مستقیم ZIP
از طریق گزینه‌ی **Export / Download** در Lovable.

---

## 🔄 مرحله ۸: حذف نهایی وابستگی به Supabase

اگر هنوز فایل‌های Supabase در `src/integrations/supabase/` مونده و خطا می‌ده:

```bash
# جستجو ببین کجاها از supabase استفاده شده
grep -r "from '@/integrations/supabase" src/ --include="*.tsx" --include="*.ts"
```

هر فایل رو به PocketBase migrate کن. الگو:

```ts
// قبل (Supabase)
import { supabase } from '@/integrations/supabase/client';
const { data } = await supabase.from('reservations').select('*');

// بعد (PocketBase)
import { pb } from '@/integrations/pocketbase/client';
const data = await pb.collection('reservations').getFullList();
```

---

## ✅ چک‌لیست نهایی

- [ ] PocketBase روی سرور با systemd اجرا می‌شه
- [ ] همه‌ی کالکشن‌ها در PocketBase ساخته شدن
- [ ] فایل `.env` با `VITE_POCKETBASE_URL` تنظیم شده
- [ ] فونت‌ها از `/public/fonts/` لود می‌شن (نه Google Fonts)
- [ ] هیچ `import` از `@/integrations/supabase` باقی نمونده
- [ ] `bun run build` موفقیت‌آمیز
- [ ] Nginx در حال serve کردن `dist/`
- [ ] دامنه‌ی `.ir` + SSL فعال

---

## 🆘 عیب‌یابی رایج

| مشکل | راه‌حل |
|---|---|
| `npm install` خطای ETIMEDOUT | رجیستری npmmirror رو تنظیم کن |
| فونت‌ها لود نمی‌شن | چک کن `public/fonts/fonts.css` در `index.html` import شده |
| CORS error از PocketBase | در پنل ادمین PocketBase → Settings → بزار `*` یا دامنه‌ت |
| `supabase is not defined` | همه‌ی import های `@/integrations/supabase` رو پاک کن |
| Build failed به دلیل دسترسی به CDN | `vite.config.ts` رو چک کن، هیچ CDN URL نباید توش باشه |

---

## 📞 پشتیبانی

اگر در هر مرحله گیر کردی، فقط ارور رو در چت Lovable بفرست تا کمکت کنم.

موفق باشی! 🚀
