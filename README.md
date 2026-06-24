# LUMEN Mini

LUMEN Mini to responsywna aplikacja PWA do lokalnej ewidencji istniejących
odcinków oświetlenia ulicznego oraz planowania nowych inwestycji dla Gminy
Wielopole Skrzyńskie.

## Uruchomienie

Wymagany jest Node.js 20 lub nowszy.

```bash
npm install
npm run dev
```

Aplikacja będzie dostępna pod adresem podanym przez Vite, domyślnie
`http://localhost:5173`.

Build produkcyjny:

```bash
npm run build
npm run preview
```

Projekt zawiera również blokadę `pnpm-lock.yaml`, więc można użyć:

```bash
pnpm install
pnpm run dev
```

## Kontrola jakości

Test wzorów, agregacji, scenariuszy i zawartości CSV:

```bash
npm run qa:logic
```

Pełny build wykonuje ścisłą kontrolę TypeScript i bundlowanie Vite:

```bash
npm run build
```

## Najważniejsze funkcje

- mapa Leaflet z ortofotomapą Geoportalu/GUGiK;
- OpenStreetMap działający pod ortofotomapą jako automatyczny fallback;
- przełącznik widoczności ortofotomapy i warstwy bazowej;
- linie odcinków z zaznaczonym punktem początkowym i końcowym;
- dodawanie i edycja odcinków istniejących oraz planowanych;
- ręczne współrzędne i pobieranie pozycji GPS;
- lista z filtrami oraz ranking wyłącznie planowanych inwestycji;
- automatyczne obliczenia mocy, energii, kosztów, emisji i wskaźników jednostkowych;
- edytowalne parametry globalne;
- scenariusze ograniczenia rocznego zużycia energii o 10% i 15%;
- karty KPI i wykresy Recharts;
- eksport wszystkich danych wejściowych i obliczonych wskaźników do CSV;
- dane demonstracyjne i lokalny zapis w `localStorage`;
- instalacja na ekranie głównym jako PWA.

## GPS i mapa

Geolokalizacja wymaga zgody użytkownika oraz bezpiecznego kontekstu przeglądarki
(`https` lub `localhost`). W razie odmowy lub braku GPS aplikacja wyświetla
czytelny komunikat i nadal pozwala wpisać współrzędne ręcznie.

Adresy usług Geoportalu/GUGiK należy okresowo weryfikować według oficjalnego
wykazu usług WMS/WMTS na Geoportal.gov.pl/GUGiK. Dostępność ortofotomapy zależy
od usługi zewnętrznej. OpenStreetMap jest stale dostępny jako warstwa bazowa
pod ortofotomapą.

## Ograniczenia MVP

- dane znajdują się tylko w bieżącej przeglądarce i nie są synchronizowane;
- brak kont użytkowników, ról i centralnej bazy danych;
- brak automatycznej kopii zapasowej i importu CSV;
- współrzędne nie są danymi geodezyjnymi;
- brak obsługi awarii, zdjęć i pojedynczych latarni;
- działanie mapy wymaga dostępu do zewnętrznych usług kafelkowych;
- aplikacja nie jest pełnym systemem Smart City.

## Możliwy drugi etap

- serwerowa baza danych, logowanie i role użytkowników;
- import CSV/XLSX, kopie zapasowe i synchronizacja wielu urządzeń;
- rysowanie odcinków bezpośrednio na mapie i pomiar długości geodezyjnej;
- historia zmian, załączniki, dokumentacja inwestycji i workflow akceptacji;
- aktualizowane taryfy energii, bardziej rozbudowane scenariusze i raporty PDF;
- optymalizacja ładowania przez podział głównego pakietu JavaScript.
