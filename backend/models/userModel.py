from supabase_auth.errors import AuthApiError

from integration.integration import get_user_data, add_username
from postgrest.exceptions import APIError
from utils.utils import handle_jwt_expired

from .customExceptions import DatabaseException, InvalidTokenError


def call_with_token_refresh(func, access_token, refresh_token, *args):
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
    Function that gets user information from supabase and returns it. If the access token has expired, it will call refresh_session to get new tokens and then retry getting user data with them.
    For other exceptions, it raises DatabaseException.
    """
    return call_with_token_refresh(get_user_data, access_token, refresh_token)

    # try:
    #     data = get_user_data(access_token)
    #     return data, None
    # except (APIError, AuthApiError) as e:
    #     msg = str(e)
    #
    #     if "JWT" in msg or "expired" in msg:
    #         new_tokens = handle_jwt_expired(refresh_token)
    #         data = get_user_data(new_tokens["access_token"])
    #         return data, new_tokens
    #     else:
    #         raise DatabaseException()
    # except ValueError:
    #     raise
    # except InvalidTokenError:
    #     raise
    # except Exception as e:
    #     raise DatabaseException() from e


def update_user_username(new_username, person_id, access_token, refresh_token):
    return call_with_token_refresh(
        add_username, access_token, refresh_token, new_username, person_id
    )
    # try:
    #     data = add_username(access_token, new_username)
    #     return data, None
    # except (APIError, AuthApiError) as e:
    #     msg = str(e)
    #
    #     if "JWT" in msg or "expired" in msg:
    #         new_tokens = handle_jwt_expired(refresh_token)
    #         data = add_username(new_tokens["access_token"], new_username)
    #         return data, new_tokens
    #     else:
    #         raise DatabaseException()
    # except ValueError:
    #     raise
    # except InvalidTokenError:
    #     raise
    # except Exception as e:
    #     raise DatabaseException() from e
