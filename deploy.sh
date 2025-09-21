#!/bin/bash
set -e

# .env einlesen
set -o allexport
source .env
set +o allexport

# 1. Build
npm run build

# 2. FTP-Upload mit lftp
lftp -e "
open -u $FTP_USER,$FTP_PASS $FTP_HOST
mirror -R --delete --parallel=4 --exclude-glob .DS_Store --exclude-glob '*/.DS_Store' --exclude-glob '._*' dist $FTP_TARGET
put -O $FTP_TARGET .htaccess
bye
"