from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from App.config.db_connection import get_db
from App.schema.users_schema import UserListWrapper, UserResponse, CreateUser
from App.service.users_service import create_user , list_users

router = APIRouter(tags=["users_management"])

@router.post("/create-user", response_model=UserResponse)
async def new_user(user: CreateUser, db: Session= Depends(get_db)):
    return create_user(user,db)

@router.get("/list-all-users", response_model=UserListWrapper)
async def list_all_users(db: Session= Depends(get_db)):
    return list_users(db)