import os

from dotenv import load_dotenv
from models.customExceptions import (
    DatabaseException,
    InvalidTokenError,
    ValidationError,
)
from postgrest.exceptions import APIError
from pydantic import ValidationError as PydanticValidationError
from supabase import Client, ClientOptions, create_client
from supabase_auth.errors import AuthApiError

load_dotenv()

options = ClientOptions(auto_refresh_token=False)

# Initilaze the client with the url and key from supabase
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key, options=options)


def login_user(user_credentials):
    """
    Function that loggs in user. If successful it returns account information to frontend.
    Throws AuthAPIError if not successful, for example if user does not exist.
    """
    try:
        response = supabase.auth.sign_in_with_password(
            {
                "email": user_credentials["identifier"],
                "password": user_credentials["password"],
            }
        )
        return response

    except AuthApiError as e:
        raise ValueError(vars(e) if hasattr(e, "dict") else str(e))


def logout_user(access_token, refresh_token):
    """Function that logs out user, given the users access and refresh tokens.
    Returns response from supabase if successful, raises invalid token error if the access
    token is invalid and database exception if there is a problem with the connection"""
    try:
        supabase.auth.set_session(access_token, refresh_token)
        response = supabase.auth.sign_out()
        return response

    except AuthApiError:
        raise InvalidTokenError("Invalid or expired token")
    except PydanticValidationError:
        raise InvalidTokenError("Invalid or expired token")
    except Exception:
        raise DatabaseException()


def add_person(person_information):
    """
    Function that adds person to the person table in supabase.
    Returns json from supabase
    If successful call to supabase the response from supabase is a json object with the added row data
    Throws AuthAPIError when email,pnr or username is not unique
    """
    try:
        unique_dict = validate_unique(
            person_information["username"],
            person_information["email"],
            person_information["person_number"],
        )

        if False in unique_dict.values():
            raise ValidationError("Some credentials was not unique: ", unique_dict)

        response = supabase.auth.sign_up(
            {
                "email": person_information["email"],
                "password": person_information["password"],
                "options": {
                    "data": {
                        "name": person_information["first_name"],
                        "surname": person_information["surname"],
                        "pnr": person_information["person_number"],
                        "username": person_information["username"],
                        "role_id": 2,
                        "needs_password_reset": False,
                    }
                },
            }
        )
        return response

    except AuthApiError:
        raise DatabaseException()


def validate_unique(username, email, pnr):
    """
    Function that checks if username, email and person number is unique. Returns a dict with a boolean value for each of these. True indicates unique, false is not unique.
    """
    unique_status = {
        "email": not bool(
            supabase.table("person_add_to_auth")
            .select("id")
            .eq("email", email)
            .execute()
            .data
        ),
        "username": not bool(
            supabase.table("person_add_to_auth")
            .select("id")
            .eq("username", username)
            .execute()
            .data
        ),
        "pnr": not bool(
            supabase.table("person_add_to_auth")
            .select("id")
            .eq("pnr", pnr)
            .execute()
            .data
        ),
    }
    return unique_status


def get_email_from_username(identifier):
    """
    Function that retrieves email for username which is needed if the user wants to log in with username since supabase uses email to log in user.
    Throws an APIError if the username does not exist in supabase.
    """
    try:
        query = (
            supabase.table("person_add_to_auth")
            .select("email")
            .eq("username", identifier)
            .single()
            .execute()
        )
        return query.data["email"]

    except APIError as e:
        print(e)
        raise ValueError("Invalid login credentials")


def get_user_data(access_token: str):
    """
    Function that fetches user information from supabase and returns it to frontend.
    Throws an ValueError if no user data is found.
    """
    try:
        user_client = get_user_client(access_token)
        response = (
            user_client.table("person_add_to_auth")
            .select("person_id, username, name, surname, email, pnr")
            .single()
            .execute()
        )
        if response.data is None:
            raise ValueError("No data found")
        return response.data
    except APIError:
        raise
    except Exception:
        raise ValueError("An error occurred while fetching user data")


def get_user_client(access_token: str):
    """
    Function that creates a new user client with the users access token.
    """
    options = ClientOptions(auto_refresh_token=False)
    user_client = create_client(url, key, options=options)
    user_client.postgrest.auth(access_token)

    return user_client


def refresh_session(refresh_token: str):
    """
    Function that starta a new session with refresh token and returns it.
    """
    try:
        return supabase.auth.refresh_session(refresh_token)
    except AuthApiError:
        raise


def password_reset_request(email):
    """Function to request a password reset email to be sent to the user with the given email,
    returns null regardless of success/failure to avoid leaking information about registered emails"""
    try:
        response = supabase.auth.reset_password_email(
            email,
            {
                "redirect_to": "http://localhost:3000/updatepassword"
            },  # TODO: Change redirect url when frontend is deployed
        )
        return response
    except AuthApiError:
        raise DatabaseException()


def update_password(password, access_token, refresh_token):
    """Function to update a user's password, given the new password and valid
    access and refresh tokens. Returns the response from supabase if successful,
    raises invalid token error if the access token is invalid, database exception
    if there is a problem with the connection and value error if the new password
    is the same as the previous password"""
    try:
        supabase.auth.set_session(access_token, refresh_token)

        response = supabase.auth.update_user({"password": password})

        return response

    except AuthApiError as e:
        if str(e) == "New password should be different from the old password.":
            raise ValueError(str(e))
        else:
            raise InvalidTokenError("Invalid or expired token")

    except PydanticValidationError as e:
        print(e)
        raise InvalidTokenError("Invalid or expired token")


def send_application(access_token: str):
    try:
        user_client = get_user_client(access_token)
        person_id = (
            user_client.table("person_add_to_auth")
            .select("person_id")
            .single()
            .execute()
        )
        if person_id.data is None:
            raise ValueError("No data found")

        response = user_client.table("competence_profile").insert("").single().execute()

    except APIError:
        raise
    except Exception:
        raise ValueError("An error occurred while fetching user data")
