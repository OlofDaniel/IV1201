import re

import uvicorn
from controllers.controller import signup_controller
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator

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

    username: str
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
            raise ValueError("Password should be more than 8 letters")
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


@app.post("/login")
def login(data: LoginRequest):
    return {"username": data.username, "password": data.password}


@app.post("/signup")
def signup(data: SignupRequest):
    """Function that takes signup requests, calling controller function after converting the request to a dict"""
    data_dict = data.model_dump()
    try:
        return signup_controller(data_dict)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(
        "presentation.presentation:app", host="0.0.0.0", port=8000, reload=False
    )
