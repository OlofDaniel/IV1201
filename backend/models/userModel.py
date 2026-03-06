from supabase_auth.errors import AuthApiError

from integration.integration import get_user_data, add_username, validate_unique
from postgrest.exceptions import APIError
from utils.utils import handle_jwt_expired

from .customExceptions import DatabaseException, InvalidTokenError


def call_with_token_refresh(func, access_token, refresh_token, *args):
    """
    Helper function that allows several functions to be called with handling of token refreshing,
    Calls a function that required access token and if the token is expired it handles session refreshing,
    if both tokens are expired/corrupt INvalidTokenError is raised.
    """
    try:
        data = func(access_token, *args)
        return data, None
    except (APIError, AuthApiError) as e:
        msg = str(e)

        if "JWT" in msg or "expired" in msg:
            new_tokens = handle_jwt_expired(refresh_token)
            data = func(new_tokens["access_token"], *args)
            return data, new_tokens
        else:
            raise DatabaseException()
    except ValueError:
        raise
    except InvalidTokenError:
        raise
    except Exception as e:
        raise DatabaseException() from e


def get_user_information(access_token, refresh_token):
    """
    Function that gets user information from supabase and returns it.
    """

    return call_with_token_refresh(get_user_data, access_token, refresh_token)



def update_user_username(new_username, person_id, access_token, refresh_token):
    """
    Function that updates the user's username after validating that the new username is unique.
    Returns a tuple containing the updated data and any new tokens from refresh, or raises exceptions
    if validation fails.
    """
    unique_status = validate_unique(new_username, "", "")
    if not unique_status["username"]:
        raise ValueError("Username is already taken")
    
    return call_with_token_refresh(
        add_username, access_token, refresh_token, new_username, person_id
    )
