from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db
from app.crudoperation.sweets_crud import create_sweet
from app.schemas.sweets_chemas import SweetCreate as SweetCreateSchema

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_create_tables():
    SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db" 
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    
    Base.metadata.create_all(bind=engine)
    assert True
    
def test_create_sweet():

    login_response = client.post(
        "/api/auth/login",
        data={"username": "logintest", "password": "loginpassword"}
    )
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.post(
        "/api/sweets/",
        json={"name": "Chocolate Bar", "category": "Candy", "price": 1.5, "quantity": 100},
        headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Chocolate Bar"
    assert data["quantity"] == 100

def test_read_sweets():
    db = TestingSessionLocal()
    create_sweet(db, SweetCreateSchema(name="Gummy Bears", category="Gummy", price=2.0, quantity=50))
    db.close()

    response = client.get("/api/sweets/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(sweet['name'] == "Gummy Bears" for sweet in data)

def test_unauthorized_create_sweet():
    response = client.post(
        "/api/sweets/",
        json={"name": "Lollipop", "category": "Candy", "price": 0.5, "quantity": 200}
    )
    assert response.status_code == 401 