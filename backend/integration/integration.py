import os

from dotenv import load_dotenv
from postgrest.exceptions import APIError
from models.customExceptions import ValidationError, DatabaseException
from supabase import Client, create_client
from supabase_auth.errors import AuthApiError

load_dotenv()

# Initilaze the client with the url and key from supabase
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)


def login_user(user_credentials):
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


def add_person(person_information):
    """
    Function that adds person to the person table in supabase.
    Returns json from supabase
    If successful call to supabase the response from supabase is a json object with the added row data
    Throws APIError when email,pnr or username is not unique
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
        print(response)
        return response

    except AuthApiError:
        raise DatabaseException()


def validate_user(user_credentials):
    """Function that gets the hashed password in th e dtabase for a given username if there is one, if there isn't on the function will just return no rows."""
    try:
        response = (
            supabase.table("person_duplicate-test")
            .select("password")
            .eq("username", user_credentials["username"])
            .execute()
        )
    except APIError as e:
        raise ValueError(e.message)

    return response


def validate_unique(username, email, pnr):
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
