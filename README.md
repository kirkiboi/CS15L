# LetMeSee — Camera Rental Marketplace System

LetMeSee is a web-based camera rental marketplace designed to connect camera equipment owners with people who want to rent photography equipment. This is merely a school project in compliance to a course.

## Tech Stack

- **Backend:** PHP 8.3+ and Laravel
- **Frontend:** React, TypeScript, Inertia.js
- **Styling:** Tailwind CSS
- **Build tools:** Node.js, npm, Laravel Vite tooling
- **Database:** MySQL
- **Dependency management:** Composer and npm

> Versions and requirements should be kept consistent with the project's `composer.json` and `package.json`.

## Prerequisites

Install the following on your development machine:

1. **Git** 
2. **PHP** - please make sure that the version is compatible with the project's Composer requirements.
3. **Composer** 
4. **Node.js and npm** 
5. **MySQL** 
6. **Laragon (recommended for Windows)** 

### 1. Clone the repository

Open a terminal in the directory where you want to store the project, then run:

```bash
git clone https://github.com/kirkiboi/CS15L.git
cd CS15L
```

### 2. Install PHP dependencies

```bash
composer install
```

### 3. Install frontend dependencies

```bash
npm install
```

### 4. Configure environment variables

Create your local environment file by copying the example:

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS/Linux:**

```bash
cp .env.example .env
```

### 5. Generate the application key

```bash
php artisan key:generate
```

### 6. Create a local MySQL database

Using Laragon or your preferred MySQL client, create a database named:

```text
letmesee
```

Update the database settings in your local `.env` file:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=letmesee
DB_USERNAME=root
DB_PASSWORD=
```

These values above are examples for a typical local Laragon setup. Use the username and password configured on your own machine.

### 7. Run database migrations

Make sure MySQL is running, then execute:

```bash
php artisan migrate
```

This creates the database tables defined by the project's migrations.

### 8. Build frontend assets

```bash
npm run build
```

### 9. Start the application

```bash
php artisan serve
```

Open the local URL printed by Laravel, usually:

```text
http://127.0.0.1:8000
```

## Development Mode

For frontend development with automatic asset rebuilding, open a second terminal in the project directory and run:

```bash
npm run dev
```

Keep that terminal running while developing. In the first terminal, run:

```bash
php artisan serve
```

Visit the local URL printed by Laravel.

## Common Setup Issues

### PHP dependencies are missing

If Laravel reports that `vendor/autoload.php` cannot be found, run:

```bash
composer install
```

### Frontend dependencies or build tools are missing

If the frontend build fails because a command or package is missing, run:

```bash
npm install
npm run build
```

### Database connection fails

Check that:

- MySQL is running.
- The database exists.
- The database settings in `.env` are correct.
- The configured MySQL user has permission to access the database.

### Application key is missing

Run:

```bash
php artisan key:generate
```

### Database schema is outdated

If new migrations have been added to the repository, run:

```bash
php artisan migrate
```