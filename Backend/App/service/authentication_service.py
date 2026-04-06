from datetime import datetime,timedelta
import os
from dotenv import load_dotenv
import jwt
from App.model.users import User 
from fastapi import HTTPException
from App.config.db_connection import get_db
from sqlalchemy.orm import Session
from fastapi import Depends
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

load_dotenv()

TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
security = HTTPBearer(auto_error=False)  

def verify_token(token: str):
    try:
       payload =jwt.decode(token ,JWT_SECRET_KEY, algorithms=["HS256"])
       return payload
     
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token has expired"
        )
   
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )
    
def create_jwt_token(user_id :str, email: str):
    expire = datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": expire
    }
    token = jwt.encode(payload,JWT_SECRET_KEY, algorithm="HS256")
    return token , expire

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):

    if credentials is None or credentials.credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization required"
        )
    payload = verify_token(credentials.credentials)

    user = db.query(User).filter(User.id == payload.get("user_id")).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user