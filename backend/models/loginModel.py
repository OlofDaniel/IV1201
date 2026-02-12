from integration.integration import login_user, get_email_from_username
import re

from .customExceptions import DatabaseException


def login(user_credentials):
    """
    Function that logs in user and return user information including access token and refresh token.
    Error raises if the user does not exist in the database, or if user_credentials is wrong.
    DataBaseException is raised if there was a problem when accessing the database but the cause is unknown or irrelevant to the user.
    """
    try:
        identifier_is_email = is_email(user_credentials["identifier"])
        if not identifier_is_email:
            user_credentials["identifier"] = get_email_from_username(
                user_credentials["identifier"]
            )

        return login_user(user_credentials)
    except ValueError:
        raise
    except Exception:
        raise DatabaseException()


def is_email(identifier):
    """
    Function that checks if the identifier from the user is an email adress or not.
    """
    email_regex = r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,7}"
    return re.match(email_regex, identifier) is not None
