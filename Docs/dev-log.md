# Dart Finish Pro - Entwicklungs-Log (Gedächtnis)

## [Initialer Build]
- Erstellung der rekursiven Engine. Entscheidung gegen eine statische Tabelle zugunsten einer dynamischen Berechnung, um Benutzerpräferenzen in Echtzeit einfließen zu lassen.
- Implementierung der `PathVisualizer`-Komponente für ein "Karten-basiertes" UI-Feedback.

## [Update: Strategie-Ebene]
- **Entscheidung:** Einführung der `MissScenarios`. Ziel ist es, dem Spieler nicht nur zu sagen, was er treffen *soll*, sondern was er tun muss, wenn er das erste Triple verfehlt.
- Logik wurde so implementiert, dass bei einem Miss ein neuer 2-Dart-Finish-Pfad berechnet wird.

## [Update: Layout-Refactoring]
- **Problem:** Auf Desktop gab es eine Lücke unter der Punkte-Eingabe, weil das Grid-System die Zeilenhöhe des (höheren) Ergebnis-Moduls übernahm. Auf Mobile sollte die Reihenfolge aber (Input -> Ergebnis -> Plan B -> Präferenzen) sein.
- **Lösung:** Einführung von Wrapper-Containern mit `display: contents` (Mobile) und `block` (Desktop).
- **Technischer Hintergrund:** `display: contents` entfernt das Element aus dem Layout-Baum, lässt aber seine Kinder bestehen. Dies erlaubt die Nutzung von `order` im übergeordneten Grid über Container-Grenzen hinweg.

## [Aktueller Status]
- Die Dokumentation wurde in den `Docs/` Ordner verschoben, um als persistenter Kontext für zukünftige Iterationen zu dienen.
- Layout ist stabil und bündig auf allen Bildschirmgrößen.
