# Generar APK de Trophy Truck

Cuando se solicite generar el APK:

1. Ejecutar `cd frontend && bash scripts/build-apk.sh`.
2. Confirmar que Gradle termine con `BUILD SUCCESSFUL`.
3. Entregar el archivo `frontend/android/app/build/outputs/apk/debug/app-debug.apk`.
4. Si Gradle no está disponible localmente, usar el workflow `.github/workflows/apk.yml` de GitHub Actions.

El proyecto usa Capacitor. No ejecutar `./gradlew` en la raíz del repositorio: el proyecto Android está dentro de `frontend/android`.
