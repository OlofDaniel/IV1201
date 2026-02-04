from models.customExceptions import DatabaseException
from models.loginModel import login
from models.signupModel import signup


def signup_controller(person_information):
    try:
        return signup(person_information)
    except ValueError:
        raise
    except DatabaseException:
        raise


def login_controller(user_credentials):
    try:
        login(user_credentials)
    except ValueError:
        raise
    except DatabaseException:
        raise
