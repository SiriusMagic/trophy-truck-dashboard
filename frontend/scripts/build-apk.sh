#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Instalando dependencias..."
corepack yarn install --frozen-lockfile

echo "Generando la aplicación web..."
corepack yarn build

if [[ ! -d android ]]; then
  npx cap add android
else
  npx cap sync android
fi

echo "Compilando APK de prueba..."
cd android
./gradlew assembleDebug --no-daemon

APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
echo
echo "APK generado: $ROOT_DIR/android/$APK_PATH"
