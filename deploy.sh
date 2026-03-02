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

# 1. Build
echo "Build starten..."
npm run build
echo "Build erfolgreich."

# 2. FTP-Upload mit lftp
echo "Deployment zu $FTP_HOST:$FTP_TARGET ..."
lftp -e "
open -u $FTP_USER,$FTP_PASS $FTP_HOST
mirror -R --delete --parallel=4 --exclude-glob .DS_Store --exclude-glob '*/.DS_Store' --exclude-glob '._*' dist $FTP_TARGET
bye
" || { echo "Fehler beim FTP-Upload." >&2; exit 1; }

# 3. Log
echo "$(date '+%Y-%m-%d %H:%M:%S') – Deploy erfolgreich ($(git log -1 --format='%h %s' 2>/dev/null || echo 'kein Git'))" >> deploy.log
echo "Deployment abgeschlossen."
