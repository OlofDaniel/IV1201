from integration.integration import login_user

from .customExceptions import DatabaseException


def login(user_credentials):
    """Login function that gets a hashed password from the database, decrypts it and checks against the one provided.
    Error is raised either if the password doesnt match or the username didn't exist in the database
    DataBaseException is raised if there was a problem when accessing the database but the cause is unknown or irrelevant to the user.
    """
    try:
        return login_user(user_credentials)
    except ValueError:
        raise
    except Exception:
        raise DatabaseException()
