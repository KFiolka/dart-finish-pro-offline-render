# Dart Finish Pro - Roadmap

## Status Quo
Die Anwendung ist voll funktionsfähig als lokale Web-App. Die Engine berechnet Checkouts unter Berücksichtigung von Benutzerpräferenzen und bietet eine visuelle Analyse sowie alternative Szenarien.

## Phase 1: Kern-Funktionalität (Abgeschlossen)
- [x] Entwicklung der rekursiven Checkout-Engine (`engine.ts`).
- [x] Implementierung der Basis-UI mit Score-Eingabe und Pfad-Visualisierung.
- [x] Integration von Bogey-Zahlen und Validierung von Checkout-Regeln.

## Phase 2: Strategie & Personalisierung (Abgeschlossen)
- [x] Implementierung von Benutzerpräferenzen (Lieblings-Doubles/Triples).
- [x] Entwicklung der "Plan B" Logik für Fehlwürfe auf Triples.
- [x] Kontextsensitive taktische Erklärungen für jeden Checkout-Weg.

## Phase 3: UI/UX & Layout-Optimierung (Abgeschlossen)
- [x] Professionelles Dark-Design mit Tailwind CSS.
- [x] Responsive Layout-Optimierung: Mobile-Reihenfolge (Eingabe -> Ergebnis -> Plan B -> Präferenzen) vs. Desktop-Spalten.
- [x] Lösung des Lücken-Problems im Desktop-Layout mittels `display: contents`.

## Phase 4: Erweiterte Funktionen (Geplant)
- [ ] **Trainings-Modus:** Simulation von Würfen, um die Pfad-Anpassung live zu üben.
- [ ] **Statistik-Modul:** Tracking von Erfolgsquoten auf bestimmte Doppel.
- [ ] **PWA-Support:** Vollständiger Offline-Installations-Support (Service Worker).
- [ ] **Export-Funktion:** Teilen von Pfaden als Bild für Social Media.
