---

# Garage Backend – Django Setup

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

```
CREATE DATABASE garage_service_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

* Configure database settings in `settings.py`
-	Edit this if there're any changes
```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'garage_service_db',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            'charset': 'utf8mb4',
        },
    }
}

```
* Verify Connection

```
python manage.py check
```
---

## Migrations

* Create migrations from your models:

```
python manage.py makemigrations
```

* Apply migrations to the database:

```
python manage.py migrate
```

---

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

---

## Troubleshooting

* If `where python` does not point to `venv`, re-activate the virtual environment.

---
