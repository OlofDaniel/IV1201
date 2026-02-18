from models.customExceptions import DatabaseException, ValidationError
from models.loginModel import login
from models.signupModel import signup
from models.userModel import get_user_information


def signup_controller(person_information):
    """Controller function for signing up, just calls model to sign up and catches possible errors for example if user already exist, raising them to the caller"""
    try:
        return signup(person_information)
    except ValidationError:
        raise
    except DatabaseException:
        raise


def login_controller(user_credentials):
    """Controller function for logging in, just calls model to attempt login and catches possible errors for example if account does not exist, raising them to the caller"""
    try:
        return login(user_credentials)
    except ValueError:
        raise
    except DatabaseException:
        raise


def get_user_information_controller(access_token, refresh_token):
    """Controller function for getting user information. Calls model function get_user_information with users tokens."""
    try:
        return get_user_information(access_token, refresh_token)
    except ValueError:
        raise
    except DatabaseException:
        raise
