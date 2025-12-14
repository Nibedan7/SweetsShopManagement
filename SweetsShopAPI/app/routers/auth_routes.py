from datetime import timedelta
from fastapi import Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.crudoperation import user_crud
from app import auth
from app.schemas.auth_schemas import Token
from app.schemas.auth_schemas import User as AuthUserSchema
from app.schemas.auth_schemas import UserCreate as AuthUserCreateSchema
from app.database import get_db

router = APIRouter(
    prefix="/api/auth",
    tags=["Auth"]
)

# Authentication Endpoints
@router.post("/register", response_model=AuthUserSchema)
def register_user(
    user: AuthUserCreateSchema,
    is_admin: bool = False,
    db: Session = Depends(get_db)
):
    db_user = user_crud.get_user_by_username(db, user.username)
    db_user_email = user_crud.get_user_by_email(db, user.email)

    if db_user or db_user_email:
        raise HTTPException(status_code=400, detail="User already registered")

    return user_crud.create_user(db=db, user=user, is_admin=is_admin)


@router.post("/login", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = user_crud.get_user_by_username(db, username=form_data.username)
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

