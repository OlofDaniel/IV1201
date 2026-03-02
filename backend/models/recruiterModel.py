from integration.integration import (
    get_applicants_data,
    refresh_session,
    upsert_application_status_updates,
)
from postgrest import APIError
from supabase_auth.errors import AuthApiError

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
    except (APIError, AuthApiError) as e:
        if "JWT" in str(e) or "expired" in str(e):
            try:
                new_session = refresh_session(refresh_token)
                new_tokens = {
                    "access_token": new_session.session.access_token,
                    "refresh_token": new_session.session.refresh_token,
                }
                data = get_applicants_data(new_tokens["access_token"])
                return data, new_tokens
            except AuthApiError:
                raise ValueError("Bad refresh token")
        else:
            raise DatabaseException()


def update_application_status(status_updates, access_token, refresh_token):
    """
    Function that updates application status in supabase. If the access token has expired, it will call refresh_session to get new tokens and then retry.
    For other exceptions, it raises DatabaseException.
    """
    try:
        response = upsert_application_status_updates(status_updates, access_token)
        return response, None
    except ValueError:
        raise
    except (APIError, AuthApiError) as e:
        if "JWT" in str(e) or "expired" in str(e):
            try:
                new_session = refresh_session(refresh_token)
                new_tokens = {
                    "access_token": new_session.session.access_token,
                    "refresh_token": new_session.session.refresh_token,
                }
                response = upsert_application_status_updates(
                    status_updates, new_tokens["access_token"]
                )
                return response, new_tokens
            except AuthApiError:
                raise ValueError("Bad refresh token")
        else:
            raise DatabaseException() from e
    except Exception as e:
        raise DatabaseException() from e
