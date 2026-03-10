# Exercise 6 — Simple REST API (Python + Flask)

A complete REST API built with **Python** and **Flask** implementing all 4 CRUD operations.

## Features

- **GET** `/items` — Retrieve all items
- **POST** `/items` — Add a new item
- **PUT** `/items/<id>` — Update an existing item
- **DELETE** `/items/<id>` — Delete an item

## Tech Stack

- Python 3.12
- Flask 3.1

## Setup

```bash
python -m venv venv
source venv/bin/activate    # macOS/Linux
venv\Scripts\activate       # Windows
pip install flask
```

## Run

```bash
python app.py
```

Server starts at: **http://127.0.0.1:5000**

## API Endpoints

| Method | URL | Body | Description |
|--------|-----|------|-------------|
| GET | `/items` | — | Get all items |
| POST | `/items` | `{"id": "3", "value": "Item Three"}` | Add item |
| PUT | `/items/3` | `{"value": "Updated"}` | Update item |
| DELETE | `/items/3` | — | Delete item |

## Files

- `app.py` — Basic REST API with CRUD endpoints
- `app_extended.py` — Extended version with input validation, error handling, and proper HTTP status codes
