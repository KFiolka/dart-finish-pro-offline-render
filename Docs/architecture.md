# Dart Finish Pro - Architektur-Dokumentation

## System-Übersicht
Dart Finish Pro ist eine Single-Page-Application (SPA), die auf React und TypeScript basiert. Das Hauptmerkmal ist die **lokale Engine**, die ohne Server-Anfragen optimale Checkout-Pfade berechnet.

## Komponenten-Struktur
```text
App.tsx (Zentraler State & Layout-Management)
├── Input-Sektion (Score & Range-Slider)
├── Präferenzen-Sektion (Toggle-Buttons für D/T)
├── Ergebnis-Display
│   └── PathVisualizer.tsx (Grafische Darstellung der Darts)
└── Plan-B-Display (Alternativ-Szenarien)
```

## Datenmodell (`types.ts`)
- `DartThrow`: Repräsentiert einen einzelnen Wurf (Label, Wert, Multiplikator, Typ).
- `DartPathStep`: Erweitert `DartThrow` um den Restscore nach dem Wurf.
- `FinishResult`: Das komplette Analyse-Objekt (Pfad, Erklärung, Szenarien).
- `UserPreferences`: Gespeicherte Favoriten des Nutzers.

## Engine-Logik (`engine.ts`)
Die Engine nutzt einen rekursiven Backtracking-Algorithmus (`solveRecursively`), um alle möglichen Wege zu finden, die mit 1, 2 oder 3 Darts exakt auf 0 enden (letzter Wurf muss ein Double oder Bullseye sein).

### Ranking-Algorithmus
Pfade werden nach folgenden Kriterien bewertet (niedrigster Score gewinnt):
1. **Anzahl der Darts:** Kürzere Wege werden massiv bevorzugt.
2. **Benutzerpräferenzen:** Bonus für Endwürfe auf Lieblings-Doppel.
3. **Sicherheit:** Malus für riskantere Bull-Finishes, sofern nicht notwendig.
4. **Standard-Wege:** Bevorzugung von "Profi-Wegen" (D20, D16, D10).

## Layout-Strategie
Um die unterschiedliche Reihenfolge auf Mobile und Desktop zu realisieren, ohne den DOM zu duplizieren, nutzt die App:
- **CSS Grid:** Ein 12-Spalten-Layout auf Desktop.
- **`display: contents`:** Ermöglicht es auf Mobile, die Spalten-Container logisch aufzulösen, sodass die Kinder direkt im Grid liegen und per `order` frei sortiert werden können.
