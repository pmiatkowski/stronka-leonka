# Postgres SQL Proxy Server

Prosty serwer proxy REST API do komunikacji z bazą danych PostgreSQL.

Strona stworzona przez 8-latka i copilot'a. Jest prosta i dziurawa, ale to dopiero początek przygody z programowaniem!

Ta aplikacja to efekt wspólnej nauki - pokazuje, jak można łączyć ciekawość dziecka z możliwościami nowoczesnych narzędzi AI. Mimo swojej prostoty, implementuje wszystkie podstawowe operacje CRUD (Create, Read, Update, Delete) i stanowi solidną bazę do dalszego rozwoju.

Tata pomógł przy deploymencie i dokeryzacji.

## O projekcie

Projekt powstał jako edukacyjna przygoda z web developmentem, gdzie młody programista poznawał:

- Podstawy Node.js i Express.js
- Pracę z bazami danych PostgreSQL
- Tworzenie REST API
- Konteneryłzację z Docker
- Strukturę projektów webowych

Kod zawiera komentarze i dokumentację, które pomagają zrozumieć, jak działa każda część aplikacji. To idealne miejsce do nauki programowania od podstaw!

## Funkcjonalności

✅ **Gotowe do użycia:**

- Kompletne REST API dla raportów agentów
- Interfejs webowy z formularzami
- Walidacja danych wejściowych
- Obsługa błędów
- Dockeryzacja dla łatwego wdrożenia

🚧 **Do poprawy (świadomie proste):**

- Brak zaawansowanego systemu autoryzacji
- Minimalna walidacja bezpieczeństwa
- Podstawowa obsługa błędów
- Prosta struktura HTML/CSS

## Dlaczego "dziurawa"?

Aplikacja jest nazywana "dziurawą", ponieważ:

- Skupia się na nauce podstaw, nie na produkcyjnym bezpieczeństwie
- Ma uproszczoną walidację danych
- Brakuje zaawansowanych funkcji enterprise
- To punkt startowy, nie finalizowany produkt

**To nie bug, to feature** - prostota ułatwia naukę i zrozumienie fundamentalnych koncepcji!

## Stack technologiczny

- Node.js v20
- Express.js v4
- PostgreSQL 17
- node-postgres (pg)
- dotenv (konfiguracja zmiennych środowiskowych)
- uuid (generowanie identyfikatorów)
- Docker & Docker Compose

## Wymagania systemowe

- Node.js v20
- PostgreSQL 17
- npm (Node Package Manager)
- Docker & Docker Compose (opcjonalnie)

## Konfiguracja

Serwer wymaga następujących zmiennych środowiskowych (plik `.env`):

```
DB_HOST=db
DB_NAME=abc
DB_USER=xyz@
DB_PASSWORD=your_password
SERVICE_PORT=3001
```

## Instalacja

### Opcja 1: Instalacja lokalna

1. Sklonuj repozytorium:

```bash
git clone <repository-url>
cd postgres-sql-proxy
```

2. Zainstaluj zależności:

```bash
npm install
```

3. Skonfiguruj zmienne środowiskowe:
   - Skopiuj plik `.env.example` do `.env`
   - Uzupełnij dane dostępowe do bazy danych w pliku `.env`:doc

```env
DB_HOST=postgres_database
DB_NAME=database_name
DB_USER=your_username
DB_PASSWORD=your_password
SERVICE_PORT=3001
```

4. Upewnij się, że baza danych zawiera wymaganą tabelę:

```sql
CREATE TABLE agent_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identyfikator_agenta TEXT NOT NULL,
    raport TEXT,
    poziom_satysfakcji INTEGER CHECK (poziom_satysfakcji BETWEEN 1 AND 5),
    access_code TEXT
);
```

### Opcja 2: Instalacja przy użyciu Dockera

1. Upewnij się, że masz zainstalowany Docker i Docker Compose

2. Sklonuj repozytorium i przejdź do katalogu projektu:

```bash
git clone <repository-url>
cd postgres-sql-proxy
```

3. Skonfiguruj zmienne środowiskowe:
   - Skopiuj plik `.env.example` do `.env`
   - W przypadku używania Dockera, ustaw `DB_HOST=postgres_database`

4. Uruchom kontenery:

```bash
docker-compose up -d
```

Aplikacja będzie dostępna pod adresem `http://localhost:22231`

### Konfiguracja bazy danych

Baza danych jest automatycznie inicjalizowana przy pierwszym uruchomieniu dzięki plikowi `init.sql`, który:

- Włącza rozszerzenie UUID dla PostgreSQL
- Tworzy tabelę `agent_reports`

## Endpointy REST API

### Pliki Statyczne

Serwer udostępnia pliki statyczne z katalogu `src/html/` na ścieżce głównej `/`:

- `/` - serwuje plik index.html
- `/Wystaw_opinie.html` - formularz wystawiania opinii
- `/opinions.json` - plik z opiniami

### Raporty Agentów

Baza zawiera tabelę `agent_reports` z następującą strukturą:

```sql
CREATE TABLE agent_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identyfikator_agenta TEXT NOT NULL,
    raport TEXT,
    poziom_satysfakcji INTEGER CHECK (poziom_satysfakcji BETWEEN 1 AND 5),
    access_code TEXT
);
```

#### GET /api/reports

Pobiera listę wszystkich raportów.

Response: `200 OK`

```json
[
  {
    "id": "uuid",
    "identyfikator_agenta": "string",
    "raport": "string",
    "poziom_satysfakcji": number,
    "access_code": "string"
  }
]
```

#### GET /api/reports/:id

Pobiera pojedynczy raport po ID.

Response: `200 OK`

```json
{
  "id": "uuid",
  "identyfikator_agenta": "string",
  "raport": "string",
  "poziom_satysfakcji": number,
  "access_code": "string"
}
```

#### POST /api/reports

Tworzy nowy raport.

Request Body:

```json
{
  "identyfikator_agenta": "string",
  "raport": "string",
  "poziom_satysfakcji": number,
  "access_code": "string"
}
```

Response: `201 Created`

```json
{
  "id": "uuid",
  "identyfikator_agenta": "string",
  "raport": "string",
  "poziom_satysfakcji": number,
  "access_code": "string"
}
```

#### PUT /api/reports/:id

Aktualizuje istniejący raport.

Request Body:

```json
{
  "identyfikator_agenta": "string",
  "raport": "string",
  "poziom_satysfakcji": number,
  "access_code": "string"
}
```

Response: `200 OK`

```json
{
  "id": "uuid",
  "identyfikator_agenta": "string",
  "raport": "string",
  "poziom_satysfakcji": number,
  "access_code": "string"
}
```

#### DELETE /api/reports/:id

Usuwa raport. Wymaga podania prawidłowego kodu dostępu.

Request Body:

```json
{
  "access_code": "string"
}
```

Responses:

- `204 No Content` - Raport został pomyślnie usunięty
- `403 Forbidden` - Nieprawidłowy kod dostępu
- `404 Not Found` - Raport nie został znaleziony

## Walidacja

- `poziom_satysfakcji` musi być liczbą całkowitą od 1 do 5
- `identyfikator_agenta` jest wymagany
- `id` jest generowane automatycznie jako UUID

## Obsługa błędów

- `400 Bad Request` - nieprawidłowe dane wejściowe
- `404 Not Found` - zasób nie został znaleziony
- `500 Internal Server Error` - błąd serwera

## Uruchomienie

### Tryb produkcyjny

```bash
npm start
```

### Tryb developerski (z auto-reloadem)

```bash
npm run dev
```

## Testowanie API

Możesz przetestować API używając narzędzi takich jak Postman lub curl. Przykłady:

### Pobieranie wszystkich raportów

```bash
curl http://localhost:3001/api/reports
```

### Dodawanie nowego raportu

```bash
curl -X POST http://localhost:3001/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "identyfikator_agenta": "AGENT001",
    "raport": "Testowy raport",
    "poziom_satysfakcji": 5,
    "access_code": "ABC123"
  }'
```

### Aktualizacja raportu

```bash
curl -X PUT http://localhost:3001/api/reports/:id \
  -H "Content-Type: application/json" \
  -d '{
    "raport": "Zaktualizowany raport",
    "poziom_satysfakcji": 4
  }'
```

### Usuwanie raportu

```bash
curl -X DELETE http://localhost:3001/api/reports/:id \
  -H "Content-Type: application/json" \
  -d '{
    "access_code": "twoj_kod_dostepu"
  }'
```

## Rozwiązywanie problemów

1. Upewnij się, że baza danych PostgreSQL jest uruchomiona i dostępna
2. Sprawdź, czy port 3001 nie jest zajęty przez inną aplikację
3. Zweryfikuj poprawność danych dostępowych w pliku .env
4. Sprawdź logi serwera w przypadku błędów

## Struktura projektu

```
.
├── src/
│   ├── controllers/
│   │   └── agentReportsController.js  # Logika biznesowa
│   ├── db/
│   │   └── database.js                # Konfiguracja bazy danych
│   ├── html/
│   │   ├── index.html                 # Strona główna
│   │   ├── Wystaw_opinie.html        # Formularz opinii
│   ├── routes/
│   │   └── agentReports.js           # Definicje endpointów
│   └── server.js                      # Główny plik serwera
├── .env                               # Zmienne środowiskowe
├── .env.example                       # Przykładowy plik konfiguracyjny
├── docker-compose.yml                 # Konfiguracja Docker Compose
├── Dockerfile                         # Konfiguracja obrazu aplikacji
├── init.sql                          # Inicjalizacja bazy danych
├── .gitignore                        # Ignorowane pliki w Git
└── README.md
```

## Kontenery Dockerowe

### Aplikacja (`app`)

- Bazuje na Node.js 20 Alpine
- Automatyczny reload w trybie deweloperskim
- Port: 22231 (mapowany z ${PORT})
- Wolumeny:
  - `.:/usr/src/app` - kod aplikacji
  - `/usr/src/app/node_modules` - moduły node

### Baza danych (`db`)

- PostgreSQL 17 Alpine
- Port: ${DB_PORT} (domyślnie 5432)
- Wolumeny:
  - `postgres_data:/var/lib/postgresql/data` - dane bazy
  - `./init.sql:/docker-entrypoint-initdb.d/init.sql` - skrypt inicjalizacyjny
