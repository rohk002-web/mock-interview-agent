from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID

class CreateUser(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    message: str

class LoginResponse(BaseModel):
    message: str
    token: str
    expired_at: datetime

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
class UserListResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    created_at: datetime

class UserListWrapper(BaseModel):
    message: str
    data: list[UserListResponse]


class Config:
    from_attributes = True 