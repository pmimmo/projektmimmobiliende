#!/bin/bash
set -e

# .env einlesen
set -o allexport
source .env
set +o allexport

# Prüfe, ob alle FTP-Variablen gesetzt sind
for var in FTP_HOST FTP_USER FTP_PASS FTP_TARGET; do
  if [ -z "${!var}" ]; then
    echo "Fehler: $var ist nicht in .env gesetzt." >&2
    exit 1
  fi
done

# .htpasswd-dev prüfen oder erstellen
if [ ! -f ".htpasswd-dev" ]; then
  echo "Kein .htpasswd-dev gefunden. Erstelle mit Passwort 'Vorschau'..."
  echo "Vorschau:$(openssl passwd -apr1 'Vorschau')" > .htpasswd-dev
  echo ".htpasswd-dev erstellt."
fi

# 1. Build mit base=/dev
echo "Build starten (base=/dev)..."
ASTRO_BASE=/dev npm run build
echo "Build erfolgreich."

# 2. FTP-Upload nach FTP_TARGET/dev/
DEV_TARGET="${FTP_TARGET%/}/dev"
echo "Deployment zu $FTP_HOST:$DEV_TARGET ..."
lftp -e "
open -u $FTP_USER,$FTP_PASS $FTP_HOST
mirror -R --delete --parallel=4 --exclude-glob .DS_Store --exclude-glob '*/.DS_Store' --exclude-glob '._*' dist $DEV_TARGET
put .htaccess-dev -o $DEV_TARGET/.htaccess
put .htpasswd-dev -o $DEV_TARGET/.htpasswd
bye
" || { echo "Fehler beim FTP-Upload." >&2; exit 1; }

# 3. Log
echo "$(date '+%Y-%m-%d %H:%M:%S') – Dev-Deploy erfolgreich ($(git log -1 --format='%h %s' 2>/dev/null || echo 'kein Git'))" >> deploy.log
echo "Dev-Deployment abgeschlossen: https://projektmimmobilien.de/dev/"
