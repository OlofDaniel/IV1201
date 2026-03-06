from datetime import datetime

from integration.integration import (
    get_applicants_data,
    get_application,
    upsert_application_status_updates,
)
from postgrest import APIError
from supabase_auth.errors import AuthApiError
from utils.utils import handle_jwt_expired

# helper from applicationModel to convert competency list to a name→years map
from .applicationModel import format_competencies
from .customExceptions import DatabaseException, InvalidTokenError


def get_all_applicants_information(access_token, refresh_token):
    """
    Function that gets all applicants information from supabase and returns it. If the access token has expired it attempts
    to refresh the token and retry. Returns the applicants data and any new tokens if the access token was refreshed.
    Takes the users access token and refresh token as parameters.
    Raises ValueError if the user is unauthorized, InvalidTokenError if the access token is invalid and DatabaseException
    if there is an error with the database connection.
    """
    try:
        data = get_applicants_data(access_token)
        return data, None
    except ValueError:
        raise
    except (APIError, AuthApiError) as e:
        if "JWT" in str(e) or "expired" in str(e):
            new_tokens = handle_jwt_expired(refresh_token)
            data = get_applicants_data(new_tokens["access_token"])
            return data, new_tokens
        else:
            raise DatabaseException()
    except InvalidTokenError:
        raise
    except DatabaseException:
        raise
    except ValueError:
        raise


def update_application_status(status_updates, access_token, refresh_token):
    """
    Function that updates the status of an application in supabase. If the access token has expired it attempts to refresh the token and retry.
    Returns the response from supabase and any new tokens if the access token was refreshed. Takes the status updates as a list of dictionaries,
    the users access token and refresh token as parameters.
    Raises InvalidTokenError if the access token is invalid and DatabaseException if there is an error with the database connection
    or if the update fails.
    """
    try:
        response = upsert_application_status_updates(status_updates, access_token)
        return response, None
    except (APIError, AuthApiError) as e:
        if "JWT" in str(e) or "expired" in str(e):
            new_tokens = handle_jwt_expired(refresh_token)
            response = upsert_application_status_updates(
                status_updates, new_tokens["access_token"]
            )
            return response, new_tokens
        else:
            raise DatabaseException()
    except InvalidTokenError:
        raise
    except DatabaseException:
        raise


def get_recruiter_application(person_id, access_token, refresh_token):
    """
    Function that retrieves and formats an application for the recruiter view. Ensures that only availability in the latest year is returned
    and formats competencies in the same way as the applicant endpoint. If the access token has expired it attempts to refresh the token and retry.
    Returns the formatted application data and any new tokens if the access token was refreshed.
    Takes the person id, the users access token and refresh token as parameters.
    Raises InvalidTokenError if the access token is invalid and DatabaseException if there is an error with the database connection.
    """
    try:
        application = get_application(access_token, person_id)
        application["availability"] = extract_latest_year_availability(
            application["availability"]
        )
        application["competencies"] = format_competencies(application["competencies"])
        return application, None
    except APIError as e:
        msg = str(e)

        if "JWT" in msg or "expired" in msg:
            new_tokens = handle_jwt_expired(refresh_token)
            application = get_application(new_tokens["access_token"], person_id)
            application["availability"] = extract_latest_year_availability(
                application["availability"]
            )
            application["competencies"] = format_competencies(
                application["competencies"]
            )
            return application, new_tokens

        else:
            raise DatabaseException()
    except InvalidTokenError:
        raise
    except DatabaseException:
        raise


def extract_latest_year_availability(availabilities):
    """
    Helper function that takes a list of availability ranges and returns only the availability ranges that are in the latest year.
    This is used to ensure that only relevant availability data is returned to the recruiter.
    """
    latest_year = max(
        [datetime.strptime(a["from_date"], "%Y-%m-%d") for a in availabilities]
    ).year
    future_availabilities = []
    for availability in availabilities:
        from_date = datetime.strptime(availability["from_date"], "%Y-%m-%d")
        if from_date.year == latest_year:
            future_availabilities.append(availability)
    return future_availabilities
