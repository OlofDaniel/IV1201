import re

import uvicorn
from controllers.controller import (
    signup_controller,
    login_controller,
    get_user_information_controller,
    reset_password_controller,
    update_password_controller,
)
from fastapi import FastAPI, HTTPException, Response, Request
from typing import Annotated
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator

from models.customExceptions import DatabaseException, ValidationError, InvalidTokenError

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]


security = HTTPBearer()


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    """Specifies types expected in a log in request, using them with pydantic BaseModel automates HTTP Error 422 responses"""

    identifier: str
    password: str

class PasswordUpdateRequest(BaseModel):
    """Specifies types expected in a password update request"""

    password: str

class PasswordUpdateRequest(BaseModel):
    """Specifies types expected in a password update request"""

    password: str


class SignupRequest(BaseModel):
    """Specifies types and formats expected in a sign up request, using them with pydantic BaseModel automates HTTP Error 422 responses"""

    username: str
    password: str
    first_name: str
    surname: str
    email: str
    person_number: str

    @field_validator("password")
    @classmethod
    def password_complexity(cls, value: str) -> str:
        if len(value) < 8:
            raise ValueError("Password should be at least 8 letters")
        if not re.search(r"[A-Z]", value):
            raise ValueError("Password has to include atleast 1 uppercase letter")
        if not re.search(r"[a-z]", value):
            raise ValueError("Password has to include atleast 1 lowercase letter")
        if not re.search(r"[0-9]", value):
            raise ValueError("Password has to include atleast 1 number")
        return value

    @field_validator("email")
    @classmethod
    def email_validity(cls, value: str) -> str:
        email_regex = r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,7}"
        if re.match(email_regex, value) is None:
            raise ValueError("Invalid email format")
        return value


class PasswordResetRequest(BaseModel):
    """Specifies types and formats expected in a password reset request, using them with pydantic BaseModel automates HTTP Error 422 responses"""

    email: str

    @field_validator("email")
    @classmethod
    def email_validity(cls, value: str) -> str:
        if "@" not in value:
            raise ValueError("Email has to include @")
        return value


@app.post("/login")
def login(data: LoginRequest, response: Response):
    """
    Function that takes login requests, calling controller function after converting the request to a dict.
    Gets access and refresh tokens returned from controller and creates cookies with these tokens which are returned to frontend.
    """
    data_dict = data.model_dump()
    try:
        login_response = login_controller(data_dict)

        access_token = login_response.session.access_token
        refresh_token = login_response.session.refresh_token

        set_cookies(response, access_token, refresh_token)

        return {
            "status": "success",
            "user": {"metadata": login_response.user.user_metadata},
        }

    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
    except DatabaseException as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/reset")
def reset(data: PasswordResetRequest):
    """ Reset password endpoint, takes email from the request, 
    then calls the reset password controller function.
    Error is only raised if there is a problem with connection to the database,
    Response is otherwise 200 OK regardless of email valididity, to avoid information leakage.
    """
    try:
        return reset_password_controller(data.email)
    except DatabaseException as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/updatepassword")
def updatepassword(data: PasswordUpdateRequest, credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)], 
                   refresh_token : str = Header("refresh_token")):
    """Update password endpoint, takes the new password,
    the access and refresh tokens from the request, 
    then calls the update password controller function"""
    try:
        return update_password_controller(data.password, credentials.credentials, refresh_token)
    except InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except DatabaseException:
        raise HTTPException(status_code=500, detail="An unexpected error occurred")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@app.post("/signup")
def signup(data: SignupRequest, response: Response):
    """
    Function that takes signup requests, calling controller function after converting the request to a dict
    Gets access and refresh tokens returned from controller and creates cookies with these tokens which are returned to frontend.
    """
    data_dict = data.model_dump()
    try:
        signup_response = signup_controller(data_dict)

        access_token = signup_response.session.access_token
        refresh_token = signup_response.session.refresh_token

        set_cookies(response, access_token, refresh_token)

        return {
            "status": "success",
            "user": {"metadata": signup_response.user.user_metadata},
        }
    except ValidationError as e:
        errors = {}

        for field, is_unique in e.details.items():
            if not is_unique:
                if field == "email":
                    errors["email"] = "Email is already registered"
                elif field == "username":
                    errors["username"] = "Username is already taken"
                elif field == "pnr":
                    errors["pnr"] = "Person number is already registered"

        raise HTTPException(
            status_code=409,
            detail={"message": "Some credentials are already in use", "errors": errors},
        )
    except DatabaseException as e:
        raise HTTPException(status_code=500, detail=str(e))


def set_cookies(response: Response, access_token: str, refresh_token: str):
    """
    Function that creates cookies with access and refresh tokens.
    """
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False,
        path="/",
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="lax",
        secure=False,
        path="/",
    )


@app.get("/getinfo")
def get_user_info(response: Response, request: Request):
    """
    Function that gets user information from supabase with the users access token. It retrieves the user access and refresh token from cookies.
    Sets new cookies if new tokens are returned from lower layers, which indicate that the old tokens expired.
    Raises HTTPException if no access_token were sent.
    """
    access_token = request.cookies.get("access_token")
    refresh_token = request.cookies.get("refresh_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Not logged in")
    try:
        user_info, new_tokens = get_user_information_controller(
            access_token, refresh_token
        )

        if new_tokens:
            set_cookies(
                response, new_tokens["access_token"], new_tokens["refresh_token"]
            )

        return user_info

    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
    except DatabaseException as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(
        "presentation.presentation:app", host="0.0.0.0", port=8000, reload=False
    )
