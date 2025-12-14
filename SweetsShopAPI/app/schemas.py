from pydantic import BaseModel, ConfigDict

# User schemas
class UserBase(BaseModel):
    username: str
    full_name: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_admin: bool
    model_config = ConfigDict(from_attributes=True)

# Token schema
class Token(BaseModel):
    access_token: str
    token_type: str

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