import re

import uvicorn
from controllers.controller import signup_controller, login_controller, reset_password_controller, update_password_controller
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator

from models.customExceptions import DatabaseException, ValidationError

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    access_token: str
    refresh_token: str 


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
        if "@" not in value:
            raise ValueError("Email has to include @")
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
    try:
        return reset_password_controller(data.email)
    except DatabaseException as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/updatepassword")
def updatepassword(data: PasswordUpdateRequest):
    return update_password_controller(data.password, data.access_token, data.refresh_token)

@app.post("/signup")
def signup(data: SignupRequest, response: Response):
    """Function that takes signup requests, calling controller function after converting the request to a dict"""
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
            detail={
                "message": "Some credentials are already in use",
                "errors": errors
            }
        )
    except DatabaseException as e:
        raise HTTPException(status_code=500, detail=str(e))


def set_cookies(response: Response, access_token: str, refresh_token: str):
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


if __name__ == "__main__":
    uvicorn.run(
        "presentation.presentation:app", host="0.0.0.0", port=8000, reload=False
    )
