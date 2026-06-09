Projekt Semestralny - Biblioteka online
Opis projektu

Aplikacja internetowa stworzona przy użyciu technologii Node.js oraz Express.js, umożliwiająca przeglądanie książek, wyszukiwanie informacji na ich temat oraz dzielenie się opiniami za pomocą systemu komentarzy. Dane aplikacji przechowywane są w bazie danych Supabase, natomiast sama aplikacja jest hostowana na platformie Railway.

Celem projektu jest stworzenie intuicyjnego serwisu dla czytelników, pozwalającego na odkrywanie nowych książek, zapoznawanie się z ich opisami oraz wymianę opinii z innymi użytkownikami.

Funkcjonalności
Przeglądanie książek

Użytkownicy mogą przeglądać katalog książek dostępnych w systemie. Każda książka prezentowana jest w formie listy, z możliwością przejścia do szczegółowego widoku po wybraniu przycisku „Szczegóły”.

Dla każdej książki dostępne są następujące informacje:

Tytuł
Autor
Rok wydania
Wydawnictwo
Gatunek
Zdjęcie okładki
Krótki opis
Wyszukiwanie, filtrowanie i sortowanie

Aplikacja udostępnia mechanizmy ułatwiające odnajdywanie interesujących pozycji:

wyszukiwanie książek,
filtrowanie wyników według dostępnych kryteriów,
sortowanie książek według wybranych parametrów.
Szczegóły książki

Po przejściu do widoku szczegółów użytkownik otrzymuje dostęp do rozszerzonych informacji o książce oraz sekcji komentarzy związanych z daną pozycją.

System komentarzy

Zalogowani użytkownicy mogą:

dodawać komentarze,
publikować komentarze jako „Anonim”,
usuwać własne komentarze.

Dodatkowo dostępne są funkcje:

sortowania komentarzy,
przełączania pomiędzy widokiem standardowym i kompaktowym.
Zarządzanie kontem użytkownika

System obsługuje uwierzytelnianie użytkowników oraz podstawowe operacje związane z zarządzaniem kontem.

Dostępne funkcje:

logowanie,
wylogowywanie,
zmiana hasła,
usuwanie konta.
Panel administratora

Użytkownicy posiadający uprawnienia administratora mają dostęp do dedykowanego panelu administracyjnego, który umożliwia:

dodawanie nowych książek,
edytowanie istniejących książek,
zarządzanie zawartością katalogu książek.
Wykorzystane technologie
Backend
Node.js
Express.js
Baza danych
Supabase
Hosting
Railway
Architektura systemu

Aplikacja wykorzystuje architekturę klient–serwer. Backend odpowiada za obsługę żądań użytkowników, autoryzację, komunikację z bazą danych oraz zarządzanie książkami i komentarzami. Wszystkie dane przechowywane są w bazie danych Supabase, natomiast wdrożenie aplikacji realizowane jest za pomocą platformy Railway.

Najważniejsze cechy projektu
system kont użytkowników
obsługa ról (administratow, użytkownik, niezalogowany)
katalog książek z rozbudowanym widokiem szczegółów
możliwość dodawania i usuwania komentarzy
publikowanie komentarzy anonimowych przez zalogowanych użytkowników
filtrowanie i sortowanie książek
sortowanie komentarzy
przełączanie pomiędzy różnymi widokami komentarzy
integracja z bazą danych Supabase
wdrożenie aplikacji na platformie Railway

Projekt wykonany przez Bartosza Kokoszko 77050 oraz Nikitę Bielan 77336
Link do krótkiego filmiku prezentującego wybrane funkcje: https://youtu.be/bFKQU-_37E0
Link do strony internetowej: https://projektsemestralny7705077336-production.up.railway.app/
