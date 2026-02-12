from integration.integration import password_reset_request, update_password


from .customExceptions import DatabaseException, ValidationError


def request_password_email(email):
    try:
        return password_reset_request(email)
    except DatabaseException:
        raise
def change_password(password, access_token, refresh_token):
    try:
        return update_password(password, access_token, refresh_token)
    except ValidationError as e:
        raise
    except DatabaseException as e:
        raise