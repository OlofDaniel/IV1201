from postgrest import APIError
from integration.integration import get_user_data, refresh_session

from .customExceptions import DatabaseException


def get_user_information(access_token, refresh_token):
    try:
        data = get_user_data(access_token)
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
            data = get_user_data(new_tokens["access_token"])
            return data, new_tokens
        else:
            raise DatabaseException()
