from integration.integration import refresh_session
from supabase_auth.errors import AuthApiError
from postgrest.exceptions import APIError
from models.customExceptions import DatabaseException, InvalidTokenError


def handle_jwt_expired(refresh_token):
    """
    Helper function used in connection with supabase calls that require access token, 
    when the access token is expired this is called to refresh the session with the refresh token,
    if the refresh token is invalid/expired it raises InvalidTokenError
    """
    try:
        new_session = refresh_session(refresh_token)
        new_tokens = {
            "access_token": new_session.session.access_token,
            "refresh_token": new_session.session.refresh_token,
        }
        return new_tokens
    except AuthApiError:
        raise InvalidTokenError("Bad refresh token")

def call_with_token_refresh(func, access_token, refresh_token, *args, **kwargs):
    """
    Helper function that allows several functions to be called with handling of token refreshing,
    Calls a function that required access token and if the token is expired it handles session refreshing,
    if both tokens are expired/corrupt InvalidTokenError is raised.
    """
    try:
        print("Hej utanför jwt")
        data = func(access_token, *args, **kwargs)
        return data, None
    except (APIError, AuthApiError, IndexError) as e:
        msg = str(e)

        if "JWT" in msg or "expired" in msg:
            print("hej från inne i jwt")
            new_tokens = handle_jwt_expired(refresh_token)
            if "refresh_token" in kwargs:
                kwargs["refresh_token"] = new_tokens["refresh_token"]
            data = func(new_tokens["access_token"], *args, **kwargs)
            return data, new_tokens
        else:
            raise DatabaseException()
    except ValueError:
        raise
    except InvalidTokenError:
        raise
    except Exception as e:
        raise DatabaseException() from e
