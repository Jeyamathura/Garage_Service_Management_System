---
# Garage Service Management System
---

## Overview

This repository contains the backend and frontend setup for the **Garage Service Management System**.

### Backend Stack

* Django
* Django REST Framework
* MySQL
* JWT Authentication
* CORS Support

### Frontend Stack

* React
* Node.js / npm

---

# Backend Setup (Django)

## Prerequisites

Ensure the following are installed:

* **Python**: 3.10+
* **pip** (comes with Python)
* **Git**
* **VS Code** (recommended)
* **MySQL Server** (optional)

Verify Python installation:

```bash
python --version
```

---

## Step 1: Clone the Repository

### Using GitHub Desktop (Recommended)

```
https://github.com/Jeyamathura/Garage_Service_Management_System.git
```

### Using Terminal

```bash
git clone https://github.com/Jeyamathura/Garage_Service_Management_System.git
```

---

## Step 2: Upgrade pip

```bash
python -m pip install --upgrade pip
```

---

## Step 3: Create and Activate Virtual Environment

Create virtual environment:

```bash
python -m venv venv
```

Activate (Windows):

```bash
venv\Scripts\activate
```

Verify active environment:

```bash
where python
```

---

## Step 4: Navigate to Backend Directory

```bash
cd garage_backend
```

---

## Step 5: Install Dependencies

> ✅ **Recommended (Quick Start)**
>
> Install all backend dependencies at once using `requirements.txt`:
>
> ```bash
> pip install -r requirements.txt
> ```

---

### Manual Installation (Alternative)

If you prefer to install packages individually:

```bash
pip install django djangorestframework python-dotenv
```

Verify Django:

```bash
django-admin --version
```

---

## Step 6: Install Database & Authentication Dependencies

### MySQL Driver

Recommended:

```bash
pip install mysqlclient
```

If installing the MySQL Driver fails, Fallback (Windows):

```bash
pip install pymysql
```

Edit `garage_backend/__init__.py`:

```python
import pymysql
pymysql.install_as_MySQLdb()
```

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

### PDF Generation

```bash
pip install xhtml2pdf
```

---

## Installed Packages Summary

* django
* djangorestframework
* python-dotenv
* mysqlclient or pymysql
* djangorestframework-simplejwt
* django-cors-headers
* xhtml2pdf

---

## Step 7: Database Setup (MySQL)

Create database:

```sql
CREATE DATABASE garage_service_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

---

## Environment Configuration

Rename `.env.example` to `.env` and update values:

```env
DB_NAME=garage_service_db
DB_USER=root
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=3306
```

Verify database connection:

```bash
python manage.py check
```

---

## Step 8: Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## Step 9: Create Superuser

```bash
python manage.py createsuperuser
```

Example (development only):

```
Username: admin
Email: kindloop.org@gmail.com
Password: admin123
```

> ⚠️ Do not use these credentials in production.

---

## Step 10: Run Development Server

```bash
python manage.py runserver
```

Backend:

```
http://127.0.0.1:8000/
```

Admin Panel:

```
http://127.0.0.1:8000/admin/
```

---

## Backend Notes

* Always activate the virtual environment before running Django commands
* Ensure MySQL service is running
* Store sensitive values in `.env`

---

## Backend Troubleshooting

* **Wrong Python Path**: Re-activate the virtual environment
* **MySQL Connection Error**: Check credentials and service status

---

# Frontend Setup (React)

## Prerequisites

* **Node.js**: v18.x or higher
* **npm**: v9.x or higher

Verify:

```bash
node -v
npm -v
```

---

## Step 1: Install Dependencies

```bash
cd garage_frontend
npm install
```

---

## Step 2: Start Development Server

```bash
npm start
```

Frontend URL:

```
http://localhost:3000
```

---

## Final Notes

* Start backend before frontend
* Ensure API URLs match backend configuration
* Use environment variables for configuration
