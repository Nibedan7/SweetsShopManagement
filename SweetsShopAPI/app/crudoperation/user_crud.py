from sqlalchemy.orm import Session
from app.models.auth_model import User as AuthUser
from app.schemas.auth_schemas import UserCreate as AuthUserCreate
from app.auth import get_password_hash

def get_user(db: Session, user_id: int):
    return db.query(AuthUser).filter(AuthUser.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(AuthUser).filter(AuthUser.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(AuthUser).filter(AuthUser.username == username).first()

def create_user(db: Session, user: AuthUserCreate, is_admin: bool = False):
    hashed_password = get_password_hash(user.password)
    db_user = AuthUser(full_name =user.full_name,username=user.username,email = user.email, hashed_password=hashed_password, is_admin=is_admin)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user






