from models.customExceptions import (
    DatabaseException,
    InvalidTokenError,
    ValidationError,
)
from models.customExceptions import (
    DatabaseException,
    InvalidTokenError,
    ValidationError,
)
from models.loginModel import login
from models.passwordResetModel import change_password, request_password_email
from models.recruiterModel import get_all_applicants_information
from models.logoutModel import logout
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
    except Exception:
        raise



def reset_password_controller(user_email):
    """Controller function for resetting password, just calls model to attempt reset and catches possible errors, raising them to the caller"""
    try:
        return request_password_email(user_email)
    except DatabaseException:
        raise


def update_password_controller(password, access_token, refresh_token):
    """Controller function for updating password, just calls model to attempt update and catches possible errors, raising them to the caller"""
    try:
        return change_password(password, access_token, refresh_token)
    except InvalidTokenError:
        raise
    except DatabaseException:
        raise
    except ValueError:
        raise


def logout_controller(access_token, refresh_token):
    """Controller function for logging out, just calls model to attempt logout and catches possible errors, raising them to the caller"""
    try:
        return logout(access_token, refresh_token)
    except InvalidTokenError:
        raise
    except DatabaseException:
        raise



def get_all_applicants_information_controller(access_token, refresh_token):
    """Controller function for getting all applicants information. Calls model function get_all_applicants_information with users tokens."""
    try:
        return get_all_applicants_information(access_token, refresh_token)
    except ValueError:
        raise
    except DatabaseException:
        raise
