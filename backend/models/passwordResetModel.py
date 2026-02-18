from integration.integration import password_reset_request, update_password


from .customExceptions import DatabaseException, InvalidTokenError
def request_password_email(email):
    """Attempts to request an email with pasword resetting instructions, 
    raises database exception if there is a problem with the database connection
    """
    try:
        return password_reset_request(email)
    except DatabaseException:
        raise
def change_password(password, access_token, refresh_token):
    """Attempts to change password, raises invalid token error if the access token is invalid,
      database exception if there is a problem with the database connection and 
      value error if the new password is the same as the previous password
    """
    try:
        return update_password(password, access_token, refresh_token)
    except InvalidTokenError:
            raise
    except DatabaseException:
        raise
    except ValueError:
        raise