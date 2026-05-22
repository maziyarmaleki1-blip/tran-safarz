# 📦 راهنمای استفاده از build.sh

اسکریپت `build.sh` همه‌ی کارها رو با یک دستور انجام می‌ده.

## 🎯 سه حالت استفاده

### حالت ۱: فقط Build و بسته‌بندی (روی کامپیوتر خودت)

```bash
chmod +x build.sh
./build.sh
```

**نتیجه:** یه فایل `safarz-dist-YYYYMMDD-HHMMSS.tar.gz` ساخته می‌شه که آماده‌ی انتقال به سروره.

سپس روی سرور:
```bash
scp safarz-dist-*.tar.gz root@185.8.174.236:/tmp/
ssh root@185.8.174.236
sudo mkdir -p /var/www/safarz
sudo tar -xzf /tmp/safarz-dist-*.tar.gz -C /var/www/safarz
```

---

### حالت ۲: Build + Deploy خودکار (روی همون سرور)

```bash
sudo ./build.sh --deploy
```

فایل‌ها مستقیم در `/var/www/safarz` کپی می‌شن (با بکاپ خودکار از نسخه قبلی).

---

### حالت ۳: Build + Deploy + تنظیم خودکار Nginx ⭐ (پیشنهادی)

```bash
sudo ./build.sh --deploy --nginx
```

این دستور:
- پروژه رو Build می‌کنه
- در `/var/www/safarz` کپی می‌کنه
- Nginx رو نصب و کانفیگ می‌کنه
- SPA routing، Gzip، کش و هدرهای امنیتی رو اعمال می‌کنه
- یه proxy به PocketBase روی `/pb/` می‌سازه

بعد از اجرا، سایت روی `http://آی‌پی-سرور/` در دسترسه.

---

## ⚙️ متغیرهای قابل تنظیم

می‌تونی قبل از اجرا تغییرشون بدی:

```bash
POCKETBASE_URL="http://185.8.174.236:8090" \
DEPLOY_PATH="/var/www/safarz" \
SERVER_NAME="mysite.ir" \
NGINX_PORT="80" \
sudo ./build.sh --deploy --nginx
```

---

## 🚨 پیش‌نیازها روی سرور

```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs

# (اختیاری) Bun - خیلی سریع‌تر از npm
curl -fsSL https://bun.sh/install | bash
```

---

## ❓ سوالات متداول

**س: اگه npm نصب نشد چیکار کنم؟**  
ج: اسکریپت خودکار از رجیستری `npmmirror.com` (چین، بدون فیلتر) استفاده می‌کنه. اگه باز هم خطا داد، یک‌بار با VPN اجرا کن.

**س: چطور آپدیت کنم؟**  
ج: فقط دوباره `sudo ./build.sh --deploy` رو اجرا کن. نسخه قبلی به صورت خودکار بکاپ می‌گیره.

**س: چطور برگردونم به نسخه قبلی؟**  
ج:
```bash
sudo rm -rf /var/www/safarz
sudo mv /var/www/safarz.backup-YYYYMMDD-HHMMSS /var/www/safarz
sudo systemctl reload nginx
```

**س: PocketBase کجا اجرا بشه؟**  
ج: به فایل `SELF_HOSTING_GUIDE.md` بخش مرحله ۲ مراجعه کن.
