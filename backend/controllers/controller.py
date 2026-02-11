from models.customExceptions import DatabaseException, ValidationError
from models.loginModel import login
from models.signupModel import signup


def signup_controller(person_information):
    """Controller function for signing up, just calls model to sign up and catches possible errors, raising them to the caller"""
    try:
        return signup(person_information)
    except ValidationError:
        raise
    except DatabaseException:
        raise


def login_controller(user_credentials):
    """Controller function for logging in, just calls model to attempt login and catches possible errors, raising them to the caller"""
    try:
        return login(user_credentials)
    except ValueError:
        raise
    except DatabaseException:
        raise
