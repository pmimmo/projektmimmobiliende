# Widerrufsformular API

`widerruf.php` versendet das statische Astro-Formular per PHPMailer über SMTP.

## PHPMailer installieren

Bevorzugt Composer im API-Verzeichnis ausführen:

```sh
cd public/api
composer require "phpmailer/phpmailer:^6.9"
composer install --no-dev --optimize-autoloader
```

Dadurch entsteht `public/api/vendor/`. Astro kopiert dieses Verzeichnis beim statischen Build nach `dist/api/vendor/`, und die bestehenden FTP-Deploy-Skripte laden es mit hoch.

Falls Composer lokal nicht verfügbar ist, PHPMailer alternativ manuell auf dem Server oder lokal in `public/api/vendor/` bereitstellen, sodass diese Datei existiert:

```txt
public/api/vendor/autoload.php
```

## Server-.env

Die SMTP-Konfiguration liegt nicht im Webverzeichnis, sondern eine Ebene außerhalb des Document Roots, z. B.:

```txt
SMTP_HOST=smtp.ionos.de
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=widerruf@pmimmo.de
SMTP_PASS=...
MAIL_TO=widerruf@pmimmo.de
MAIL_FROM=widerruf@pmimmo.de
```

Optional kann der absolute Pfad über die Server-Umgebungsvariable `WIDERRUF_ENV_PATH` gesetzt werden.
