# Idee
- Organisierspiel für WGs --> Gamification von Aufgabenverteilung
- Punktzahl für WG-Mitglieder basierend auf gemachten Aufgaben (Müll rausbringen etc.) 
- Es gibt mehrere WGs, ein Nutzer ist Teil einer WG und jede WG hat Aufgaben, die erledigt werden müssen und unterschiedlich viele Punkte wert sind 

## Daten

1) WG
- mehrere User (1,...)
- mehrere Aufgaben 
    - es existieren schon template Aufgaben (vorgeschlagene Aufgaben) die automatisch dabei sind
                                --> WG hat möglichkeit diese Aufgaben direkt zu löschen
- Name
- Aufgabenbacklog
    - todo
    - completed
    - in progress
- Joincode

2) User
- Email
- display name

3) Aufgabe
- typ 
    - müllrausbringen
    - putzen
    - ...
- Serie (intervall) oder einmalig
- Punktzahl
--> Quittung für Aufgabe
- User assignment (optional)

## Erweiterbares Konzept
- Geld Verwaltung
- E-Mail verwaltung
- Achievements
- Urlaub --> Wann bin ich da / nicht da
(- Tagesplan)
- Trend 
- Vergleich mit anderen WGs - Aktivitätsscreen im Vergleich mit anderen WGs 
- Aufgabendetailansicht
- Toggle light und dark mode (müsste von Anfang an beachtet werden)
- mehrere Sprachen (müsste von Anfang an beachtet werden)
- übersetzen von Text --> externe API (vgl. Google Übersetzer)
- Aufgaben als Kalender-Event exportieren

+ Chat box for individual WG and for all WGs (Warning, Note, Event...)
+ WG-Market for trading stuff (photos, user informations)

## Achievments
- Levels
- Höheres Level --> Farbe des Benutzernamens ändert sich
- Belohnung --> "Heute muss ich nicht" --> Joker wird gezogen
- Bestrafung
- Tatsächliche Achievements (erste Aufgabe erledigt, fünf Aufgaben an einem Tag erledigt, etc.)

## Anwendung aus User-Sicht
1) Login Screen
--> Einloggen oder Registrierung (Email + display name)

2.1) Screen um WG zu erstellen oder WG beitreten / einladen
- Joincode eingeben --> einmaliger Code / Code resetten (ähnlich zu Whatsapp Gruppen)
- Person direkt einladen --> an Profil senden / E-Mail senden

2.2) Main Screen
- Übersicht von Aufgaben
- Kalender --> Wann sind die Tasks (vgl Google Calender / Gitlab Calender) 
- rechts/links offene Tasks 
    - ein/ausklappbar

4) Screen für WG Statistiken (Gesamt WG und einzelne WG-Mitglieder) 
- Nutzerprofil innerhalb WG einsehbar
- User innerhalb der WG --> wie produktiv ist jedes WG-Mitglied
- Healthanzeige --> wie gut kommt die WG mit Aufgaben hinterher
- Alarm für Aufgaben einrichten

## Technology
### Frontend
- React
- Bootstrap Components
- React Icons
- React Query

### Backend
- Swagger UI
- Express
- typeORM

### General
- Docker / Docker-Compose
- eslint, prettier, editor-config

## Offene Fragen
- Wie verhindert man, dass ein Nutzer eine Aufgabe mit großer Punktzahl erstellt und abschließt?
    - Aufgaben können nur gemeinsam abgeschlossen werden (alle müssen bestätigen)
    - Aufgaben können nur gemeinsam erstellt werden (alle müssen bestätigen)
