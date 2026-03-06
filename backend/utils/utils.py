from integration.integration import refresh_session
from models.customExceptions import InvalidTokenError
from supabase_auth.errors import AuthApiError


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
