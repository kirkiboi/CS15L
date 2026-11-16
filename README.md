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

## Contributing Guidelines

To keep the project organized and avoid conflicts between contributors, all changes must be submitted through a Pull Request (PR). **Please do not push directly to the `main` branch.**

### 1. Get the latest changes

Before starting new work, switch to `main` and pull the latest updates:

```bash
git switch main
git pull origin main
```

### 2. Create a new branch

Create a separate branch for each feature, bug fix, or task. Do not work directly on `main`. Also, kindly use conventional branch naming.

```bash
git switch -c type/short-description
```

Use these branch naming conventions:

| Prefix | Purpose | Example |
|---|---|---|
| `feat/` | New features | `feat/email-otp` |
| `fix/` | Bug fixes | `fix/login-validation` |
| `style/` | Styling and UI changes | `style/navbar-layout` |
| `docs/` | Documentation changes | `docs/update-readme` |
| `refactor/` | Code improvements | `refactor/user-controller` |
| `chore/` | Maintenance and configuration | `chore/update-dependencies` |

### 3. Make and test your changes

Work on your assigned task and test your changes locally.

Before committing, run the project's checks:

```bash
npm run check
npm run build
```

If you modified backend functionality, also run the relevant tests:

```bash
php artisan test
```

Fix issues if there are any found.

### 4. Commit your changes

Stage the files you want to include:

```bash
git add .
```

Commit with a short, descriptive message:

```bash
git commit -m "feat: add email OTP verification"
```

Recommended commit message prefixes:

- `feat:` - New feature
- `fix:` - Bug fix
- `style:` - Formatting or styling changes
- `docs:` - Documentation changes
- `refactor:` - Code restructuring
- `test:` - Test additions or updates
- `chore:` - Maintenance and configuration

### 5. Push your branch

Push your branch and set its upstream:

```bash
git push -u origin your-branch-name
```

For subsequent pushes to the same branch, simply run:

```bash
git push
```

### 6. Create a Pull Request

On GitHub:

1. Open the repo.
2. Select **Compare & pull request**
3. Set the base branch to `main`.
4. Set the compare branch to your feature branch.
5. Add a descriptive title and explain what you changed.
6. Create the Pull Request.

### 7. Merge the Pull Request

Merge the PR into `main`.

Use **Squash and merge** when available to keep the main branch history clean.

### 9. Update your local repository

After your PR has been merged, update your local `main` branch:

```bash
git switch main
git pull origin main
```

You can then delete your completed local feature branch:

```bash
git branch -d your-branch-name
```

---
