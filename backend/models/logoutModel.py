from .customExceptions import DatabaseException, InvalidTokenError
from integration.integration import logout_user

def logout(access_token, refresh_token):
    """Model function for logging out, calls database function to log out user with given tokens, 
    if tokens are invalid or database error occurs it raises an error to the caller"""
    try:
        return logout_user(access_token, refresh_token)
    except InvalidTokenError:
        raise
    except DatabaseException:
        raise