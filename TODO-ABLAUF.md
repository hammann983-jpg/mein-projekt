# So kommen deine To-dos in die App

Du schreibst mir einmal pro Woche im Claude-Chat, was ansteht. Ich lege jedes To-do im Google Kalender an. Die App liest sie ein und zeigt sie nur im Reiter **To-dos**. In der Kalenderansicht tauchen sie nicht auf.

## Voraussetzung
Im Claude-Chat ist dein Google Kalender verbunden (Einstellungen → Konnektoren).

## Dein Satz an Claude (kopieren und anpassen)
> Trag meine To-dos für diese Woche in meinen Google Kalender ein. Jedes bekommt „To-do:" vor dem Titel, ist ganztägig und hat keine Erinnerung. Das sind sie:
> - Skript schreiben, bis Mittwoch
> - Steuerunterlagen sortieren, Freitag 17 Uhr
> - Wäsche waschen, irgendwann diese Woche

## Regeln, nach denen die App liest
| Was du willst | Wie es im Titel steht |
|---|---|
| To-do mit Tag | `To-do: Skript schreiben` am gewünschten Tag |
| To-do mit Uhrzeit | `To-do: Steuer sortieren` mit Beginn 17:00 |
| To-do ohne festen Tag (diese Woche) | `Woche: Wäsche waschen` |
| Erledigt | Die App setzt vorn ein `✓`, sobald du es antippst |

## Was du in der App siehst
- Zeitleiste: Überfällig, diese Woche, heute, morgen und die nächsten 14 Tage.
- Tippst du ein To-do an, ist es erledigt. Der Prozentbalken oben ändert sich.
- Der Balken zählt nur To-dos dieser Woche und offene aus früheren Tagen, nie Termine.
- Das Häkchen wird in Google gespeichert und gilt auf allen deinen Geräten.

## Optional: eigener Kalender „To-dos"
Legst du in Google Kalender einen Kalender „To-dos" an, kannst du ihn in der App unter „Kalender zuordnen" dem Reiter To-dos geben. Dann brauchst du „To-do:" im Titel nicht. Du kannst ihn in der Google-Kalender-App ausblenden.
