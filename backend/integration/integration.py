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

from integration.validation import validate_tokens, validate_unique, validate_person_info, validate_application_data, validate_status_updates, validate_email

load_dotenv()

options = ClientOptions(auto_refresh_token=False)

# Initilaze the client with the url and key from supabase
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key, options=options)


def validate_unique_credentials(username, email, pnr):
    """
    Validates uniqueness of username, email and person number
    """
    validate_unique(username, email, pnr, supabase)

def login_user(user_credentials):
    """
    Function that logs in user. If successful it returns account information to frontend.
    Throws AuthAPIError if not successful, for example if user does not exist.
    Validates the format of email and password before sent to database.
    """
    email = user_credentials["identifier"]
    password = user_credentials["password"]
    validate_email(email)
    if not isinstance(password, str) or not password:
        raise ValidationError("Invalid password format")

    try:
        response = supabase.auth.sign_in_with_password(
            {
                "email": email,
                "password": password,
            }
        )
        return response

    except AuthApiError as e:
        raise ValueError(vars(e) if hasattr(e, "dict") else str(e))
    except ValidationError:
        raise


def logout_user(access_token, refresh_token):
    """
    Function that logs out user, given the users access and refresh tokens.
    Returns response from supabase if successful, raises invalid token error if the access
    token is invalid and database exception if there is a problem with the connection.
    validates the access_token and refresh_token before sending to database.
    """
    try:
        validate_tokens(access_token=access_token, refresh_token=refresh_token)
        supabase.auth.set_session(access_token, refresh_token)
        response = supabase.auth.sign_out()
        return response

    except AuthApiError:
        raise InvalidTokenError("Invalid or expired token")
    except PydanticValidationError:
        raise InvalidTokenError("Invalid or expired token")
    except ValidationError:
        raise
    except IndexError:
        raise IndexError("JWT token expired")
    except Exception as e:
        raise DatabaseException()


def add_person(person_information):
    """
    Function that adds person to the person table in supabase.
    Returns json from supabase
    If successful call to supabase the response from supabase is a json object with the added row data.
    Throws AuthAPIError when email,pnr or username is not unique.
    Validates the format of person information before sent to database.
    """
    try:
        validate_person_info(person_information)

        unique_dict = validate_unique(
            person_information["username"],
            person_information["email"],
            person_information["person_number"],
            supabase,
        )

        if False in unique_dict.values():
            raise ValidationError("Some credentials was not unique: ", details=unique_dict)

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
    except ValidationError as e:
        raise ValidationError(f"Validation failed: {e}", details=e.details)



def get_email_from_username(identifier):
    """
    Function that retrieves email for username which is needed if the user wants to log in with username since supabase uses email to log in user.
    Throws an APIError if the username does not exist in supabase.
    Validates the format of identifier before sending to database.
    """
    try:
        if not isinstance(identifier, str) or not identifier:
            raise ValidationError("Invalid username format")


        query = (
            supabase.table("person_add_to_auth")
            .select("email")
            .eq("username", identifier)
            .single()
            .execute()
        )
        return query.data["email"]

    except APIError as e:
        raise ValueError("Invalid login credentials")


def get_user_data(access_token):
    """
    Function that fetches user information from supabase and returns it to frontend.
    Throws an ValueError if no user data is found, raises APIError if there is an error with the database request
    and DatabaseException if there is an error with the database connection.
    Validates the format of access_token before sending to database.
    """
    try:
        validate_tokens(access_token=access_token)
        user_client = get_user_client(access_token)
        response = (
            user_client.table("person_add_to_auth")
            .select("person_id, username, name, surname, email, pnr, role_id")
            .eq("id", user_client.auth.get_user(access_token).user.id)
            .single()
            .execute()
        )
        if response.data is None:
            raise ValueError("No data found")
        return response.data
    except (APIError, AuthApiError) as e:
        raise
    except ValidationError as e:
        raise ValidationError(f"Token validation failed: {e}")
    except Exception as e:
        raise DatabaseException()


def get_user_client(access_token):
    """
    Function that creates a new user client with the users access token.
    """
    options = ClientOptions(auto_refresh_token=False)
    user_client = create_client(url, key, options=options)
    user_client.postgrest.auth(access_token)

    return user_client


def refresh_session(refresh_token):
    """
    Function that starts a new session with refresh token and returns it.
    Validates the format of refresh_token before sending to database.
    """
    try:
        validate_tokens(refresh_token=refresh_token)
        return supabase.auth.refresh_session(refresh_token)
    except AuthApiError:
        raise
    except ValidationError as e:
        raise ValidationError(f"Token validation failed: {e}")


def password_reset_request(email):
    """Function to request a password reset email to be sent to the user with the given email,
    returns null regardless of success/failure to avoid leaking information about registered emails
    Validates the format of email before sending to database.
    """

    try:
        validate_email(email)
        response = supabase.auth.reset_password_email(
            email,
            {"redirect_to": "https://iv-1201-orcin.vercel.app/updatepassword"},
        )
        return response
    except AuthApiError:
        raise DatabaseException()
    except ValidationError:
        raise


def update_password(password, access_token, refresh_token):
    """
    Function to update a user's password, given the new password and valid access and refresh tokens.
    Returns the response from supabase if successful.
    Raises invalid token error if the access token is invalid, database exception if there is a problem with the connection and
    value error if the new password is the same as the previous password.
    Validates the format of password and tokens before sending to database.
    """
    try:
        if not isinstance(password, str) or not password:
            raise ValidationError("Invalid password format")
        validate_tokens(access_token=access_token, refresh_token=refresh_token)

        supabase.auth.set_session(access_token, refresh_token)

        response = supabase.auth.update_user({"password": password})

        return response

    except AuthApiError as e:
        if str(e) == "New password should be different from the old password.":
            raise ValueError(str(e))
        else:
            raise InvalidTokenError("Invalid or expired token")
    except PydanticValidationError as e:
        raise InvalidTokenError("Invalid or expired token")
    except ValidationError as e:
        raise ValidationError(f"Token validation failed: {e}")


def get_applicants_data(access_token: str):
    """
    Function that fetches information about all applicants (role_id = 2) and returns data as a list if successful or
    an empty list if no data is found.
    Raises APIError if there is an error with the database request, ValueError if the user is unauthorized
    and DatabaseException if there is an error with the database connection.
    Validates the access_token before sending to database.
    """
    try:
        validate_tokens(access_token=access_token)
        user_client = get_user_client(access_token)

        response = (
            user_client.table("person_add_to_auth")
            .select(
                "person_id, username, name, surname, email, pnr, application_status"
            )
            .eq("role_id", 2)
            .execute()
        )

        if response.data is None:
            return []
        return response.data
    except APIError:
        raise
    except ValidationError as e:
        raise ValidationError(f"Token validation failed: {e}")
    except Exception as e:
        if "Unauthorized" in str(e):
            raise ValueError(str(e))
        raise DatabaseException()


def get_previous_applications(access_token, person_id):
    """
    Function that fetches the from_date for all previous availability periods for a specific user. This is used to check if the user has an
    active application before allowing them to create a new one. Returns a list of all previous availability periods.
    Takes the users access token and person id as parameters.
    Raises APIError if there is an error with the database request and DatabaseException if there is an error with the database connection.
    Validates the access_token and person_id before sending to database.
    """
    try:
        if not isinstance(person_id, int) or not person_id:
            raise ValidationError("Invalid person_id format")
        validate_tokens(access_token=access_token)

        user_client = get_user_client(access_token)
        prev_availability = (
            user_client.table("availability")
            .select("from_date")
            .eq("person_id", person_id)
            .execute()
        )
        return prev_availability
    except APIError:
        raise
    except ValidationError as e:
        raise ValidationError(f"Token validation failed: {e}")
    except Exception:
        raise DatabaseException()


def upsert_application(availability_list, competencies_list, access_token, person_id):
    """
    Function that executes a function in the database that registers an application with the given availability and competence data.
    If there is existing competence data, it will be overridden with the new data. Also ensures that both availability and competence data is
    stored in the same transaction to avoid inconsistencies in the database.
    Takes the availability and competence data as lists, the users access token and person id as parameters.
    Raises AuthApiError if there is an authentication error, APIError if the database rpc fails and
    DatabaseException if there is an error with the database connection.
    validates the availability_list, competencies_list, person_id and access_token before sending to database.
    """
    application_payload = {
        "p_person_id": person_id,
        "p_availability_data": availability_list,
        "p_competence_data": competencies_list,
    }
    try:
        if not isinstance(person_id, int):
            raise ValidationError("Invalid person_id format")
        validate_tokens(access_token=access_token)
        validate_application_data(availability_list, competencies_list, person_id)

        user_client = get_user_client(access_token)
        user_client.rpc("create_application", application_payload).execute()
    except AuthApiError:
        raise
    except APIError:
        raise
    except ValidationError as e:
        raise ValidationError(f"Validation failed: {e}")
    except Exception:
        raise DatabaseException()


def upsert_application_status_updates(access_token, status_updates):
    """
    Function that upserts application status updates to the database. Takes a list of status updates and the users access token.
    Returns the response from supabase if successful, raises ValueError if the user is unauthorized and
    DatabaseException if there is an error with the database.
    Validates access_token and status_updates formats before sending to database.
    """
    try:
        validate_tokens(access_token=access_token)
        validate_status_updates(status_updates)

        user_client = get_user_client(access_token)

        response = (
            user_client.table("person_add_to_auth")
            .upsert(status_updates, on_conflict="person_id")
            .execute()
        )
        return response
    except APIError, AuthApiError:
        raise
    except ValidationError as e:
        raise ValidationError(f"Validation failed: {e}")
    except Exception:
        raise DatabaseException()


def get_application(access_token, person_id):
    """
    Function that fetches application information for a user given the users access token and person id.
    Returns a dict with availability, competencies and application status.
    Raises AuthApiError if there is an authentication error, ApiError if there is an error with the database request and
    DatabaseException if there is an error with the database connection.
    Validates access_token and person_id formats before sending to database.
    """
    try:
        validate_tokens(access_token=access_token)
        if not isinstance(person_id, int) or not person_id:
            raise ValidationError("Invalid person_id type")

        user_client = get_user_client(access_token)
        availability_response = (
            user_client.table("availability")
            .select("from_date, to_date")
            .eq("person_id", person_id)
            .execute()
        )
        competencies_response = (
            user_client.table("competence_profile")
            .select("competence_id, years_of_experience")
            .eq("person_id", person_id)
            .execute()
        )
        status_response = (
            user_client.table("person_add_to_auth")
            .select("application_status")
            .eq("person_id", person_id)
            .single()
            .execute()
        )

        return {
            "availability": availability_response.data,
            "competencies": competencies_response.data,
            "status": status_response.data,
        }
    except AuthApiError:
        raise
    except APIError:
        raise
    except ValidationError as e:
        raise ValidationError(f"Token validation failed: {e}")
    except Exception:
        raise DatabaseException()


def add_username(access_token, new_username, person_id):
    """
    Function that adds a username to a user (for users that dont have one as a result of database migration). Only adds the username if the user
    does not already have one. Takes the users access token, the new username and the users person id as parameters.
    Returns the response from supabase if successful, raises ValueError if the user is unauthorized,
    ValidationError if the username is not unique and DatabaseException if there is an error with the database.
    """
    try:
        validate_tokens(access_token=access_token)
        if not isinstance(person_id, int) or not person_id:
            raise ValidationError("Invalid person_id type")
        if not isinstance(new_username, str) or not new_username:
            raise ValidationError("Invalid username type")


        user_client = get_user_client(access_token)
        response = (
            user_client.table("person_add_to_auth")
            .update({"username": new_username})
            .eq("person_id", person_id)
            .is_("username", None)
            .execute()
        )

        return response
    except AuthApiError:
        raise
    except APIError:
        raise
    except ValidationError as e:
        raise ValidationError(f"Validation failed: {e}")
    except Exception:
        raise DatabaseException()
