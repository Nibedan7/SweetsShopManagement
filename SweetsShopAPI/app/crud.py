from sqlalchemy.orm import Session
from . import models, schemas
from .auth import get_password_hash

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate, is_admin: bool = False):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(full_name =user.full_name,username=user.username,email = user.email, hashed_password=hashed_password, is_admin=is_admin)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_sweets(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Sweet).offset(skip).limit(limit).all()

def create_sweet(db: Session, sweet: schemas.SweetCreate):
    db_sweet = models.Sweet(**sweet.dict())
    db.add(db_sweet)
    db.commit()
    db.refresh(db_sweet)
    return db_sweet

def get_sweet_by_id(db: Session, sweet_id: int):
    return db.query(models.Sweet).filter(models.Sweet.id == sweet_id).first()

def update_sweet(db: Session, sweet_id: int, sweet: schemas.SweetBase):
    db_sweet = db.query(models.Sweet).filter(models.Sweet.id == sweet_id).first()
    if db_sweet:
        for key, value in sweet.dict().items():
            setattr(db_sweet, key, value)
        db.commit()
        db.refresh(db_sweet)
    return db_sweet

def delete_sweet(db: Session, sweet_id: int):
    db_sweet = db.query(models.Sweet).filter(models.Sweet.id == sweet_id).first()
    if db_sweet:
        db.delete(db_sweet)
        db.commit()
    return db_sweet

def purchase_sweet(db: Session, sweet_id: int, quantity: int = 1):
    db_sweet = db.query(models.Sweet).filter(models.Sweet.id == sweet_id).first()
    if not db_sweet or db_sweet.quantity < quantity:
        return None 
    db_sweet.quantity -= quantity
    db.commit()
    db.refresh(db_sweet)
    return db_sweet

def restock_sweet(db: Session, sweet_id: int, quantity: int):
    db_sweet = db.query(models.Sweet).filter(models.Sweet.id == sweet_id).first()
    if db_sweet:
        db_sweet.quantity += quantity
        db.commit()
        db.refresh(db_sweet)
    return db_sweet