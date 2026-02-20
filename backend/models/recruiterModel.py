from integration.integration import get_applicants_data, refresh_session
from postgrest import APIError

from .customExceptions import DatabaseException


def get_all_applicants_information(access_token, refresh_token):
    """
    Function that gets all applicants information from supabase and returns it. If the access token has expired, it will call refresh_session to get new tokens and then retry.
    For other exceptions, it raises DatabaseException.
    """
    try:
        data = get_applicants_data(access_token)
        return data, None
    except ValueError:
        raise
    except APIError as e:
        if "JWT" in str(e) or "expired" in str(e):
            new_session = refresh_session(refresh_token)
            new_tokens = {
                "access_token": new_session.session.access_token,
                "refresh_token": new_session.session.refresh_token,
            }
            data = get_applicants_data(new_tokens["access_token"])
            return data, new_tokens
        else:
            raise DatabaseException()
