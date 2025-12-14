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
    user: User

    model_config = ConfigDict(from_attributes=True)
