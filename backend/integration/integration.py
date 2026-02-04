import os

from dotenv import load_dotenv
from postgrest.exceptions import APIError
from supabase import Client, create_client

load_dotenv()

# Initilaze the client with the url and key from supabase
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)


def add_person(person_information):
    """
    Function that adds person to the person table in supabase.
    Returns json from supabase
    If successful call to supabase the response from supabase is a json object with the added row data
    Throws APIError when email,pnr or username is not unique
    """
    try:
        response = (
            supabase.table("person_duplicate-test")
            .insert(
                {
                    "name": person_information["first_name"],
                    "surname": person_information["surname"],
                    "pnr": person_information["person_number"],
                    "email": person_information["email"],
                    "password": person_information["password"],
                    "role_id": 2,
                    "username": person_information["username"],
                }
            )
            .execute()
        )
    except APIError as e:
        raise ValueError(vars(e) if hasattr(e, "__dict__") else str(e))

    return response


def validate_user(user_credentials):
    """Function that gets the hashed password in the dtabase for a given username if there is one, if there isn't on the function will just return no rows."""
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
