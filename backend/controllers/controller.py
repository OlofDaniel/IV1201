from models.applicationModel import get_latest_application, send_application
from models.customExceptions import (
    DatabaseException,
    InvalidTokenError,
    ValidationError,
)
from models.loginModel import login
from models.logoutModel import logout
from models.passwordResetModel import change_password, request_password_email
from models.recruiterModel import (
    get_all_applicants_information,
    get_recruiter_application,
    update_application_status,
)
from models.signupModel import signup
from models.userModel import get_user_information, update_user_username


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
    except InvalidTokenError:
        raise


def reset_password_controller(user_email):
    """Controller function for resetting password, just calls model to attempt reset and catches possible errors, raising them to the caller"""
    try:
        return request_password_email(user_email)
    except DatabaseException:
        raise
    except ValidationError:
        raise


def update_password_controller(password, access_token, refresh_token):
    """Controller function for updating password, just calls model to attempt update and catches possible errors, raising them to the caller"""
    try:
        return change_password(password, access_token, refresh_token)
    except InvalidTokenError:
        raise
    except DatabaseException:
        raise
    except ValidationError:
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
    except ValidationError:
        raise


def get_all_applicants_information_controller(access_token, refresh_token):
    """Controller function for getting all applicants information. Calls model function get_all_applicants_information with users tokens."""
    try:
        return get_all_applicants_information(access_token, refresh_token)
    except ValidationError:
        raise
    except ValueError:
        raise
    except DatabaseException:
        raise


def send_application_controller(application_data, access_token, refresh_token):
    """Controller function for sending application, just calls model to attempt sending application and catches possible errors, raising them to the caller"""
    try:
        return send_application(application_data, access_token, refresh_token)
    except InvalidTokenError:
        raise
    except DatabaseException:
        raise
    except ValidationError:
        raise
    except ValueError:
        raise


def get_application_controller(person_id, access_token, refresh_token):
    """Controller function for getting application, just calls model to attempt getting application and catches possible errors, raising them to the caller"""
    try:
        return get_latest_application(person_id, access_token, refresh_token)
    except InvalidTokenError:
        raise
    except DatabaseException:
        raise
    except ValidationError:
        raise
    except ValueError:
        raise


def update_application_controller(status_updates, access_token, refresh_token):
    """Controller function for updating application status. Calls model function update_application_status with the status updates and users tokens."""
    try:
        return update_application_status(status_updates, access_token, refresh_token)
    except ValidationError:
        raise
    except ValueError:
        raise
    except DatabaseException:
        raise


def get_recruiter_application_controller(person_id, access_token, refresh_token):
    """Controller function for getting application for recruiter view, just calls model to attempt getting application and catches possible errors, raising them to the caller"""
    try:
        return get_recruiter_application(person_id, access_token, refresh_token)
    except InvalidTokenError:
        raise
    except DatabaseException:
        raise
    except ValidationError:
        raise
    except ValueError:
        raise


def add_username_controller(new_username, person_id, access_token, refresh_token):
    """Controller function for adding username, just calls model to attempt updating username and catches possible errors, raising them to the caller"""
    try:
        return update_user_username(
            new_username, person_id, access_token, refresh_token
        )
    except InvalidTokenError:
        raise
    except DatabaseException:
        raise
    except ValidationError:
        raise
    except ValueError:
        raise
