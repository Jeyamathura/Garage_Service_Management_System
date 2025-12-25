Check Python Installation
	python --version

Install Django
	pip install django
	or
	python -m pip install Django

Verify Django Installation
	django-admin --version

Go to the Project Folder
	cd Garage_Service_Management_System

Create Django Project (Backend)
	python -m django startproject garage_backend

Enter Project Directory - garage_backend
	cd garage_backend

Create Main App
	python manage.py startapp core

Add the 'core' app to garage_backend/garage_backend/INSTALLED_APPS

In garage_backend\core\models.py
	from django.db import models
	add from django.utils import timezone

Add the models in garage_backend\core\models.py in the following order
	1.User
	2.Customer
	3.Vehicle
	4.Service
	5.Booking
	6.Invoice

For authentication AbstractUser is used, and there is a custom logic on top.
Add AUTH_USER_MODEL = 'core.User' after INSTALLED_APPS in settings.py

-------------------------------------------------------------------------------
DATABASE CONNECTION
-------------------------------------------------------------------------------
To connect to MySQL, we need to install MySQL client for Python
	pip install mysqlclient

Without installing MySQL client, you will get an error
	django.core.exceptions.ImproperlyConfigured
	Error loading MySQLdb module

SQL query for creating Database in MySQL:
CREATE DATABASE garage_service_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

Some best practices:
	1.Add OPTIONS
		MySQL + Django works best with explicit SQL mode.
		Prevents silent data truncation
		Enforces stricter validation
		'OPTIONS': {
   			'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
		}
	2.Use UTF-8 explicitly
		This avoids encoding issues later (especially with React input).
		'OPTIONS': {
    		'charset': 'utf8mb4',
		}

Recommended development configuration: (Replace the USER, PASSWORD if it varies from yours)
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
--------------------------------------------------------------------------------

Verify Django can see MySQL
	python manage.py check

Create migrations from your models
	cd garage_backend
	python manage.py makemigrations

Apply migrations to MySQL
	python manage.py migrate

Run the Django development server
	python manage.py runserver

