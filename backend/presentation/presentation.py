import uvicorn
from controllers.controller import signup_controller
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    username: str
    password: str


class SignupRequest(BaseModel):
    username: str
    password: str
    first_name: str
    surname: str
    email: str
    person_number: str


@app.post("/login")
def login(data: LoginRequest):
    return {"username": data.username, "password": data.password}


@app.post("/signup")
def signup(data: SignupRequest):
    data_dict = data.model_dump()
    try:
        return signup_controller(data_dict)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(
        "presentation.presentation:app", host="0.0.0.0", port=8000, reload=False
    )
