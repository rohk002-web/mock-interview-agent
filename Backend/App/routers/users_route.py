from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from App.config.db_connection import get_db
from App.schema.users_schema import UserListWrapper, UserResponse, CreateUser, LoginResponse , LoginRequest
from App.service.users_service import create_user , list_users , login_user , delete_user_service
from App.service.authentication_service import get_current_user

router = APIRouter(tags=["user management"])

@router.post("/create-user", response_model=UserResponse)
async def new_user(user: CreateUser, db: Session= Depends(get_db)):
    return create_user(user,db)

@router.get("/list-all-users", response_model=UserListWrapper)
async def list_all_users(db: Session= Depends(get_db)):
    return list_users(db)

@router.post("/login", response_model=LoginResponse)
async def login_service(user:LoginRequest, db: Session= Depends(get_db)):
    return login_user(user, db)

@router.delete("/delete-user/{user_id}", response_model=UserResponse)
async def delete_user(user_id: str, db: Session= Depends(get_db)):
    return delete_user_service(user_id,db)