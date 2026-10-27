# Platforma nawigacji miejskiej i audytu barier miejskich "BezBarier"

## Wymagania biznesowe — wersja role & voice-centered

**Wersja:** 0.2  
**Status:** Draft  
**Główny cel:** audyt barier miejskich, głosowe zgłaszanie przeszkód oraz personalizowana nawigacja piesza  
**Źródło bazowe danych:** Treści wprowadzane przez użytkowników (zgłoszenia tekstowe i głosowe) zintegrowane z danymi przestrzennymi OpenStreetMap (OSM) oraz silnikiem PostGIS

---

## 1. Cel projektu

Celem projektu jest stworzenie miejskiej platformy nawigacyjnej i audytowej, której centralnym obiektem jest **użytkownik o zdefiniowanym profilu mobilności** oraz **bariera miejska**.

Platforma ma umożliwiać bezpieczne poruszanie się po mieście osobom z niepełnosprawnościami oraz rodzicom z dziećmi poprzez eliminację barier architektonicznych z planowanych tras, a także crowdsourcingowe mapowanie przeszkód i udogodnień.

System kładzie szczególny nacisk na inkluzywność cyfrową: osoby niewidome i niedowidzące mogą w pełni kontrolować aplikację za pomocą komend głosowych, zgłaszać przeszkody dyktując notatki bezpośrednio w terenie oraz korzystać z audiodeskrypcyjnej nawigacji krok po kroku (*turn-by-turn*).

Przykładowe pytanie biznesowe, na które platforma powinna odpowiadać:

> Jak osoba niewidoma lub poruszająca się na wózku może za pomocą komendy głosowej wyznaczyć trasę z Dworca Głównego na Uczelnię, która całkowicie omija niesprawne windy, schody bez podjazdów oraz rozkopane chodniki zgłoszone w ciągu ostatnich 24 godzin?

---

## 2. Główna zasada produktu

Platforma jest **role & voice-centered**.

Oznacza to, że:

- profil użytkownika (rola wybrana przy rejestracji) determinuje domyślny interfejs, sposób interakcji (Voice UI vs. mapa dotykowa) oraz algorytmy kalkulacji tras;
- dla osób niewidomych głównym medium interakcji jest głos (komendy, synteza mowy TTS, rozpoznawanie mowy STT);
- przeszkody i udogodnienia stanowią dynamiczną warstwę nałożoną na siatkę drogową, która w czasie rzeczywistym modyfikuje wagi przejść;
- użytkownik powinien móc szybko przejść od komendy głosowej do odsłuchania instrukcji nawigacyjnej lub zarejestrowania punktu;
- zgłoszenia terenowe podlegają weryfikacji społecznościowej, co buduje zaufanie do prezentowanych danych.

---

## 3. Główne zastosowania biznesowe

Platforma ma wspierać przede wszystkim:

1. rejestrację konta z przypisaniem profilu ograniczeń ruchowych lub sensorycznych;
2. w pełni głosową obsługę aplikacji przez osoby niewidome (brak konieczności precyzyjnego celowania w ekran);
3. głosowe oznaczanie barier w terenie na podstawie aktualnej pozycji GPS;
4. wyznaczanie dostępnych tras pieszych spersonalizowanych pod konkretną rolę (wózek, niewidomy, senior);
5. generowanie głosowych wskazówek nawigacyjnych z audiodeskrypcją przeszkód na trasie;
6. crowdsourcingowy audyt i weryfikację zgłoszeń terenowych przez wolontariuszy i audytorów;
7. ostrzeganie w czasie rzeczywistym przed nagłymi awariami (np. zepsuta winda na stacji przesiadkowej);
8. eksport raportów o barierach architektonicznych dla jednostek samorządu terytorialnego.

---

## 4. Podstawowy użytkownik

Platforma obsługuje zróżnicowane grupy użytkowników, udostępniając im dedykowane tryby pracy:

1. **Osoba niewidoma / słabowidząca:** korzysta z interfejsu głosowego (Voice UI), zgłasza przeszkody komendą mowy i odsłuchuje komunikaty nawigacyjne.
2. **Osoba na wózku / z ograniczeniami motorycznymi:** korzysta z interfejsu dotykowego zoptymalizowanego pod wysoki kontrast, filtruje trasy pod kątem braku schodów, szerokości przejść i dopuszczalnych nachyleń chodnika.
3. **Senior / Rodzic z wózkiem dziecięcym:** poszukuje tras płaskich, bez konieczności pokonywania stromizn, z dostępem do wind lub łagodnych ramp.
4. **Wolontariusz / Audytor miejski:** weryfikuje zgłoszenia dodane przez innych (np. uzupełnia zdjęcia do zgłoszeń głosowych), potwierdza naprawę lub usunięcie bariery.

Użytkownik bez wiedzy technicznej powinien móc:

- założyć konto i wskazać swoją rolę;
- uruchomić nawigację do celu jednym poleceniem głosowym lub kliknięciem;
- zgłosić przeszkodę w miejscu, w którym aktualnie stoi.

---

## 5. Główne obiekty biznesowe

Platforma powinna operować co najmniej na następujących obiektach:

- **Użytkownik** (z przypisaną rolą),
- **Rola użytkownika** (profil ograniczeń / dostępności),
- **Bariera / Punkt infrastrukturalny** (lokalizacja przestrzenna, kategoria, stan weryfikacji),
- **Notatka głosowa / Transkrypcja** (treść podyktowana przez użytkownika),
- **Zgłoszenie awarii tymczasowej** (np. zepsuta winda z określonym czasem ważności),
- **Weryfikacja zgłoszenia** (potwierdzenie lub zaprzeczenie przez innego użytkownika),
- **Trasa nawigacyjna** (ciąg geometrii dostosowany do wag profilu),
- **Komenda głosowa** (intencja zinterpretowana przez silnik mowy),
- **Instrukcja nawigacyjna** (komunikat TTS ze wskazówką kierunkową i ostrzeżeniem).

---

## 6. Role użytkowników i rejestracja profilu

### BR-001 — Deklaracja roli podczas tworzenia konta

Podczas zakładania konta użytkownik musi wybrać co najmniej jedną rolę bazową:

- `BLIND` (Niewidomy / Słabowidzący),
- `WHEELCHAIR` (Osoba na wózku manualnym/elektrycznym),
- `LIMITED_MOBILITY` (Senior / Osoba o kulach / Rodzic z wózkiem),
- `VOLUNTEER` (Wolontariusz / Audytor bez barier osobistych).

### BR-002 — Rejestracja w trybie głosowym

Dla użytkowników z niepełnosprawnością wzroku proces rejestracji musi umożliwiać wybór roli i uzupełnienie danych wyłącznie za pomocą poleceń mowy i komunikatów dźwiękowych.

### BR-003 — Adaptacja interfejsu do roli

Wybrana rola dynamicznie modyfikuje interfejs:

- dla roli `BLIND` ekran staje się jednolitym polem dotykowym aktywującym nasłuch komend głosowych oraz automatycznie włącza syntezator mowy (TTS);
- dla pozostałych ról ładowany jest domyślnie widok mapy wektorowej o wysokim kontraście (zgodny z WCAG 2.1 AA).

### BR-004 — Zmiana parametrów profilu

Użytkownik musi mieć możliwość późniejszej zmiany roli lub dostosowania parametrów szczegółowych (np. maksymalna wysokość krawężnika, preferencja unikania sygnalizacji bez dźwięku).

---

## 7. Interfejs głosowy (Voice UI) i komendy mowy

### BR-005 — Globalny nasłuch komend

W trybie `BLIND` aplikacja nasłuchuje komend po pojedynczym dotknięciu dowolnego punktu ekranu lub po wypowiedzeniu słowa wyzwalającego (*wake word*).

### BR-006 — Słownik komend podstawowych

System musi poprawnie interpretować intencje przynajmniej dla następujących fraz mowy:

- „Gdzie jestem?” — odczytanie bieżącego adresu i punktów orientacyjnych,
- „Prowadź do [cel]” — kalkulacja trasy i start nawigacji,
- „Zgłoś przeszkodę” — inicjalizacja kreatora głosowego zgłoszenia barier,
- „Co przede mną?” — audiodeskrypcja obiektów w promieniu 30 metrów na linii chodu,
- „Powtórz” — ponowne odegranie ostatniego komunikatu nawigacyjnego,
- „Stop” / „Anuluj trasę” — natychmiastowe przerwanie nawigacji.

### BR-007 — Sprzężenie zwrotne audio (TTS)

Każda poprawnie zinterpretowana lub odrzucona komenda musi wywołać natychmiastowy komunikat mowy (Text-to-Speech) informujący o stanie wykonania akcji.

---

## 8. Głosowe zaznaczanie miejsc i przeszkód w terenie

### BR-008 — Zgłoszenie pozycji GPS głosem

Użytkownik inicjuje procedurę poleceniem „Zgłoś przeszkodę”. System natychmiast utrwala bieżące współrzędne geograficzne urządzenia.

### BR-009 — Dyktowanie opisu bariery

Po ustaleniu lokalizacji system odpytuje użytkownika komunikatem: *„Co znajduje się w tym miejscu?”*. Użytkownik dyktuje opis (np. *„Wysoki krawężnik bez podjazdu”*, *„Zepsuta winda”*, *„Prace drogowe, brak przejścia”*).

### BR-010 — Transkrypcja i ekstrakcja intencji (STT)

Nagranie jest transkrybowane na tekst, a algorytm dopasowuje treść do standardowej kategorii:

- brak przejścia / roboty,
- przeszkoda pionowa (schody, krawężnik),
- awaria urządzenia (winda, schody ruchome),
- brak infrastruktury dotykowej / dźwiękowej.

### BR-011 — Status zgłoszenia głosowego

Zgłoszenie utworzone głosem otrzymuje początkowy status `VOICE_UNVERIFIED` i staje się natychmiast widoczne dla wolontariuszy jako zadanie do weryfikacji terenowej.

---

## 9. Weryfikacja społecznościowa i crowdsourcing

### BR-012 — Mikro-audyt przez wolontariuszy

Użytkownicy w roli `VOLUNTEER` widzą listę oraz mapę zgłoszeń głosowych oczekujących na weryfikację w promieniu do 1 km od swojej pozycji.

### BR-013 — Uzupełnienie dokumentacji

Wolontariusz może podejść do zgłoszonego punktu, wykonać zdjęcie smartfonem, doprecyzować kategorię techniczną i zatwierdzić stan faktyczny.

### BR-014 — Zmiana statusu na potwierdzony

Zgłoszenie zyskuje status `CONFIRMED`, gdy:

- zostanie potwierdzone ze zdjęciem przez wolontariusza, LUB
- otrzyma 2 niezależne potwierdzenia głosowe/kliknięcia od innych użytkowników w odstępie czasowym.

### BR-015 — Zgłaszanie naprawy / usunięcia bariery

Każdy użytkownik może zgłosić, że przeszkoda przestała istnieć (np. winda została naprawiona, remont chodnika się zakończył).

---

## 10. Nawigacja głosowa i wyznaczanie tras (SmartRouting)

### BR-016 — Rozróżnianie wag w zależności od roli

Trasa musi być kalkulowana na podstawie grafu ścieżek pieszych z wagami przypisanymi do roli:

- **Dla roli `WHEELCHAIR`:** krawędzie ze schodami lub krawężnikami $>5\text{ cm}$ mają wagę nieskończoną (zakaz przejścia);
- **Dla roli `BLIND`:** penalizowane są przejścia bez pasów fakturowych oraz skrzyżowania bez sygnalizatora dźwiękowego;
- **Dla roli `LIMITED_MOBILITY`:** unika się podejść o nachyleniu podłużnym $>6\%$.

### BR-017 — Głosowe instrukcje Turn-by-Turn

Nawigacja w trybie audio podaje komendy manewru z wyprzedzeniem odległościowym (np. *„Za 30 metrów skręć w lewo w ulicę Lipową”*).

### BR-018 — Audiodeskrypcja barier na trasie

Jeżeli w odległości 15 metrów od użytkownika znajduje się potwierdzona lub zgłoszona przeszkoda, system wstrzymuje standardowe instrukcje i generuje komunikat ostrzegawczy:

> *„Uwaga: za 15 metrów po Twojej prawej stronie zgłoszono brak płytek naprowadzających przed przejściem”*.

### BR-019 — Dynamiczne przeliczanie trasy (Rerouting)

Jeśli w trakcie marszu na trasie pojawi się nowe zgłoszenie o statusie krytycznym (np. nagła awaria windy na stacji), system przelicza trasę alternatywną i informuje użytkownika głosem.

---

## 11. Jakość danych i integralność przestrzenna

### BR-020 — Geofencing zgłoszeń

Zgłoszenie głosowe lub fotograficzne może zostać zarejestrowane wyłącznie wtedy, gdy dokładność sygnału GPS urządzenia wynosi co najmniej 15 metrów.

### BR-021 — Bufor przestrzenny przeszkody

Wszelkie analizy kolizji trasy z barierami są wykonywane z użyciem bufora przestrzennego (`ST_Buffer`) o promieniu minimum 5 metrów wokół koordynatów punktu.

### BR-022 — Unikanie duplikatów

System blokuje dodanie nowej bariery tej samej kategorii w promieniu 10 metrów od istniejącego już punktu; zamiast tego nowe zgłoszenie jest traktowane jako głos potwierdzający aktualność istniejącej bariery.

### BR-023 — Wygasanie zdarzeń tymczasowych (TTL)

Bariery oznaczone jako tymczasowe (awarie, wykopy) posiadają czas ważności (domyślnie 48h). Po tym czasie system odpytuje przechodzących użytkowników o aktualny stan lub dezaktywuje blokadę w grafie.

---

## 12. Dostępność cyfrowa (WCAG 2.1)

### BR-024 — Standard WCAG 2.1 AA / AAA

Interfejs wizualny musi spełniać kryteria WCAG 2.1 AA (m.in. kontrast barwny $\ge 4.5:1$, skalowanie fontów do 200% bez utraty funkcjonalności).

### BR-025 — Kompatybilność z czytnikami ekranu

Wszystkie komunikaty głosowe emitowane przez silnik aplikacji muszą być równolegle przekazywane do natywnych czytników ekranowych systemu operacyjnego (TalkBack, VoiceOver) za pomocą atrybutów `aria-live="assertive"`.

### BR-026 — Brak pułapek klawiaturowych

Nawigacja wewnątrz aplikacji musi być w 100% możliwa przy użyciu wyłącznie fizycznej klawiatury zewnętrznej lub klawiszy głośności/nawigacyjnych telefonu.

---

## 13. Przykładowe scenariusze użycia (Use Cases)

### UC-001 — Głosowe zgłoszenie awarii windy przez osobę niewidomą

> Użytkownik z rolą `BLIND` dociera do peronu stacji kolejowej, gdzie winda nie reaguje na przyciski. Dotyka ekranu telefonu i mówi: *„Zgłoś przeszkodę: winda na peronie pierwszym nie działa”*. Aplikacja zapisuje pozycję GPS, przetwarza mowę na tekst i rejestruje punkt ze statusem `VOICE_UNVERIFIED`. Użytkownik otrzymuje informację głosową: *„Przyjęto zgłoszenie awarii windy. Dziękujemy”*.

### UC-002 — Weryfikacja bariery przez wolontariusza

> Wolontariusz idzie ulicą i otrzymuje powiadomienie z aplikacji o oczekującym zgłoszeniu głosowym 50 m od niego. Podchodzi na miejsce, widzi rozkopany chodnik, wykonuje zdjęcie w aplikacji i oznacza checkbox: *„Chodnik całkowicie zablokowany, brak kładki z podjazdem”*. Punkt natychmiast uzyskuje status `CONFIRMED` i zaczyna blokować trasy dla wózków.

### UC-003 — Głosowa nawigacja do urzędu dla osoby niewidomej

> Użytkownik wypowiada komendę: *„Prowadź do Urząd Miasta”*. System znajduje adres, wyznacza trasę preferującą przejścia z sygnalizacją dźwiękową i rozpoczyna prowadzenie głosowe krok po kroku. Na 15 metrów przed rozkopanym fragmentem ulica informuje o utrudnieniu i poleca przejście na lewą stronę jezdni.

### UC-004 — Trasa bez schodów dla osoby na wózku

> Użytkownik z rolą `WHEELCHAIR` wpisuje cel podróży w widoku mapy. System kalkuluje trasę omijającą kładkę nad aleją (z uwagi na brak windy) i kieruje użytkownika do przejścia podziemnego wyposażonego w sprawną pochylnię.

---

## 14. Reguły biznesowe

### RB-001

Użytkownik nie może rozpocząć korzystania z nawigacji bez uprzednio zadeklarowanej roli głównej.

### RB-002

Zgłoszenie ze statusem `VOICE_UNVERIFIED` wyznacza bufor ostrzegawczy w nawigacji głosowej, lecz nie blokuje bezwzględnie trasy w profilu wózkowym, dopóki nie uzyska weryfikacji.

### RB-003

Wyciszenie lub wyłączenie syntezy mowy przez system operacyjny musi być wykrywane przez aplikację, wywołując wibracyjne powiadomienie haptyczne.

### RB-004

Wyznaczenie trasy pieszej dla profilu `WHEELCHAIR` ma bezwzględny zakaz uwzględniania krawędzi grafu oznaczonych jako `highway=steps` (schody), chyba że posiadają zmapowany sprawny podjazd rampowy lub windę.

### RB-005

Wszystkie dane telemetryczne i transkrypcje audio podlegają anonimizacji w celu ochrony prywatności lokalizacyjnej użytkowników.

---

## 15. Zakres MVP

W pierwszej wersji produktu priorytetem jest implementacja:

1. modułu rejestracji i wyboru roli (`BLIND`, `WHEELCHAIR`, `VOLUNTEER`);
2. interfejsu głosowego Web Speech API (komendy: nawiguj, zgłoś przeszkodę, powtórz, gdzie jestem);
3. głosowego formularza dodawania punktu z geolokalizacją i transkrypcją STT;
4. bazy przestrzennej PostgreSQL + PostGIS przechowującej przeszkody i ich statusy;
5. silnika kalkulacji tras (OSRM / pgRouting) z rozróżnieniem wag dla profilu wózkowego i profilu pieszego/niewidomego;
6. modułu głosowej nawigacji turn-by-turn z alertami o barierach w promieniu 15 m;
7. prostego panelu wolontariusza na mapie (Leaflet/Mapbox) do potwierdzania zgłoszeń i dołączania zdjęć;
8. pełnego spełnienia wymogów dostępności WCAG 2.1 AA.

---

## 16. Poza zakresem pierwszego MVP

Na pierwszym etapie poza zakresem pozostają:

- nawigacja wewnątrz budynków (Indoor navigation na bazie beaconów BLE);
- autonomiczna detekcja przeszkód w czasie rzeczywistym z kamery smartfona (Computer Vision / YOLO);
- automatyczna integracja z miejskimi sterownikami sygnalizacji świetlnej (ITS);
- system bezpośrednich połączeń wideo z asystentem-wolontariuszem (stylu Be My Eyes);
- aplikacje natywne na zegarki typu smartwatch.

---

## 17. Kryteria akceptacji MVP

### AC-001

Użytkownik podczas pierwszego uruchomienia może wybrać rolę głosem lub kliknięciem, a system ładuje interfejs dedykowany wybranej roli.

### AC-002

Wypowiedzenie komendy *„Zgłoś przeszkodę”* w trybie niewidomego uruchamia nagrywanie, pobiera pozycję GPS, dokonuje transkrypcji i tworzy wpis w bazie danych w czasie poniżej 5 sekund.

### AC-003

Wypowiedzenie komendy *„Prowadź do [cel]”* skutkuje poprawnym wyznaczeniem trasy i rozpoczęciem generowania instrukcji głosowych TTS.

### AC-004

Trasa dla profilu `WHEELCHAIR` omija schody i potwierdzone awarie wind, kierując użytkownika wyłącznie po ciągach płaskich lub rampach.

### AC-005

Zbliżenie się użytkownika na odległość mniejszą niż 15 metrów do zarejestrowanej przeszkody wyzwala priorytetowy komunikat głosowy ostrzegający o zagrożeniu.

### AC-006

Wolontariusz może w widoku mapy wyświetlić zgłoszenie dodane głosem, dodać do niego zdjęcie i zmienić jego status na `CONFIRMED`.

### AC-007

Audyt narzędziami Lighthouse oraz axe-core nie wykazuje żadnych błędów krytycznych dostępności (wynik accessibility $\ge 90$).

---

## 18. Kluczowe pytania otwarte

Do dalszego doprecyzowania:

1. Czy silnik Web Speech API wbudowany w przeglądarkę jest wystarczająco dokładny w języku polskim w warunkach hałasu ulicznego, czy konieczne będzie awaryjne wsparcie przez zewnętrzne API chmurowe (np. Whisper API)?
2. Jaki powinien być minimalny próg zaufania (Trust Score) wolontariusza, aby pojedyncze potwierdzenie natychmiast zmieniało status przeszkody na `CONFIRMED`?
3. W jaki sposób efektywnie synchronizować dane o barierach z bazą OpenStreetMap (czy aplikacja powinna wysyłać zmiany zwrotnie do globalnego OSM via Changeset API)?
4. Jak rozwiązać problem braku sygnału GPS w głębokich kanionach ulicznych lub przejściach podziemnych na poziomie nawigacji pieszej?
5. Czy dla roli `BLIND` należy umożliwić nawigację z użyciem kompasu magnetycznego (wskazówki zegarowe, np. *„przeszkoda na godzinie jedenastej”*)?

---

## 19. Definicja sukcesu projektu

Projekt osiąga swój cel inżynierski i biznesowy, jeżeli:

> Osoba z dysfunkcją wzroku jest w stanie od rejestracji profilu, poprzez komendę głosową wyznaczyć trasę pieszą, dotrzeć do celu wyłącznie w oparciu o wskazówki audio z ominięciem zaraportowanych przeszkód oraz zarejestrować napotkaną w drodze barierę za pomocą głosu, a wprowadzone dane zostaną poprawnie przetworzone w bazie przestrzennej PostGIS i udostępnione społeczności.
