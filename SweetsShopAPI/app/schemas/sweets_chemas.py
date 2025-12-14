from pydantic import BaseModel, ConfigDict

# Sweet schemas
class SweetBase(BaseModel):
    name: str
    category: str
    price: float

class SweetCreate(SweetBase):
    quantity: int = 0

class Sweet(SweetBase):
    id: int
    quantity: int
    model_config = ConfigDict(from_attributes=True)