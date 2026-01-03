# Garage Service Management System - Backend Setup

## Table of Contents
1. Prerequisites
2. Python & Django Installation
3. Project Setup
4. Database Configuration
5. Migrations
6. Django REST Framework & Serializers
7. API Views & ViewSets
8. Virtual Environment Setup
9. SimpleJWT Installation
10. Locking Dependencies
11. Create Superuser

---

## Prerequisites
- Python installed
```bash
python --version
```

## Python & Django Installation
1. Install Django:
```bash
pip install django
# or
python -m pip install Django
```
2. Verify Django installation:
```bash
django-admin --version
```

## Project Setup
1. Go to your project folder:
```bash
cd Garage_Service_Management_System
```
2. Create Django backend project:
```bash
python -m django startproject garage_backend
cd garage_backend
```
3. Create main app:
```bash
python manage.py startapp core
```
4. Add the `core` app to `INSTALLED_APPS` in `garage_backend/settings.py`:
```python
INSTALLED_APPS = [
    ...,
    'core',
]
```
5. Create models in `garage_backend/core/models.py` in the following order:
   1. User (custom AbstractUser)
   2. Customer
   3. Vehicle
   4. Service
   5. Booking
   6. Invoice
6. For custom authentication, add after `INSTALLED_APPS` in `settings.py`:
```python
AUTH_USER_MODEL = 'core.User'
```

## Database Configuration
1. Install MySQL client for Python:
```bash
pip install mysqlclient
```
> Without this, Django will raise:
> ```
django.core.exceptions.ImproperlyConfigured
Error loading MySQLdb module
```
2. Create MySQL database:
```sql
CREATE DATABASE garage_service_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```
3. Recommended `DATABASES` configuration in `settings.py`:
```python
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
4. Verify Django can see MySQL:
```bash
python manage.py check
```

## Migrations
1. Create migrations from your models:
```bash
python manage.py makemigrations
```
2. Apply migrations to MySQL:
```bash
python manage.py migrate
```
3. Run the development server:
```bash
python manage.py runserver
```

## Django REST Framework & Serializers
1. Install DRF:
```bash
pip install djangorestframework
```
2. Add to `INSTALLED_APPS`:
```python
INSTALLED_APPS = [
    ...,
    'rest_framework',
]
```
3. Create serializers for all models (`User`, `Customer`, `Vehicle`, `Service`, `Booking`, `Invoice`) to convert model data to JSON.

## API Views & ViewSets
- Use DRF ViewSets for CRUD operations:
  - Combines list, create, retrieve, update, delete
  - Example: `ModelViewSet` automatically provides all operations without writing separate views.

## Virtual Environment Setup (Industry Standard)
1. Create virtual environment (once):
```bash
python -m venv venv
```
2. Activate (every time you work):
```bash
# Windows
venv\Scripts\activate
# Linux / Mac
source venv/bin/activate
#or
.\venv\Scripts\Activate.ps1
```
3. Install dependencies inside venv:
```bash
pip install django mysqlclient python-dotenv djangorestframework djangorestframework-simplejwt
```
4. Run Django inside venv:
```bash
python manage.py runserver
```
5. Confirm you are using venv:
```bash
where python   # should point to ...\venv\Scripts\python.exe
```

## SimpleJWT Installation
1. Install JWT authentication:
```bash
pip install djangorestframework-simplejwt
```
2. Verify installation:
```bash
python -c "import rest_framework_simplejwt; print('OK')"
# Output: OK
```

## Locking Dependencies
1. Create `requirements.txt` to lock dependencies:
```bash
pip freeze > requirements.txt
```
2. To recreate the same environment:
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Create Superuser
1. Run:
```bash
python manage.py createsuperuser
```
2. Enter credentials:
- Username: `admin`
- Email: `kindloop.org@gmail.com`
- Password: `admin123`
3. Authentication is JWT-based.

