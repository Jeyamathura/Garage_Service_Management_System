---
# Garage Backend Setup (Django)
---

This repository contains the backend setup for a Django-based project using:

* Django
* Django REST Framework
* MySQL (optional)
* JWT Authentication
* CORS support

---

## Prerequisites

Ensure the following are installed:

* Python **3.10+**
* pip (comes with Python)
* VS Code (recommended)

Verify Python:

```bash
python --version
```

---

## Step 1: Upgrade pip

```bash
python -m pip install --upgrade pip
```

---

## Step 2: Create and Activate Virtual Environment

Create virtual environment:

```bash
python -m venv venv
```

Activate it (Windows):

```bash
venv\Scripts\activate
```

Confirm Python path:

```bash
where python
```

You should see the Python path pointing to the `venv` directory.

---

## Step 3: Install Core Dependencies

```bash
pip install django djangorestframework python-dotenv
```

Verify Django installation:

```bash
django-admin --version
```

---

## Step 4: Navigate to Django Project

```bash
cd garage_backend
```

---

## Step 5: Install Database & Auth Dependencies

### MySQL Driver

```bash
pip install mysqlclient
```

> If this fails on Windows, you can use `pymysql` as a fallback.
```bash
pip install pymysql
```
> Modify garage_backend/_init_.py
> Open: garage_backend/_init_.py

> Add:
> ```bash
> import pymysql
> pymysql.install_as_MySQLdb()
>```
---

### JWT Authentication

```bash
pip install djangorestframework-simplejwt
```

---

### CORS Headers

```bash
pip install django-cors-headers
```

---

## Installed Packages Summary

* `django`
* `djangorestframework`
* `python-dotenv`
* `mysqlclient`
* `djangorestframework-simplejwt`
* `django-cors-headers`

---

## Create Database in MySQL

```sql
CREATE DATABASE garage_service_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

### Configure Database Settings

```bash
import os
```

create the env file, you can rename the .env.example to .env and edit the database details.

> **Structure of `.env`:**
> ```env
> DB_NAME=garage_service_db
> DB_USER=root
> DB_PASSWORD=your_db_password
> DB_HOST=localhost
> DB_PORT=3306
> ```

### Verify Database Connection

```bash
python manage.py check
```

---

## Migrations

Create migrations from your models:

```bash
python manage.py makemigrations
```

Apply migrations to the database:

```bash
python manage.py migrate
```

---

## Create Superuser (Admin Setup)

Create an admin (superuser) account to manage the application via the Django Admin panel.

```bash
python manage.py createsuperuser
```

Follow the terminal prompts.

### Example Credentials (Development Only)

```
Username: admin
Email: kindloop.org@gmail.com
Password: admin123
```

> **Warning:**
> These credentials are intended for **local development only**.

---

## xhtml to pdf

```bash
pip install xhtml2pdf

```

## Run Development Server

```bash
python manage.py runserver
```

Open in browser:

```
http://127.0.0.1:8000/
```

---


## Notes

* Always activate the virtual environment before running Django commands.
* Create a superuser to manage models and users through the Django Admin interface.

---

## Troubleshooting

* If `where python` does not point to `venv`, re-activate the virtual environment.
* If MySQL connection fails, verify credentials and that the MySQL service is running.

---

# Garage Frontend Setup (React)

---
### Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### Step 1: Install Dependencies

```bash
cd garage_frontend
npm install
```

### Step 2: Start Development Server

```bash
npm start
```
The application will be available at [http://localhost:3000](http://localhost:3000).
