
from integration.integration import get_user_data, add_username, validate_unique_credentials
from utils.utils import call_with_token_refresh

from .customExceptions import DatabaseException, InvalidTokenError


def get_user_information(access_token, refresh_token):
    """
    Function that gets user information from supabase and returns it.
    """
    try:
        return call_with_token_refresh(get_user_data, access_token, refresh_token)
    except ValueError:
        raise
    except InvalidTokenError:
        raise
    except DatabaseException:
        raise


def update_user_username(new_username, person_id, access_token, refresh_token):
    """
    Function that updates the user's username after validating that the new username is unique.
    Returns a tuple containing the updated data and any new tokens from refresh, or raises exceptions
    if validation fails.
    """
    unique_status = validate_unique_credentials(new_username, "", "")
    if not unique_status["username"]:
        raise ValueError("Username is already taken")

    try:
        return call_with_token_refresh(
            add_username, access_token, refresh_token, new_username, person_id
        )
    except ValueError:
        raise
    except InvalidTokenError:
        raise
    except DatabaseException:
        raise
