
from datetime import timedelta
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.crudoperation import sweets_crud
from app import auth

from app.schemas.sweets_chemas import Sweet as SweetSchema
from app.schemas.sweets_chemas import SweetCreate as SweetCreateSchema
from app.schemas.sweets_chemas import SweetBase as SweetBaseSchema
from app.models.auth_model import User as AuthUserModel
from app.models.sweets_model import Sweet as SweetModel

from app.database import get_db
from app.database import engine, Base
from app.models.sweets_model import Sweet
from fastapi import APIRouter

router = APIRouter(
    prefix="/api/sweets",
    tags=["Sweets"]
)

@router.post("/", response_model=SweetSchema)
def create_sweet(sweet: SweetCreateSchema, db: Session = Depends(get_db), current_user: AuthUserModel = Depends(auth.get_current_user)):
    return sweets_crud.create_sweet(db=db, sweet=sweet)

@router.get("/", response_model=list[SweetSchema])
def read_sweets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    sweets = sweets_crud.get_sweets(db, skip=skip, limit=limit)
    return sweets

@router.get("/search", response_model=list[SweetSchema])
def search_sweets(
    name: str = None, category: str = None, min_price: float = None, max_price: float = None,
    db: Session = Depends(get_db)
):
    query = db.query(SweetModel)
    if name:
        query = query.filter(SweetModel.name.contains(name))
    if category:
        query = query.filter(SweetModel.category == category)
    if min_price:
        query = query.filter(SweetModel.price >= min_price)
    if max_price:
        query = query.filter(SweetModel.price <= max_price)
    return query.all()

@router.put("/{sweet_id}", response_model=SweetSchema)
def update_sweet(sweet_id: int, sweet: SweetBaseSchema, db: Session = Depends(get_db), current_user: AuthUserModel = Depends(auth.get_current_user)):
    db_sweet = sweets_crud.update_sweet(db, sweet_id=sweet_id, sweet=sweet)
    if db_sweet is None:
        raise HTTPException(status_code=404, detail="Sweet not found")
    return db_sweet

@router.delete("/{sweet_id}")
def delete_sweet(sweet_id: int, db: Session = Depends(get_db), current_user:AuthUserModel = Depends(auth.get_current_admin_user)):
    db_sweet = sweets_crud.delete_sweet(db, sweet_id=sweet_id)
    if db_sweet is None:
        raise HTTPException(status_code=404, detail="Sweet not found")
    return {"message": "Sweet deleted successfully"}


@router.post("/{sweet_id}/purchase", response_model=SweetSchema)
def purchase_item(
    sweet_id: int,
    quantity: int = 1,
    db: Session = Depends(get_db),
    current_user: AuthUserModel = Depends(auth.get_current_user),
):
    db_sweet = sweets_crud.purchase_sweet(db, sweet_id, quantity)
    if db_sweet is None:
        raise HTTPException(status_code=400, detail="Sweet not found or out of stock")
    return db_sweet


@router.post("/{sweet_id}/restock", response_model=SweetSchema)
def restock_item(sweet_id: int, quantity: int, db: Session = Depends(get_db), current_user:AuthUserModel = Depends(auth.get_current_admin_user)):
    db_sweet = sweets_crud.restock_sweet(db, sweet_id=sweet_id, quantity=quantity)
    if db_sweet is None:
        raise HTTPException(status_code=404, detail="Sweet not found")
    return db_sweet