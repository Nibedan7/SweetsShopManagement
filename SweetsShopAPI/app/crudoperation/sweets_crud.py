from sqlalchemy.orm import Session
from app.models.sweets_model import Sweet as SweetModel
from app.schemas.sweets_chemas import SweetCreate as SweetCreateSchema
from app.schemas.sweets_chemas import Sweet as SweetSchema
from app.schemas.sweets_chemas import SweetBase as SweetBaseSchema

def get_sweets(db: Session, skip: int = 0, limit: int = 100):
    return db.query(SweetModel).offset(skip).limit(limit).all()

def create_sweet(db: Session, sweet: SweetCreateSchema):
    db_sweet = SweetModel(**sweet.dict())
    db.add(db_sweet)
    db.commit()
    db.refresh(db_sweet)
    return db_sweet

def get_sweet_by_id(db: Session, sweet_id: int):
    return db.query(SweetModel).filter(SweetModel.id == sweet_id).first()

def update_sweet(db: Session, sweet_id: int, sweet: SweetBaseSchema):
    db_sweet = db.query(SweetModel).filter(SweetModel.id == sweet_id).first()
    if db_sweet:
        for key, value in sweet.dict().items():
            setattr(db_sweet, key, value)
        db.commit()
        db.refresh(db_sweet)
    return db_sweet

def delete_sweet(db: Session, sweet_id: int):
    db_sweet = db.query(SweetModel).filter(SweetModel.id == sweet_id).first()
    if db_sweet:
        db.delete(db_sweet)
        db.commit()
    return db_sweet

def purchase_sweet(db: Session, sweet_id: int, quantity: int = 1):
    db_sweet = db.query(SweetModel).filter(SweetModel.id == sweet_id).first()
    if not db_sweet or db_sweet.quantity < quantity:
        return None 
    db_sweet.quantity -= quantity
    db.commit()
    db.refresh(db_sweet)
    return db_sweet

def restock_sweet(db: Session, sweet_id: int, quantity: int):
    db_sweet = db.query(SweetModel).filter(SweetModel.id == sweet_id).first()
    if db_sweet:
        db_sweet.quantity += quantity
        db.commit()
        db.refresh(db_sweet)
    return db_sweet