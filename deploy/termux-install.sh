#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
pkg update -y
pkg install -y nodejs git
npm install
if [ ! -f .env ]; then cp .env.example .env; fi
printf '\nNODAX Termux setup complete. Edit .env, set PAIRING_PHONE, then run npm start.\n'
