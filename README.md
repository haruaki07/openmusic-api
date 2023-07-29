## OpenMusic API V3

This is submission for [Dicoding](https://www.dicoding.com) course, [Belajar Fundamental Aplikasi Back-End](https://www.dicoding.com/academies/271/corridor).

### Prerequisites

1. Node.js v18
2. NPM v9

or with nvm ([Node Version Manager](https://github.com/nvm-sh/nvm)),

1. Run `nvm use`.

### Setup

1. Clone or download the repository.
2. Go to the project directory and run `npm install`.
3. Create .env file by copying the .env.example, run `cp .env.example .env`.
4. (Optional) Run services (RabbitMQ, Redis, etc.), run `docker compose -f docker-compose.dev.yml up -d`.
5. Update the database configuration in .env file
6. Migrate the database `npm run migrate -- up` or `./script/migrate.sh up`.

### Usage

#### Run Server (Dev)

1. Run dev server, `npm run dev`.

#### Run Server (Prod)

1. Run dev server, `npm run start`.
