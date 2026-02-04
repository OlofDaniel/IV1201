import bcrypt
from integration.integration import validate_user

from .customExceptions import DatabaseException

failed_login_str = "Invalid username or password"


def login(user_credentials):
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
