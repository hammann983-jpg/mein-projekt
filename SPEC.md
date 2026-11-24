# SPEC – Termin-App „Meine Termine“ (v2)

Quelle: Alicias Fragebogen vom 24.11.2026. Diese Datei ist die verbindliche Anforderung. Bei Widerspruch gewinnt diese Datei vor dem vorhandenen Code.

## 0. Leitplanken
- **Dauerhaft 0 € laufende Kosten.** Kein Server, keine bezahlte API, kein Claude-API-Schlüssel in der App. Hosting: GitHub Pages. Daten: Google Calendar API, Google Tasks API, Google Drive appDataFolder (alle kostenlos).
- **iPhone first.** Installierbar über Safari → „Zum Home-Bildschirm“ (PWA). Eigenes Icon, Vollbild.
- **ADHS-Skill gilt für die gesamte Oberfläche** (`.claude/skills/i-have-adhd/SKILL.md`). Übersetzung in UI-Regeln: siehe Abschnitt 6.
- **Kreativ, aber Übersicht schlägt Deko.** Muster nur im Hintergrund, Inhalte auf ruhigen Karten.
- **Kein Bestätigungsdialog für Sortierung.** Alles läuft automatisch im Hintergrund.

## 1. Nutzer:innen und Anmeldung
- Google-Anmeldung über Google Identity Services Token-Client (wie im vorhandenen `app.js`). Kein Client-Secret.
- Scopes: `calendar.readonly`, `calendar.events`, `tasks`, `drive.appdata`.
- Nutzer:innen: **Alicia** und **Mama** (beide als Testnutzer im OAuth-Zustimmungsbildschirm eintragen). Später optional **Amelie**.
- Jede Person sieht nach dem Login **ihre eigene** Ansicht (eigene Tabs je nach Konfiguration in `config.js`, Abschnitt 8).

## 2. Reiter (Tabs)
Drei große, anklickbare Reiter oben. Auswahl wird gemerkt.

| Reiter | Inhalt (für Alicia) |
|---|---|
| **Ich** | Alicias Hauptkalender (primary), inklusive Content-Termine, plus To-do-Spalte |
| **Familie** | Kalender „Familie“, den Mama selbst anlegt und mit Alicia teilt (Mama entscheidet, was dort steht). Später Amelies geteilter Kalender. |
| **Fabi** | Fabians geteilter Kalender (ist schon verbunden) + Alicias eigene Termine der Kategorie „Fabian“ |

- Kalender-IDs kommen aus `config.js`. Beim ersten Start: Auswahlliste aller Kalender (`calendarList`), damit Alicia per Tipp festlegt, welcher Kalender zu „Familie“ und „Fabi“ gehört. Gespeichert in Drive appDataFolder (geräteübergreifend).
- Mamas Privatsphäre: Die App liest bei Mama-Terminen **nur** den geteilten Kalender „Familie“, nie Mamas Hauptkalender.

## 3. Termine eintragen und Aktualisierung
- Eingetragen wird **direkt im Google Kalender** (App/Web). Die Website liest nur und zeigt automatisch an.
- Aktualisierung: alle 2 Minuten, beim Zurückkehren in die App (`visibilitychange`) und per Ziehen nach unten.
- Optional (Phase 3): Schnell-Eintrag-Feld in der App, das direkt speichert (ohne Bestätigung).

## 4. Automatische Kategorisierung (darf nicht danebenliegen)
Ohne KI, deterministisch und nachvollziehbar. Reihenfolge, erste Regel gewinnt:

1. **Quelle:** Termin aus Fabis Kalender → `Fabian`. Termin aus Kalender „Familie“ → `Familienleben`.
2. **Manuelle Zuordnung:** Wenn Alicia einen Termin einmal umsortiert hat, gilt das für diesen Termin für immer (gespeichert nach Event-ID in Drive appDataFolder).
3. **Titel-Präfix** (eindeutig, für 100 % Sicherheit): `Arbeit:`, `Content:`, `Familie:`, `Fabi:`, `Privat:`.
4. **Stichwortregeln** (Wortgrenzen, Groß/klein egal) aus `kategorien.js`:
   - **Arbeit (HPT):** hpt, dienst, frühdienst, spätdienst, mitarbeitergespräch, supervision, teamsitzung, teambesprechung, förderkonferenz, elterngespräch, hilfeplan, lebenshilfe, praktikantin, anleitung, fortbildung, hausunterricht
   - **Content / Videodreh:** content, reel, tiktok, instagram, story, karussell, dreh, videodreh, filmen, schneiden, schnitt, upload, posten, ugc, caption
   - **Familienleben:** mama, papa, familie, schwester, amelie, oma, opa, geburtstag (nur wenn mit Familienname)
   - **Fabian:** fabi, fabian, „mit fabi“, dinner mit fabi
   - **Persönlich:** Standard, wenn nichts passt
5. **Unklar-Markierung:** Passt keine Regel und der Titel enthält kein Persönlich-Stichwort (arzt, ortho, augen, zahn, friseur, gym, sport, akad, lernen …), bekommt der Termin ein kleines „?“. Ein Tipp darauf → Kategorie wählen → App fragt einmal: „Immer so für ‚<Wort>‘?“ → neue Regel wird gespeichert.
- Kategorien und Farben: Arbeit (Petrol), Content (Koralle), Familienleben (Senf), Fabian (Violett), Persönlich (Rosé).
- Tests: `kategorien.test.html` oder Node-Test mit mind. 40 Beispieltiteln, u. a. „Mitarbeitergespräch“ → Arbeit, „Supervision“ → Arbeit, „Dinner mit Fabi“ → Fabian, „Reel drehen Zimtschnecken“ → Content, „Mama Geburtstag“ → Familienleben, „Orthopäde Einlagen“ → Persönlich.

## 5. To-dos (eigene Spalte im Reiter „Ich“)
- Quelle: **Google Tasks** (kostenlos, synchron mit der Google-Kalender-App am iPhone). Eigene Liste „Termin-App“ (wird beim ersten Start angelegt, falls nicht vorhanden).
- **Tagesaufgabe** = Task mit Fälligkeitsdatum → erscheint bei diesem Tag. **Wochenaufgabe** = Task ohne Datum oder mit Titel-Präfix `Woche:` → erscheint in der Spalte „Diese Woche“.
- Abhaken in der App setzt den Task in Google auf erledigt (und umgekehrt).
- Kategorien gelten auch für To-dos (gleiche Regeln wie Abschnitt 4).
- **Fortschrittsbalken in Prozent:** erledigte To-dos dieser Woche / alle To-dos dieser Woche. Zahl groß, z. B. „60 % · 3 von 5“.
- Kein Vorschlagen von Zeiten (Alicia entscheidet selbst).

## 6. Oberfläche nach ADHS-Skill
- **Beim Öffnen sofort sichtbar:** Wochenübersicht des gewählten Reiters. Darüber eine Zeile „Jetzt dran“ mit dem nächsten Termin und Countdown („in 2 Std. 15 Min.“).
- **Heute hervorgehoben:** Tageskarte von heute größer bzw. farbig umrandet, auf dem iPhone automatisch ins Bild gescrollt.
- **Wichtigste Termine des Tages:** pro Tag max. 4 Einträge sichtbar, Rest unter „+ n weitere“. Wichtig markiert (Stern, kräftige Farbe) werden: Termine mit `!` im Titel, Arbeit-Termine mit Uhrzeit, und Stichwörter wie prüfung, klausur, abgabe, frist, arzt, gespräch, supervision.
- Darstellung als kurze Bullet-Zeilen: Uhrzeit · Kategorie, darunter Titel.
- Konkrete Zeitangaben überall („morgen 10:30“, „in 3 Tagen“), nie vage.
- Sichtbarer Fortschritt: Prozentbalken, abgehakte Einträge durchgestrichen, „Woche geschafft“-Moment bei 100 %.
- Sachliche Fehlermeldungen mit Ursache und einem Lösungsschritt.
- Max. 5 Elemente pro Gruppe, keine Pop-ups, keine Animationen, die ablenken (eine dezente Einblend-Animation erlaubt, aus bei `prefers-reduced-motion`).
- Schrift mind. 16 px, Tippflächen mind. 44 px.

## 7. Visuelle Konzepte
- 5 Konzepte × 3 Farbvarianten, exakt wie in `referenz/artefakt-design.html` (`CONCEPTS`): Punkte, Streifen, Seifenblasen (`bubbles.jpg`), Blumen, Aquarellkreise.
- **Rhythmus: Wechsel am 1. jedes Monats.** Begründung (ADHS): ein fester, vorhersehbarer Zeitpunkt; einen Monat lang gleiche Orientierung, dann neue Abwechslung. Anzeige: „Muster im November: Blumen · Creme & rote Blüten“.
- Musterkatalog zum Vorschauen bleibt erhalten.

## 8. Konfiguration (`config.js`)
```js
window.TERMIN_CONFIG = {
  CLIENT_ID: "…apps.googleusercontent.com",
  USERS: {
    "<SHA-256 der Gmail-Adresse von Alicia>": { name: "Alicia", tabs: ["ich", "familie", "fabi"] },
    "<SHA-256 der Gmail-Adresse von Mama>": { name: "Mama", tabs: ["ich", "familie"] }
  }
};
```
Kalender-Zuordnung pro Reiter wird in der App gewählt und in Drive appDataFolder gespeichert (Abschnitt 2).

## 9. Erinnerungen
- Push-Erinnerungen kommen über die **Google-Kalender-App** am iPhone (ist installiert, Benachrichtigungen an). Kostenlos und zuverlässig, auch wenn die Website zu ist.
- Eigene Web-Push-Nachrichten der Website sind **nicht** Teil von v2: Sie bräuchten einen Server. Falls später gewünscht: separat prüfen (z. B. kostenloser Cloudflare Worker), nur wenn dauerhaft 0 €.

## 10. Phasen (Claude Code arbeitet sie nacheinander ab)
1. **Grundgerüst & Design:** Reiter, Wochenansicht, Monatsansicht, Muster-Monatsrhythmus, ADHS-Regeln. Mit Beispieldaten testen.
2. **Google-Daten:** mehrere Kalender, Kalender-Zuordnung pro Reiter, Drive appDataFolder, Auto-Aktualisierung.
3. **Kategorisierung:** `kategorien.js` + Tests + „?“-Workflow.
4. **To-dos:** Google Tasks, Tages-/Wochenaufgaben, Prozentbalken.
5. **Mama-Zugang:** zweite Nutzerin, Test mit ihrem Konto, Anleitung für Mama (1 Seite, ADHS-freundlich).
6. **Feinschliff iPhone:** PWA-Icon, Safe-Area, Lighthouse-Check, Screenshots.

Jede Phase endet mit: lokal testen, Screenshots ansehen, committen, kurze Meldung „Phase X von 6 erledigt: … Nächstes: …“.
