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
mirror -R --delete dist $FTP_TARGET
bye
"