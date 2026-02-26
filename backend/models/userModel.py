from integration.integration import get_user_data
from postgrest.exceptions import APIError
from utils.utils import handle_jwt_expired

from .customExceptions import DatabaseException, InvalidTokenError


def get_user_information(access_token, refresh_token):
    """
    Function that gets user information from supabase and returns it. If the access token has expired, it will call refresh_session to get new tokens and then retry getting user data with them.
    For other exceptions, it raises DatabaseException.
    """
    try:
        data = get_user_data(access_token)
        return data, None
    except APIError as e:
        msg = str(e)

        if "JWT" in msg or "expired" in msg:
            new_tokens = handle_jwt_expired(refresh_token)
            data = get_user_data(new_tokens["access_token"])
            return data, new_tokens
        else:
            raise DatabaseException()
    except ValueError:
        raise
    except InvalidTokenError:
        raise
    except Exception as e:
        raise DatabaseException() from e
