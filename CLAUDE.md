# CLAUDE.md – Termin-App „Meine Termine“

## Zuerst lesen
1. **`.claude/skills/i-have-adhd/SKILL.md`** – gilt für jede Antwort an Alicia UND als Gestaltungsregel für die Oberfläche. Immer anwenden.
2. **`SPEC.md`** – verbindliche Anforderungen (aus Alicias Fragebogen). Bei Widerspruch gewinnt SPEC.md vor vorhandenem Code.
3. **`referenz/artefakt-design.html`** – Design-Vorlage (Muster, Karten, Wochen-/Monatsansicht, Abhaken). Optik und Muster-Code (`CONCEPTS`, `flowers`, `aquarell`) von hier übernehmen.

## Projekt
- Statische Website / PWA ohne Build-Schritt, gehostet auf GitHub Pages: https://hammann983-jpg.github.io/mein-projekt/
- Dateien: `index.html`, `styles.css`, `app.js`, `config.js`, `kategorien.js` (neu), `sw.js`, `manifest.webmanifest`, Icons, `bubbles.jpg`.
- Vorhandener Code (v1) hat schon: Google-Anmeldung (GIS Token-Client), Calendar API lesen/schreiben, PWA, Wochen-Board. Darauf aufbauen.

## Harte Regeln
- **0 € laufende Kosten.** Kein Server, kein API-Schlüssel, kein Client-Secret im Repo.
- Zugangstoken nur im Speicher, nie in localStorage.
- Alle Texte aus Google mit `esc()` bzw. `textContent` ausgeben.
- Mamas Hauptkalender nie lesen, nur den geteilten Kalender „Familie“.
- Oberfläche: Deutsch, Du-Form. Schrift Fredoka + Nunito.
- Bei Änderungen an gecachten Dateien `CACHE` in `sw.js` hochzählen.

## Arbeitsweise mit Alicia
- Phasen aus `SPEC.md` Abschnitt 10 nacheinander, mit Aufgabenliste (ein Punkt pro Phase).
- Nach jeder Phase: lokal testen (`python3 -m http.server 8000`), Screenshots ansehen, committen, Meldung im ADHS-Stil: „Phase X von 6 erledigt: … Nächstes: … (ca. N Min.)“.
- Entscheidungen selbst treffen und kurz begründen. Nur fragen, wenn etwas nicht rückgängig zu machen ist oder Alicias Konto/Mamas Daten betrifft.
- Schritte, die nur Alicia machen kann (Google Cloud Console, Mama einladen, Kalender teilen): als nummerierte Liste mit Zeitangabe, dann warten.
