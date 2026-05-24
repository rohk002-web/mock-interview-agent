from sqlalchemy.orm import Session
from passlib.context import CryptContext
from App.model.users import User
from fastapi import HTTPException
import uuid
from App.service.authentication_service import create_jwt_token
from App.schema.users_schema import LoginRequest

password_hash = CryptContext(schemes=["argon2"], deprecated="auto")  


def create_user(user_data, db: Session):
    existing_user = db.query(User).filter(User.email == user_data.email).first()

    if existing_user:
      raise HTTPException(
        status_code=400,
        detail="Email already exists"
    )

    hashed_password = password_hash.hash(user_data.password)

    new_user = User(
        id=uuid.uuid4(), 
        name=user_data.name,
        email=user_data.email,
        password=hashed_password
    )
        

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "id": str(new_user.id),
        "message": "User created successfully"
    }

def list_users(db:Session):
   users= db.query(User).all()

   if not users:
       raise HTTPException(
          status_code=404,
          detail="No users found"
       )
   
   return{
     "message": "Users retrieved successfully",
     "data": users
    }

def login_user(user_data: LoginRequest, db: Session):
    user = db.query(User).filter(User.email == user_data.email).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email"
        )

    # Verify hashed password
    password_validation = password_hash.verify(user_data.password, user.password)
    if not password_validation:
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    token, expired_at = create_jwt_token(str(user.id), user.email)

    return {
        "message": "Login successful",
        "token": token,
        "expired_at": expired_at
    }

def delete_user_service(user_id: str, db: Session):
    user= db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    db.delete(user)
    db.commit()
    return {
        "id": str(user.id),
        "message": "User deleted successfully"
    }