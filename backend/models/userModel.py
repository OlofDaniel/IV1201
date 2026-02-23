from integration.integration import get_user_data, refresh_session
from postgrest.exceptions import APIError
from supabase_auth.errors import AuthApiError

from .customExceptions import DatabaseException


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
            try:
                new_session = refresh_session(refresh_token)
                new_tokens = {
                    "access_token": new_session.session.access_token,
                    "refresh_token": new_session.session.refresh_token,
                }
                data = get_user_data(new_tokens["access_token"])
                return data, new_tokens
            except AuthApiError:
                raise ValueError("Bad refresh token")
        else:
            raise DatabaseException()
    except ValueError:
        raise
    except Exception as e:
        raise DatabaseException() from e
