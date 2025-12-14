# 🍬 SweetsShopManagement

A **full‑stack Sweet Shop Management System** built as part of a **TDD Kata assessment**, demonstrating clean architecture, Test‑Driven Development, secure authentication, and modern frontend practices.

This project allows users to browse, search, and purchase sweets, while admin users can manage inventory (add, update, delete, restock sweets).

---

## 📌 Tech Stack

### Backend

* **Framework:** FastAPI (Python)
* **Database:** SQLite (Persistent DB)
* **ORM:** SQLAlchemy
* **Migrations:** Alembic
* **Authentication:** JWT (JSON Web Tokens)
* **Testing:** Pytest
* **Architecture:** Clean architecture with repository pattern

### Frontend

* **Framework:** React
* **State Management:** React Hooks
* **API Communication:** Axios
* **Styling:** CSS / modern UI components

---

## ✨ Features

### 👤 Authentication

* User registration
* User login
* JWT‑based authentication
* Role‑based access (User / Admin)

### 🍭 Sweets Management (Protected)

* Add new sweets (Admin only)
* View all sweets
* Search sweets by:

  * Name
  * Category
  * Price range
* Update sweet details (Admin only)
* Delete sweets (Admin only)

### 📦 Inventory Management

* Purchase sweets (quantity decreases)
* Restock sweets (Admin only)
* Purchase button disabled when stock is zero


---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Nibedan7/SweetsShopManagement.git
cd SweetsShopManagement
```

---

## ⚙️ Backend Setup (FastAPI)

### Create Virtual Environment

```bash
cd SweetsShopAPI
python -m venv venv
source venv/bin/activate   # Linux / Mac
venv\Scripts\activate      # Windows
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Database Migrations

```bash
alembic upgrade head
```

### Start Backend Server

```bash
uvicorn app.main:app --reload
```

📍 Backend will run at:

```
http://127.0.0.1:8000
```

📘 Swagger Docs:

```
http://127.0.0.1:8000/docs
```

---

## 🧪 Running Tests (TDD)

```bash
pytest -v
```

✔️ Tests cover:

* Authentication
* Sweets CRUD operations
* Inventory purchase & restock logic
* Authorization rules

---

## 🎨 Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

📍 Frontend runs at:

```
http://localhost:3000
```

---

## 🔐 API Endpoints Overview

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### Sweets (Protected)

* `POST /api/sweets`
* `GET /api/sweets`
* `GET /api/sweets/search`
* `PUT /api/sweets/{id}`
* `DELETE /api/sweets/{id}` (Admin only)

### Inventory

* `POST /api/sweets/{id}/purchase`
* `POST /api/sweets/{id}/restock` (Admin only)

---

## 🧠 Test‑Driven Development (TDD)

This project strictly follows **Red → Green → Refactor**:

1. Write failing tests first
2. Implement minimum logic to pass tests
3. Refactor for clean code

Git commit history reflects this workflow clearly.

---

## 🤖 My AI Usage

### AI Tools Used

* **ChatGPT**
* **GLM 4.6**

### How I Used AI

* Generated initial project structure ideas
* Assisted in writing unit tests for FastAPI services
* Helped debug SQLAlchemy & JWT issues
* Refined API design and repository pattern
* Improved README documentation clarity

### Reflection

AI significantly improved my productivity by reducing boilerplate effort and speeding up debugging. However, all business logic, architecture decisions, and final implementations were carefully reviewed, modified, and validated by me to ensure correctness and originality.

---

## 📸 Screenshots

*(Add screenshots of login, dashboard, admin panel, purchase flow here)*

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgements

* FastAPI & React documentation
* Pytest community
* AI tools that enhanced development productivity

---

## 📬 Contact

**Nibedan Pattanaik**
📧 Email: [nibedanpattanaik6@gmail.com](mailto:nibedanpattanaik6@gmail.com)
🔗 LinkedIn: [https://linkedin.com/in/nibedan-pattanaik7](https://linkedin.com/in/nibedan-pattanaik7)
