# OdKorkujTo — Platforma PWA do Korepetycji na Żądanie i Edukacji Celowej
## Wymagania biznesowe i funkcjonalne (Requirements)

**Wersja:** 1.0  
**Status:** Draft / Ready for Review  
**Produkt:** OdKorkujTo (Progressive Web Application)  
**Główny cel:** Natychmiastowe dopasowanie (SOS on-demand) i prowadzenie celowej nauki z ochroną przed migracją poza platformę (disintermediation)

---

## 1. Cel i wizja projektu

Celem projektu **OdKorkujTo** jest odejście od archaicznego modelu pasywnej tablicy ogłoszeń na rzecz interaktywnej platformy edukacyjnej w formie aplikacji PWA (Progressive Web App). 

Platforma rozwiązuje dwa kluczowe problemy rynku edtech:
1. **Dla ucznia:** Długi czas oczekiwania na pomoc, brak elastyczności przy nagłych problemach z materiałem oraz brak mierzalnego śledzenia postępów.
2. **Dla korepetytora:** Wysokie prowizje sklepów z aplikacjami (App Store/Google Play), trudności z windykacją płatności oraz pokusa ucieczki poza platformę po pierwszej sesji (disintermediation).

---

## 2. Główne zasady produktu (Core Principles)

1. **On-Demand First (Tryb SOS):** Priorytetem jest natychmiastowe rozwiązanie problemu edukacyjnego w czasie rzeczywistym.
2. **PWA-Native Experience:** Maksymalne wykorzystanie możliwości nowoczesnych przeglądarek (Web Push, Tryb Offline, Web Payments, Canvas) bez barier instalacyjnych ze sklepów aplikacji i bez 30% prowizji Apple/Google.
3. **Anti-Disintermediation:** Model subskrypcyjny SaaS dla nauczycieli + prowizja degresywna i zintegrowane narzędzia pracy czynią opuszczanie platformy nieopłacalnym.
4. **Syllabus-Driven Learning:** Nauka oparta na mierzalnym pokryciu podstawy programowej i celach egzaminacyjnych, a nie na niekończących się godzinach korepetycji bez metryk.

---

## 3. Role i profil użytkownika

### 3.1. Uczeń / Rodzic
- Zgłasza natychmiastowe zapotrzebowanie na pomoc (SOS) lub umawia lekcje celowe.
- Płaci bezpiecznie za pomocą 1-klikowych metod płatności mobilnych (BLIK, Google Pay, Apple Pay).
- Śledzi swój postęp w opanowaniu materiału egzaminacyjnego (Syllabus Tracker).

### 3.2. Korepetytor
- Weryfikowany ekspert przedmiotowy.
- Może przełączać się w tryb „Dostępny na żądanie (SOS)”.
- Korzysta z platformy jako narzędzia SaaS (kalendarz, rozliczenia, tablica, CRM uczniów).

### 3.3. Administrator platformy
- Weryfikuje kwalifikacje i tożsamość korepetytorów.
- Nadzoruje spory w systemie Smart Escrow.
- Zarządza bazą programową i sylabusami.

---

## 4. Główne obiekty biznesowe

- **Użytkownik (User):** Uczeń, Rodzic lub Korepetytor.
- **Zgłoszenie SOS (SOS Request):** Zgłoszenie ad-hoc ze zdjęciem/opisem zadania, limitem czasowym i deklarowanym budżetem.
- **Lekcja / Mikrosesja (Session):** Zaplanowane spotkanie lub sesja na żądanie (np. 15, 30, 60 minut).
- **Syllabus / Drzewo Celów (Goal Tree):** Zbiór zagadnień z oficjalnej podstawy (np. E8, Matura Formuła 2023) z przypisanym stanem opanowania.
- **Płatność / Escrow (Escrow Transaction):** Zablokowane środki ucznia uwalniane po poprawnej realizacji sesji.
- **Mikrozadanie (Async Task):** Asynchroniczna prośba o sprawdzenie wypracowania lub zadania domowego.

---

## 5. Wymagania biznesowe i modułowe (BR)

### 5.1. Moduł SOS i Reverse-Matching

- **BR-001 — Zgłoszenie SOS na żądanie:** Uczeń może zgłosić problem, załączając zdjęcie/tekst zadania, wybierając przedmiot i określając maksymalny budżet oraz preferowany czas trwania mikrosesji (15/30/60 min).
- **BR-002 — Natychmiastowy dispatch (Web Push):** System rozsyła powiadomienie push w czasie rzeczywistym do aktualnie aktywnych korepetytorów z danego przedmiotu.
- **BR-003 — Zasada „First-to-Claim”:** Pierwszy zweryfikowany korepetytor, który zaakceptuje warunki, otrzymuje zlecenie. Rozpoczyna się odliczanie (grace period) do otwarcia pokoju lekcyjnego.
- **BR-004 — Algorytmiczna odwrócona giełda (Planowane lekcje):** Przy standardowych lekcjach system na podstawie celu i terminu przedstawia uczniowi maksymalnie 3 najlepiej dopasowanych korepetytorów zamiast nieskończonej listy ofert.

### 5.2. Narzędzia lekcyjne wbudowane w PWA

- **BR-005 — Lekka tablica interaktywna (Canvas):** Aplikacja udostępnia wbudowaną tablicę z obsługą rysowania dotykiem/rysikiem, wklejaniem zrzutów ekranu i LaTeX w czasie rzeczywistym.
- **BR-006 — Komunikacja audio/wideo:** Lekcja odbywa się bezpośrednio w przeglądarce (WebRTC) bez konieczności instalowania i uruchamiania zewnętrznych aplikacji (Zoom, Teams, Discord).
- **BR-007 — Rozliczanie mikrosesji co do minuty:** W trybie SOS rozliczenie następuje na podstawie rzeczywistego czasu trwania sesji zatwierdzonego przez obie strony.

### 5.3. Syllabus Tracker i Edukacja Celowa

- **BR-008 — Standaryzowane drzewo podstawy programowej:** System zawiera predefiniowane moduły (Egzamin Ósmoklasisty, Matura Podstawowa/Rozszerzona, programy akademickie).
- **BR-009 — Wspólne odznaczanie celów:** Po każdej lekcji uczeń i nauczyciel oznaczają zrealizowane zagadnienia, aktualizując procentowy pasek gotowości do egzaminu.
- **BR-010 — Dostęp offline do notatek:** Materiały, zrzuty z tablicy i podsumowania lekcji muszą być dostępne w trybie offline (Service Worker + IndexedDB).

### 5.4. Finanse, Smart Escrow i Monetyzacja

- **BR-011 — Smart Escrow:** Środki za lekcję są blokowane na koncie ucznia w momencie akceptacji terminu/SOS i uwalniane na konto korepetytora po zakończeniu zajęć.
- **BR-012 — Płatności One-Touch:** Obsługa płatności mobilnych przez Web Payments API / bramkę BLIK bez skomplikowanych przekierowań.
- **BR-013 — Degresywny model prowizyjny:**
  - 1–3 lekcja z danym uczniem: prowizja platformy 12%.
  - 4–9 lekcja: prowizja platformy 5%.
  - Od 10 lekcji: 0% prowizji od lekcji (przejście na model mikromonetyzacji transakcyjnej).
- **BR-014 — Model subskrypcyjny SaaS:** Korepetytor może wykupić stały abonament (np. 29 zł/mc) odblokowujący 0% prowizji od początku, zaawansowany kalendarz, automatyczne fakturowanie i priorytet zapytań SOS.
- **BR-015 — Asynchroniczne mikrozadania:** Uczeń może zlecić sprawdzenie zadania/wypracowania za ułamkową stawkę (np. 15 zł), otrzymując recenzję audio/notatkę w określonym SLA (np. do 3 godzin).

---

## 6. Wymagania techniczne specyficzne dla PWA (PWA-REQ)

- **PWA-001 — Manifest i instalowalność:** Aplikacja posiada w pełni zgodny `manifest.json`, umożliwiając instalację A2HS (Add to Home Screen) na urządzeniach iOS (Safari) oraz Android (Chromium).
- **PWA-002 — Web Push Notifications:** Obsługa powiadomień push w tle na systemach Android oraz iOS (od iOS 16.4+) o statusach SOS, wiadomościach i nadchodzących lekcjach.
- **PWA-003 — Service Worker & Offline Cache:** Pełne buforowanie powłoki aplikacji (App Shell), podglądu sylabusa, terminarza oraz pobranych notatek z lekcji.
- **PWA-004 — Reaktywny interfejs dotykowy (Touch-First UX):** Interfejs dostosowany pod obsługę kciukiem na smartfonach oraz płynne pisanie rysikiem na tabletach.

---

## 7. Scenariusze użytkownika (Use Cases)

### UC-001 — Nagła pomoc przed sprawdzianem (Tryb SOS)
1. Uczeń o 20:30 nie radzi sobie z zadaniem ze stereometrii.
2. Robi zdjęcie w PWA, wybiera czas: „15 minut SOS”, klika „Szukaj pomocy”.
3. Trzech aktywnych korepetytorów otrzymuje powiadomienie Push z podglądem zadania i kwotą.
4. Korepetytor Jan akceptuje zlecenie w 20 sekund.
5. PWA otwiera mikrosesję z tablicą i głosem; Jan tłumaczy zadanie, rysuje schemat.
6. Po 15 minutach oboje zatwierdzają zakończenie; system uwalnia 25 zł z depozytu na portfel Jana.

### UC-002 — Przygotowanie do Matury z Syllabus Trackerem
1. Uczennica przygotowuje się do matury rozszerzonej z chemii.
2. Wybiera pakiet celów „Matura Chemia 2027”.
3. System proponuje dopasowanego nauczyciela specjalizującego się w tym profilu.
4. Po każdych zajęciach korepetytor odznacza opanowane działy (np. „Kinetyka chemiczna”).
5. Uczennica w autobusie w trybie offline przegląda odznaczone zagadnienia i notatki z tablicy.

---

## 8. Zakres MVP (Minimum Viable Product)

### W zakresie (In-Scope MVP):
1. Rejestracja i logowanie (Uczeń, Nauczyciel) z weryfikacją numeru telefonu.
2. Moduł SOS: tworzenie zgłoszenia z załączonym zdjęciem i rozsyłanie Web Push.
3. Czat tekstowy + prosta wbudowana tablica online (HTML5 Canvas z obsługą dotyku).
4. Integracja płatności (BLIK / karta) z blokadą środków (Escrow).
5. Podstawowy Syllabus Tracker (predefiniowana podstawa dla Matury z Matematyki i J. Angielskiego).
6. Instalowalność PWA (A2HS) i obsługa Web Push Notifications.

### Poza zakresem MVP (Out-of-Scope / V2):
- Własny serwer WebRTC audio/wideo (w MVP integracja z lekkim embedem np. Jitsi / Daily.co lub tylko audio + tablica).
- Zaawansowany marketplace sprzedaży gotowych fiszek i kursów.
- Zautomatyzowane fakturowanie księgowe B2B dla korepetytorów.
- Asynchroniczne sprawdzanie zadań w modelu giełdowym.

---

## 9. Kryteria akceptacji MVP (Acceptance Criteria)

- **AC-001:** Uczeń może opublikować zgłoszenie SOS w czasie krótszym niż 45 sekund od wejścia do PWA.
- **AC-002:** Dostępni korepetytorzy otrzymują powiadomienie Web Push w czasie < 3 sekund od publikacji SOS.
- **AC-003:** Użytkownik może zainstalować aplikację na ekranie głównym telefonu bez pobierania ze sklepu App Store / Play.
- **AC-004:** Środki za lekcję są pobierane i blokowane przed rozpoczęciem, a korepetytor otrzymuje wypłatę natychmiast po jej zatwierdzeniu.
- **AC-005:** Notatki i lista celów z sylabusa otwierają się poprawnie przy wyłączonym połączeniu internetowym.
- **AC-006:** Prowizja platformy jest automatycznie redukowana zgodnie z regułą degresywną dla powracających uczniów.

---

## 10. Kluczowe pytania otwarte i ryzyka

1. **Retencja powiadomień iOS:** Web Push na iOS wymaga dodania PWA do ekranu głównego (A2HS) — jak skutecznie poprowadzić onboardingu ucznia, by dodał skrót na iOS?
2. **Polityka weryfikacji nauczycieli:** Czy w trybie SOS dopuszczamy każdego zarejestrowanego korepetytora, czy tylko zweryfikowanych dokumentem / maturą / dyplomem?
3. **Rozstrzyganie sporów (Dispute Management):** Jak postępować, jeśli po 15-minutowej sesji uczeń zgłosi, że nauczyciel nie pomógł rozwiązać zadania? (Wymóg rejestracji logów tablicy).
