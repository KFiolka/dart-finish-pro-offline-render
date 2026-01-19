# Dart Finish Pro

Dart Finish Pro ist eine spezialisierte Web-Applikation zur Berechnung optimaler Dart-Checkouts von 170 bis 2. 
Diese Version arbeitet mit einer lokalen Berechnungs-Engine, um Latenzzeiten zu eliminieren und die volle Funktionalität ohne Internetverbindung (Offline-Ready) zu gewährleisten.

## Features

- **Offline-Ready:** Keine Internetverbindung erforderlich.
- **Lokale Berechnung:** Sofortige Ergebnisse (<10ms) durch rekursive Suchalgorithmen.
- **Personalisierung:** Einstellung von Lieblings-Doppeln und -Trippeln.
- **Fehlwurf-Analyse:** Automatische "Plan B" Berechnung bei Verfehlen von Trippeln.
- **Taktische Beratung:** Kontextbasierte Erklärungen zu den gewählten Wegen.

## Installation & Start

Da die App keine externen APIs verwendet, ist **keine Konfiguration von API-Keys notwendig**.

1. **Abhängigkeiten installieren:**
   ```bash
   npm install
   ```

2. **App starten:**
   ```bash
   npm run dev
   ```

3. Öffne die angezeigte URL in deinem Browser (z.B. `http://localhost:5173`).

## Technologie

- **Frontend:** React, Tailwind CSS
- **Engine:** TypeScript (Custom Recursive Solver in `engine.ts`)
- **State Management:** React Hooks
