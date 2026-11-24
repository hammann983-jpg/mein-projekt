# Meine Termine – persönlicher Terminassistent

Eine Website, die deinen Google Kalender anzeigt. Ganz oben steht immer deine aktuelle Woche, darunter ein Countdown bis zum nächsten Termin, Terminkarten und eine Monatsansicht. Das Muster wechselt jede Kalenderwoche: Punkte, Aquarellkreise, Streifen, Ringe.

Es gibt keinen Server und kein Passwort im Code. Du meldest dich direkt bei Google an, der Zugang bleibt nur im geöffneten Browser-Tab.

**Einrichtung: ca. 30 Minuten, einmalig.**

---

## Schritt 1 – Dateien auf GitHub hochladen (5 Min.)

1. Öffne https://github.com/hammann983-jpg/mein-projekt
2. Klick auf **Add file → Upload files**
3. Zieh **alle Dateien aus diesem Ordner** hinein (nicht den Ordner selbst)
4. Klick auf **Commit changes**

## Schritt 2 – Website einschalten (GitHub Pages, 3 Min.)

1. Im Repo: **Settings → Pages**
2. Unter „Branch“ wählst du `main` und `/ (root)` und klickst auf **Save**
3. Nach ca. 1 Minute ist deine Seite erreichbar unter:
   **https://hammann983-jpg.github.io/mein-projekt/**

Die Seite läuft jetzt schon mit Beispielterminen.

## Schritt 3 – Google-Zugang anlegen (15 Min.)

1. Öffne https://console.cloud.google.com und melde dich mit deinem Google-Konto an
2. Oben links: **Projekt auswählen → Neues Projekt**, Name: `Meine Termine` → **Erstellen**
3. Menü **APIs & Dienste → Bibliothek** → „Google Calendar API“ suchen → **Aktivieren**
4. Menü **APIs & Dienste → OAuth-Zustimmungsbildschirm** (heißt manchmal „Google Auth Platform“)
   - App-Name: `Meine Termine`, deine E-Mail als Support- und Kontakt-Adresse
   - Zielgruppe: **Extern**
   - Unter **Testnutzer** deine eigene Gmail-Adresse eintragen
5. Menü **APIs & Dienste → Anmeldedaten → Anmeldedaten erstellen → OAuth-Client-ID**
   - Typ: **Webanwendung**
   - **Autorisierte JavaScript-Quellen:** `https://hammann983-jpg.github.io`
   - Weiterleitungs-URIs: leer lassen
   - **Erstellen**, dann die **Client-ID** kopieren (endet auf `.apps.googleusercontent.com`)

> Die Client-ID ist kein Passwort und darf öffentlich sein. Ein **Client-Secret** brauchst du nicht. Wenn Google eins anzeigt, nirgends eintragen.

## Schritt 4 – Client-ID eintragen (2 Min.)

1. Auf GitHub die Datei `config.js` öffnen → Stift-Symbol (bearbeiten)
2. `DEINE-CLIENT-ID.apps.googleusercontent.com` durch deine Client-ID ersetzen
3. **Commit changes**

## Schritt 5 – Anmelden und aufs Handy legen (5 Min.)

1. Öffne deine Seite und klick auf **Mit Google anmelden**
2. Google zeigt „Diese App wurde nicht überprüft“. Das ist normal, weil es deine eigene App ist: **Weiter** und dann den Kalender-Zugriff erlauben
3. **iPhone:** In Safari öffnen → Teilen → **Zum Home-Bildschirm**
   **Android:** In Chrome öffnen → ⋮ → **App installieren**

---

## Erinnerungen – so kommen sie zuverlässig an

Jeder Termin, den du über die Seite einträgst, bekommt diese Erinnerungen fest in Google gespeichert:

| Normal | Wichtig |
|---|---|
| 2 Tage, 1 Tag, 2 Std. vorher | zusätzlich 3 Tage und 30 Min. vorher |

Die **Google-Kalender-App** auf deinem Handy schickt sie als Push-Nachricht, auch wenn die Website zu ist. Dafür muss die App installiert sein und Benachrichtigungen erlaubt haben.

## Mit Claude zusammen

Im Claude-Chat mit verbundenem Google Kalender kannst du schreiben:
„Ich habe am 15. Dezember um 10:30 Uhr einen Orthopädentermin. Trag ihn mit den Erinnerungen 2 Tage, 1 Tag und 2 Stunden vorher ein.“
Claude legt den Termin an, und die Website zeigt ihn automatisch (sie aktualisiert sich alle 5 Minuten).

## Datenschutz

- Die Anmeldung läuft direkt über Google (OAuth). Die Seite sieht nie dein Passwort.
- Der Zugangsschlüssel bleibt nur im Arbeitsspeicher des Browser-Tabs und wird an keinen Server geschickt.
- Gespeichert wird im Browser nur: Filter, Ansicht und ob du schon einmal angemeldet warst.
- Zugriff jederzeit entziehen: https://myaccount.google.com/permissions

## Wenn etwas nicht klappt

| Meldung | Lösung |
|---|---|
| „Noch keine Google-Client-ID“ | Schritt 4 wiederholen |
| `Error 400: origin_mismatch` | In Schritt 3.5 genau `https://hammann983-jpg.github.io` eintragen (ohne `/` am Ende) |
| `access_denied` | Deine Gmail-Adresse unter Testnutzer eintragen (Schritt 3.4) |
| Änderungen erscheinen nicht | Seite neu laden. Die neuen Dateien brauchen auf GitHub ca. 1 Minute |

## Dateien

| Datei | Inhalt |
|---|---|
| `index.html` | Aufbau der Seite |
| `styles.css` | Design (Farben, Karten, Board) |
| `app.js` | Logik: Google-Anmeldung, Termine laden und anlegen, Wochenmuster |
| `config.js` | Deine Client-ID und dein Name |
| `manifest.webmanifest`, `sw.js`, `icon*` | App-Funktion fürs Handy (Home-Bildschirm, schnelles Laden) |
| `CLAUDE.md` | Hinweise für Claude Code, wenn du die Seite weiterentwickelst |
