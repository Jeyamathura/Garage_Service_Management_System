
----------

# Garage Service Management System - Backend Setup

## Technology Stack

-   **Python 3.10+**

-   **Django**
    
-   **Django REST Framework (DRF)**
    
-   **MySQL**
    
-   **JWT Authentication (djangorestframework-simplejwt)**
    
-   **CORS Headers (Frontend Integration)**
    

----------
## 📑 Table of Contents

0.  Purpose of This Document    

1.  Prerequisites
    
2.  Virtual Environment Setup
    
3.  Python & Django Installation
    
4.  Project Initialization
    
5.  Application Structure
    
6.  Custom User Model & Role Management
    
7.  Database Configuration (MySQL)
    
8.  Migrations
    
9.  Django REST Framework (DRF) & Serializers
    
10.  API Views & ViewSets
    
11.  JWT Authentication (SimpleJWT)
    
12.  Customer Registration Flow
    
13.  Superuser / Admin Setup
    
14.  CORS Configuration (Frontend Integration)
    
15.  Locking Dependencies (`requirements.txt`)
    
16.  System Verification Checklist
    

## 0. Purpose of This Document

This guide explains exactly how to set up the backend for the Garage Service Management System using:

-   Django

-   Django REST Framework (DRF)

-   MySQL

-   JWT Authentication (SimpleJWT)

-   CORS for frontend integration

It assumes no prior Django project exists.
----------

## 1. Prerequisites

Ensure the following are installed:

-   Python **3.10+**
    
-   MySQL Server
    
-   `pip` (Python package manager)
    

Verify Python installation:

```bash
python --version

```

> Recommended: Ensure `pip` is up to date:

```bash
python -m pip install --upgrade pip

```

----------

## 2. Virtual Environment Setup

Create a **virtual environment** (isolated Python environment for your project):

```bash
python -m venv venv

```

Activate the environment:

```bash
# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

# PowerShell alternative
.\venv\Scripts\Activate.ps1

```

Confirm Python points to venv:

```bash
where python   # Windows
which python   # Linux/macOS

```

----------

## 3. Python & Django Installation

Install Django and essential packages:

```bash
pip install django djangorestframework python-dotenv

```

Verify Django installation:

```bash
django-admin --version

```

----------

## 4. Project Initialization

1.  Navigate to your project folder:
    

```bash
cd Garage_Service_Management_System

```

2.  Create Django backend project:
    

```bash
django-admin startproject garage_backend
cd garage_backend

```

3.  Create main app:
    

```bash
python manage.py startapp core

```

4.  Add the app to `INSTALLED_APPS` in `garage_backend/settings.py`:
    

```python
INSTALLED_APPS = [
    ...,
    'core',
    'rest_framework',
]

```

----------

## 5. Application Structure

```
garage_backend/
│
├── garage_backend/
│   ├── settings.py
│   ├── urls.py
│   └── __init__.py
│
├── core/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── permissions.py
│   ├── urls.py
│   └── __init__.py
│
└── manage.py

```

----------

## 6. Custom User Model & Role Management

1.  Extend `AbstractUser` to create a **custom User model** in `core/models.py`.
    
2.  Define **user roles**:
    

```python
ROLE_CHOICES = (
    ('ADMIN', 'Admin'),
    ('CUSTOMER', 'Customer'),
)

```

3.  Add to `settings.py`:
    

```python
AUTH_USER_MODEL = 'core.User'

```

> Benefits:
> 
> -   Email, first/last names preserved
>     
> -   JWT authentication works seamlessly
>     
> -   Role-based access enforced
>     

----------

## 7. Database Configuration (MySQL)

### 7.1 Install MySQL Client

Django **requires a Python MySQL driver** to talk to MySQL:

```bash
pip install mysqlclient

```

> Without this, Django will raise:
> 
> ```
> django.core.exceptions.ImproperlyConfigured: Error loading MySQLdb module
> 
> ```

### 7.2 Create Database

```sql
CREATE DATABASE garage_service_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

```

### 7.3 Configure `settings.py`

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

### 7.4 Verify Connection

```bash
python manage.py check

```

----------

## 8. Migrations

1.  Create migrations from your models:
    

```bash
python manage.py makemigrations

```

2.  Apply migrations to the database:
    

```bash
python manage.py migrate

```

3.  Start development server:
    

```bash
python manage.py runserver

```

----------

## 9. Django REST Framework (DRF) & Serializers

1.  Create **serializers** for each model to convert ORM objects to JSON:
    

-   `UserSerializer`
    
-   `CustomerSerializer`
    
-   `VehicleSerializer`
    
-   `ServiceSerializer`
    
-   `BookingSerializer`
    
-   `InvoiceSerializer`
    

2.  Add DRF settings in `settings.py` (already included in `INSTALLED_APPS`):
    

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

```

----------

## 10. API Views & ViewSets

-   Use DRF **`ModelViewSet`** for CRUD:
    

```python
from rest_framework import viewsets
from .models import Vehicle
from .serializers import VehicleSerializer

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

```

-   Automatically provides: `list`, `create`, `retrieve`, `update`, `delete`.
    
-   Route in `core/urls.py`:
    

```python
from rest_framework.routers import DefaultRouter
from .views import VehicleViewSet

router = DefaultRouter()
router.register('vehicles', VehicleViewSet)
urlpatterns = router.urls

```

-   Include in project-level `urls.py`:
    

```python
path('api/', include('core.urls')),

```

----------

## 11. JWT Authentication (SimpleJWT)

1.  Install:
    

```bash
pip install djangorestframework-simplejwt

```

2.  Add JWT authentication class in `settings.py` (already added in DRF settings above).
    
3.  JWT endpoints:
    

```python
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

path('api/token/', TokenObtainPairView.as_view()),
path('api/token/refresh/', TokenRefreshView.as_view()),

```

> Custom token view can also return **user role** along with access/refresh tokens.

----------

## 12. Customer Registration Flow

-   Customers **do not manually create accounts**.
    
-   Registration endpoint:
    

```http
POST /auth/register/

```

-   Internal workflow:
    

1.  Creates `User` with role `CUSTOMER`
    
2.  Links `Customer` profile
    
3.  Returns JWT tokens for immediate login
    

----------

## 13. Superuser / Admin Setup

```bash
python manage.py createsuperuser

```

-   Example credentials:
    
    -   Username: `admin`
        
    -   Email: `kindloop.org@gmail.com`
        
    -   Password: `admin123`
        
-   Admin can:
    
    -   Manage users and customers
        
    -   View all bookings
        
    -   Create services
        
    -   Generate invoices
        

----------

## 14. CORS Configuration (Frontend Integration)

1.  Install package:
    

```bash
pip install django-cors-headers

```

2.  Add to `INSTALLED_APPS`:
    

```python
'corsheaders',

```

3.  Add middleware (must be **first**):
    

```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    ...
]

```

4.  Allow frontend origin (development):
    

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

```

> Optional shortcut (development only):

```python
CORS_ALLOW_ALL_ORIGINS = True

```

----------

## 15. Locking Dependencies

1.  Freeze installed packages:
    

```bash
pip freeze > requirements.txt

```

2.  Recreate environment later:
    

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

```

----------

## 16. System Verification Checklist

✔ Custom user model enabled  
✔ MySQL connection verified (`mysqlclient` installed)  
✔ JWT authentication functional  
✔ Role-based access enforced (`ADMIN` / `CUSTOMER`)  
✔ Customer self-registration working  
✔ Admin-only endpoints protected  
✔ DRF serializers and ViewSets functional  
✔ API routing complete  
✔ CORS configured correctly  
✔ Frontend-ready REST API

----------