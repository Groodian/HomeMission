# Ideas
- Organisierspiel einer WG --> Gamification von Verteilung von Aufgaben
- Punktzahl für Person 
- Account-Management (auch für mehrere WGs)
- WGs hinzufügen
- Profil --> einer WG beitreten / einladen oder neue WG hinzufügen

## Daten

1) WG
- mehrere User (1,...)
- mehrere Aufgaben 
    - es existieren schon default Aufgaben (vorgeschlagene Aufgaben) --> Aufgaben Templates
                                --> WG hat möglichkeit die Aufgaben direkt zu löschen
- Name
- ...

2) User
- Email + display name
3) Aufgabe
- typ 
    - müllrausbringen
    - putzen
    - ...
- Intervall oder einmalig
- Punktzahl
--> Quittung für Aufgabe
- assignen zu anderen Usern?

Aufgabenbacklog
- todo

- completed
- in progress

## Erweiterbares Konzept
- Geld verwalten
- E-Mail verwaltung
- Achievments
- Urlaub --> Wann bin ich da / nicht da
(- Tagesplan)
- Trend 
- Vergleich mit anderen WGs - Aktivitätsscreen im Vergleich mit anderen WGs 
- Aufgabendetailansicht
- Toggle light und dark mode (müsste von Anfang an beachtet werden)
- mehrere Sprachen (müsste von Anfang an beachtet werden)
- übersetzen von Text --> externe API (vgl. Google Übersetzer)
- Aufgaben als Kalender-Event exportieren

## Achievments
- Levels
- Höheres Level --> Farbe des Benutzernamens ändert sich
- Belohnung --> "Heute muss ich nicht" --> Joker wird gezogen
- Bestrafung

## User-Sicht
1) Logging Screen
--> Einloggen oder Registrierung
- Email + display name
2.1) WG erstellen oder WG beitreten / einladen
- Code eingeben --> einmaliger Code / Code resetten
- Person direkt einladen --> an Profil senden / E-Mail senden
2.2) Main
- Übersicht von Aufgaben
- Kalender --> Wo sind die Tasks (vgl Google Calender / Gitlab Calender) 
- rechts/links offene Tasks 
    - ein/ausklappbar
4) Profil/Statistiken für User/WG 
- Nutzerprofil innerhalb WG einsehbar
- Alarm für Aufgaben einrichten
- innerhalb WG --> wie produktiv sind die anderen
- Healthanzeige --> Wie gut kommt man mit seinen Aufgaben hinterher

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


