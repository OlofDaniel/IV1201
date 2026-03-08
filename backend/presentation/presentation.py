import re
import os
from typing import Annotated, List

import jwt
import uvicorn
from controllers.controller import (
    get_all_applicants_information_controller,
    get_application_controller,
    get_user_information_controller,
    login_controller,
    logout_controller,
    reset_password_controller,
    send_application_controller,
    signup_controller,
    update_application_controller,
    update_password_controller,
    add_username_controller,
    get_recruiter_application_controller
)
from fastapi import Depends, FastAPI, Header, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from models.customExceptions import (
    DatabaseException,
    InvalidTokenError,
    ValidationError,
)
from pydantic import AfterValidator, BaseModel, Field

app = FastAPI()

origins = [
    "https://iv-1201-orcin.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]


security = HTTPBearer()


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "refresh_token"],
)


def validate_password(value: str) -> str:
    if len(value) < 8:
        raise ValueError("Password should be at least 8 letters")
    if not re.search(r"[A-Z]", value):
        raise ValueError("Password has to include atleast 1 uppercase letter")
    if not re.search(r"[a-z]", value):
        raise ValueError("Password has to include atleast 1 lowercase letter")
    if not re.search(r"[0-9]", value):
        raise ValueError("Password has to include atleast 1 number")
    return value


password_str = Annotated[str, AfterValidator(validate_password)]


def validate_email(value: str) -> str:
    email_regex = r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,7}"
    if re.match(email_regex, value) is None:
        raise ValueError("Invalid email format")
    return value


email_str = Annotated[str, AfterValidator(validate_email)]


def validate_person_number(value: str) -> str:
    if len(value) != 13:
        raise ValueError("Person number must be 13 digits")
    if "-" not in value:
        raise ValueError("Person number must include a hyphen")
    if not re.search(r"^\d{8}-\d{4}$", value):
        raise ValueError("Person number must be in format YYYYMMDD-XXXX")

    return value


person_number_str = Annotated[str, AfterValidator(validate_person_number)]


class LoginRequest(BaseModel):
    """Specifies types expected in a log in request, using them with pydantic BaseModel automates HTTP Error 422 responses"""

    identifier: str
    password: str


class PasswordUpdateRequest(BaseModel):
    """Specifies types expected in a password update request"""

    password: password_str


class SignupRequest(BaseModel):
    """Specifies types and formats expected in a sign up request, using them with pydantic BaseModel automates HTTP Error 422 responses"""

    username: str
    password: password_str
    first_name: str
    surname: str
    email: email_str
    person_number: person_number_str


class PasswordResetRequest(BaseModel):
    """Specifies types and formats expected in a password reset request, using them with pydantic BaseModel automates HTTP Error 422 responses"""

    email: email_str


class availabilityRange(BaseModel):
    from_date: str
    to_date: str


class getApplicationPayload(BaseModel):
    person_id: int


class updateUsernamePayload(BaseModel):
    person_id: int
    new_username: str


class applicationPayload(BaseModel):
    competencies: dict
    availability_ranges: List[availabilityRange] = Field(min_length=1)
    person_id: int


class StatusUpdateRequest(BaseModel):
    """Specifies types and formats expected in an application status update request"""

    person_id: int
    application_status: str


@app.post("/login")
def login(data: LoginRequest, response: Response):
    """
    Function that takes login requests, calling controller function after converting the request to a dict.
    Gets access and refresh tokens returned from controller and creates cookies with these tokens which are returned to frontend.
    """
    data_dict = data.model_dump()
    print("hej från login")
    try:
        login_response = login_controller(data_dict)

        set_cookies(
            response, login_response["access_token"], login_response["refresh_token"]
        )

        return {
            "status": "success",
            "user": {"metadata": login_response["user"]},
        }

    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except DatabaseException as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/logout")
def logout(request: Request, response: Response):
    """
    Function that takes logout requests, calling controller function after retrieving the users access and refresh tokens from cookies.
    if successful, it clears the cookies in the response and returns 200 OK.
    Raises HTTPException if no access_token/refresh_token was sent, or if the tokens are invalid/expired.
    Raises HTTPException with status code 500 if there is a problem with the database connection.
    """
    access_token = request.cookies.get("access_token")
    refresh_token = request.cookies.get("refresh_token")
    if not access_token or not refresh_token:
        raise HTTPException(status_code=401, detail="Not logged in")
    try:
        logout_controller(access_token, refresh_token)
        clear_auth_cookies(response)
        return {"status": "success"}
    except InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except DatabaseException as e:
        raise HTTPException(status_code=500, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/reset")
def reset(data: PasswordResetRequest):
    """Reset password endpoint, takes email from the request,
    then calls the reset password controller function.
    Error is only raised if there is a problem with connection to the database,
    Response is otherwise 200 OK regardless of email valididity, to avoid information leakage.
    """
    try:
        return reset_password_controller(data.email)
    except DatabaseException as e:
        raise HTTPException(status_code=500, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/updatepassword")
def updatepassword(
    data: PasswordUpdateRequest,
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    refresh_token: str = Header("refresh_token"),
):
    """Update password endpoint, takes the new password,
    the access and refresh tokens from the request,
    then calls the update password controller function"""
    try:
        return update_password_controller(
            data.password, credentials.credentials, refresh_token
        )
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

        set_cookies(
            response, signup_response["access_token"], signup_response["refresh_token"]
        )

        return {
            "status": "success",
            "user": {"metadata": signup_response["user"]},
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
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


def set_cookies(response: Response, access_token: str, refresh_token: str):
    """
    Function that creates cookies with access and refresh tokens.
    """
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="none",
        secure=True,
        path="/",
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="none",
        secure=True,
        path="/",
    )


def clear_auth_cookies(response: Response):
    response.delete_cookie(
        key="access_token", httponly=True, samesite="none", secure=True, path="/"
    )
    response.delete_cookie(
        key="refresh_token", httponly=True, samesite="none", secure=True, path="/"
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
        if user_info:
            return user_info
        else:
            raise HTTPException(status_code=500, detail="Cannot get data")

    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
    except DatabaseException as e:
        raise HTTPException(status_code=500, detail=str(e))
    except InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/sendapplication")
async def send_application(
    data: applicationPayload, response: Response, request: Request
):
    """
    Function that takes application data, calling controller function after converting the request to a dict
    If new tokens are reurned session cookies are updated with the new tokens.
    Raises HTTPException if no access_token were sent, or if the tokens are invalid/expired
    """
    access_token = request.cookies.get("access_token")
    refresh_token = request.cookies.get("refresh_token")

    if not access_token:
        raise HTTPException(status_code=401, detail="Not logged in")

    try:
        message, new_tokens = send_application_controller(
            data, access_token, refresh_token
        )

        if new_tokens:
            set_cookies(
                response, new_tokens["access_token"], new_tokens["refresh_token"]
            )

        return message
    except DatabaseException as e:
        raise HTTPException(status_code=500, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/recruiter")
def get_all_applicants_info(response: Response, request: Request):
    """
    Function that gets all applicants information from supabase with the users access token. It retrieves the user access and refresh token from cookies.
    Sets new cookies if new tokens are returned from lower layers, which indicate that the old tokens expired.
    Raises HTTPException if no access_token were sent.
    """
    access_token = request.cookies.get("access_token")
    refresh_token = request.cookies.get("refresh_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Not logged in")

    try:
        all_applicants_info, new_tokens = get_all_applicants_information_controller(
            access_token, refresh_token
        )
        if new_tokens:
            set_cookies(
                response, new_tokens["access_token"], new_tokens["refresh_token"]
            )

        return all_applicants_info

    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except DatabaseException as e:
        raise HTTPException(status_code=500, detail=str(e))
    except InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=str(e))

@app.post("/application")
def get_application(data: getApplicationPayload, response: Response, request: Request):
    """
    Function that gets application information for a user, calling controller function
    depending on the users role shown in their JWT token.
    If the rquesting user is a recruiter the get_recruiter_application_controller is called which returns
    the latest application, even if it is in the past. If the user is an applicant it'll only return future applications
    If new tokens are reurned session cookies are updated with the new tokens.
    Raises HTTPException 401 if no access_token were sent, or if the tokens are invalid/expired
    400 if appropriate availabilities don't exist for the user.
    """
    access_token = request.cookies.get("access_token")
    refresh_token = request.cookies.get("refresh_token")

    if not access_token:
        raise HTTPException(status_code=401, detail="Not logged in")

    try:
        decoded_jwt = jwt.decode(access_token, options={"verify_signature": False})
        if decoded_jwt["user_metadata"]["role_id"] == 1:
            application_info, new_tokens = get_recruiter_application_controller(
            data.person_id, access_token, refresh_token
        )
        else:
            application_info, new_tokens = get_application_controller(
                data.person_id, access_token, refresh_token
            )

        if new_tokens:
            set_cookies(
                response, new_tokens["access_token"], new_tokens["refresh_token"]
            )

        return application_info
    except DatabaseException:
        raise HTTPException(status_code=500, detail="Something went wrong when retrieving the application details")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=str(e))


@app.post("/updateapplication")
def update_application(
    data: List[StatusUpdateRequest], response: Response, request: Request
):
    """
    Function that updates the status of one or more applications, calling the controller function.
    Raises HTTPException if no access_token were sent, or if the tokens are invalid/expired. If a 
    non-recruiter tries to update application status, HTTPException with status code 403 is raised. 
    DatabaseException is caught if there is a problem with the database connection.
    InvalidTokenError is caught if the tokens are invalid/expired.
    """

    access_token = request.cookies.get("access_token")
    refresh_token = request.cookies.get("refresh_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Not logged in")

    updates_dict = [item.model_dump() for item in data]

    try:
        decoded_jwt = jwt.decode(access_token, options={"verify_signature": False})
        if decoded_jwt["user_metadata"]["role_id"] == 2:
            raise HTTPException(status_code=403, detail="Only recruiters can update application status")
        status_update_result, new_tokens = update_application_controller(
            updates_dict, access_token, refresh_token
        )
        if new_tokens:
            set_cookies(
                response, new_tokens["access_token"], new_tokens["refresh_token"]
            )

        return status_update_result

    except DatabaseException:
        raise HTTPException(status_code=500, detail="Something went wrong when trying to update application status")
    except InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/updateusername")
def update_username(data: updateUsernamePayload, response: Response, request: Request):
    """Function that updates the username of a user, calling the controller function.
    Raises HTTPException if no access_token were sent, or if the tokens are invalid/expired. 
    DatabaseException is caught if there is a problem with the database connection.
    ValueError is caught if the new username is already taken.
    InvalidTokenError is caught if the tokens are invalid/expired.
    """
    access_token = request.cookies.get("access_token")
    refresh_token = request.cookies.get("refresh_token")
    if not access_token:
        raise HTTPException(status_code=401, detail="Not logged in")

    try:
        username_update, new_tokens = add_username_controller(
            data.new_username, data.person_id, access_token, refresh_token
        )
        if new_tokens:
            set_cookies(
                response, new_tokens["access_token"], new_tokens["refresh_token"]
            )

        return username_update
    except DatabaseException as e:
        raise HTTPException(status_code=500, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
    except InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(
        "presentation.presentation:app", host="0.0.0.0", port=os.environ.get("PORT", 8000), reload=False
    )
