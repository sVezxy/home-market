# 🏠 Home Market

A modern backend service for a real estate and short-term housing rental marketplace (inspired by Airbnb / Zillow).

---

## 🛠 Tech Stack

* **Runtime & Language**: [Node.js](https://nodejs.org/) (LTS) + [TypeScript](https://www.typescriptlang.org/)
* **Web Framework**: [Express](https://expressjs.com/)
* **ORM & Database**: [Prisma ORM](https://www.prisma.io/) + [PostgreSQL](https://www.postgresql.org/) (running in Docker)
* **Schema Validation**: [Zod](https://zod.dev/)
* **Authentication & Security**: [JWT](https://jwt.io/) (`jsonwebtoken`) + [bcrypt](https://www.npmjs.com/package/bcrypt)

---

## 📋 Prerequisites

Before getting started, make sure you have the following installed:
* [Node.js](https://nodejs.org/) (v20 or higher)
* [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
* [Git](https://git-scm.com/)

---

## 🚀 Quick Start Guide

### 1. Clone the repository
```bash
git clone <YOUR_REPOSITORY_URL>
cd home-market
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory (or copy from `.env.example`):
```bash
cp .env.example .env
```

Ensure your `.env` contains the required settings:
```env
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/db"
JWT_SECRET="super-secret-jwt-key"
```

### 4. Start PostgreSQL with Docker
Start the PostgreSQL container in the background:
```bash
docker compose up -d
```
*(The database will initialize and listen on port `5432`).*

### 5. Synchronize the database schema
Apply the Prisma models to the database:
```bash
npx prisma db push
```

### 6. Start the development server
```bash
npm run dev
```
The server will start listening at: **http://localhost:3000** 🚀

Verify it's working:
```bash
curl http://localhost:3000
# Output: Hello World!
```

---

## 💻 Useful Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server with auto-reload (`tsx watch`) |
| `docker compose up -d` | Start PostgreSQL container in background |
| `docker compose down` | Stop PostgreSQL container |
| `docker compose down -v` | Reset PostgreSQL container and purge persistent data volume |
| `npx prisma db push` | Push `schema.prisma` changes directly to the database |
| `npx prisma studio` | Open visual web database admin UI (at `http://localhost:5555`) |

---

## 📁 Project Structure

```text
home-market/
├── prisma/
│   ├── schema.prisma          # Database schema (User, Property, Booking models)
│   └── seed.ts                # Database seeder with sample data
├── src/
│   ├── middlewares/           # Global middlewares (JWT auth, Zod validator, error handler)
│   ├── modules/               # Feature-based domain modules
│   │   ├── auth/              # Registration, login, profile (/api/auth)
│   │   ├── properties/        # Listings catalog, CRUD, search filters (/api/properties)
│   │   └── bookings/          # Date reservation, conflict checking (/api/bookings)
│   ├── utils/                 # Utilities (Prisma client singleton, AppError class)
│   └── index.ts               # Express application entrypoint
├── docker-compose.yml         # PostgreSQL container definition
├── .env                       # Local secrets (never commit to Git!)
├── .env.example               # Template environment configuration
├── package.json               # Dependencies and scripts
└── tsconfig.json              # TypeScript compiler configuration
```

---

## 🤝 Team Git Workflow

1. **Never commit directly to the `main` branch**.
2. **Every day before starting work, sync your branch:**
   ```bash
   git checkout main
   git pull origin main
   ```
3. **Create a separate branch for each task:**
   ```bash
   git checkout -b feature/auth
   # or
   git checkout -b feature/properties
   ```
4. **When database models change:**
   After pulling changes from your teammate, run:
   ```bash
   npx prisma db push
   ```
5. **To stop the server:** Press `Ctrl + C` in your terminal window.
