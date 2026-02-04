import bcrypt
from integration.integration import validate_user

from .customExceptions import DatabaseException

failed_login_str = "Invalid username or password"


def login(user_credentials):
    """Login function that gets a hashed password from the database, decrypts it and checks against the one provided.
    Error is raised either if the password doesnt match or the username didn't exist in the database
    DataBaseException is raised if there was a problem when accessing the database but the cause is unknown or irrelevant to the user.
    """
    try:
        password_data = validate_user(user_credentials)
        password = password_data.data[0]["password"]
        passwords_match = bcrypt.checkpw(
            user_credentials["password"].encode("utf-8"), password.encode("utf-8")
        )
        if passwords_match:
            return True
        else:
            raise ValueError(failed_login_str)
    except IndexError:
        raise ValueError(failed_login_str)
    except ValueError:
        raise DatabaseException()
