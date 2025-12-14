from datetime import timedelta
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from . import models, schemas, crud, auth
from .database import get_db
from .database import engine, Base
from . import models

# Create the database tables
# models.Base.metadata.create_all(bind=auth.engine)
# Create tables if they don't exist
models.Base.metadata.create_all(bind=engine)
# Base.metadata.create_all(bind=engine)
app = FastAPI()

# Authentication Endpoints
@app.post("/api/auth/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, is_admin: bool = False, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    db_user_email = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user or db_user_email:
        raise HTTPException(status_code=400, detail="User already registered")
    return crud.create_user(db=db, user=user, is_admin=is_admin)

@app.post("/api/auth/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer","user": user }


# Sweet Endpoints
@app.post("/api/sweets/", response_model=schemas.Sweet)
def create_sweet(sweet: schemas.SweetCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.create_sweet(db=db, sweet=sweet)

@app.get("/api/sweets/", response_model=list[schemas.Sweet])
def read_sweets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    sweets = crud.get_sweets(db, skip=skip, limit=limit)
    return sweets

@app.get("/api/sweets/search", response_model=list[schemas.Sweet])
def search_sweets(
    name: str = None, category: str = None, min_price: float = None, max_price: float = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Sweet)
    if name:
        query = query.filter(models.Sweet.name.contains(name))
    if category:
        query = query.filter(models.Sweet.category == category)
    if min_price:
        query = query.filter(models.Sweet.price >= min_price)
    if max_price:
        query = query.filter(models.Sweet.price <= max_price)
    return query.all()

@app.put("/api/sweets/{sweet_id}", response_model=schemas.Sweet)
def update_sweet(sweet_id: int, sweet: schemas.SweetBase, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_sweet = crud.update_sweet(db, sweet_id=sweet_id, sweet=sweet)
    if db_sweet is None:
        raise HTTPException(status_code=404, detail="Sweet not found")
    return db_sweet

@app.delete("/api/sweets/{sweet_id}")
def delete_sweet(sweet_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin_user)):
    db_sweet = crud.delete_sweet(db, sweet_id=sweet_id)
    if db_sweet is None:
        raise HTTPException(status_code=404, detail="Sweet not found")
    return {"message": "Sweet deleted successfully"}

# Inventory Endpoints
@app.post("/api/sweets/{sweet_id}/purchase", response_model=schemas.Sweet)
def purchase_item(sweet_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_sweet = crud.purchase_sweet(db, sweet_id=sweet_id)
    if db_sweet is None:
        raise HTTPException(status_code=400, detail="Sweet not found or out of stock")
    return db_sweet

@app.post("/api/sweets/{sweet_id}/restock", response_model=schemas.Sweet)
def restock_item(sweet_id: int, quantity: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_admin_user)):
    db_sweet = crud.restock_sweet(db, sweet_id=sweet_id, quantity=quantity)
    if db_sweet is None:
        raise HTTPException(status_code=404, detail="Sweet not found")
    return db_sweet