from integration.integration import refresh_session
from models.customExceptions import InvalidTokenError
from supabase_auth.errors import AuthApiError


def handle_jwt_expired(refresh_token):
    try:
        new_session = refresh_session(refresh_token)
        new_tokens = {
            "access_token": new_session.session.access_token,
            "refresh_token": new_session.session.refresh_token,
        }
        return new_tokens
    except AuthApiError:
        raise InvalidTokenError("Bad refresh token")
