from datetime import datetime

from integration.integration import (
    get_applicants_data,
    get_application,
    upsert_application_status_updates,
)
from postgrest import APIError
from supabase_auth.errors import AuthApiError
from utils.utils import call_with_token_refresh

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
        return call_with_token_refresh(get_applicants_data, access_token, refresh_token)
    except ValueError:
        raise
    except InvalidTokenError:
        raise
    except DatabaseException:
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
        return call_with_token_refresh(upsert_application_status_updates, access_token, refresh_token, status_updates)
    except InvalidTokenError:
        raise
    except DatabaseException:
        raise
    except ValueError:
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
        application, new_tokens = call_with_token_refresh(get_application, access_token, refresh_token, person_id)
        application["availability"] = extract_latest_year_availability(
            application["availability"]
        )
        application["competencies"] = format_competencies(application["competencies"])
        return application, new_tokens
    except InvalidTokenError:
        raise
    except DatabaseException:
        raise
    except ValueError:
        raise


def extract_latest_year_availability(availabilities):
    """
    Helper function that takes a list of availability ranges and returns only the availability ranges that are in the latest year.
    This is used to ensure that only relevant availability data is returned to the recruiter.
    """
    try: 
        latest_year = max(
            [datetime.strptime(a["from_date"], "%Y-%m-%d") for a in availabilities]
        ).year
        future_availabilities = []
        for availability in availabilities:
            from_date = datetime.strptime(availability["from_date"], "%Y-%m-%d")
            if from_date.year == latest_year:
                future_availabilities.append(availability)
        return future_availabilities
    except ValueError:
        return []
