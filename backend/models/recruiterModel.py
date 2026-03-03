from utils.utils import handle_jwt_expired
from integration.integration import (
    get_applicants_data,
    get_application,
    refresh_session,
    upsert_application_status_updates,
)
from datetime import datetime
from postgrest import APIError
from supabase_auth.errors import AuthApiError

# helper from applicationModel to convert competency list to a name→years map
from .applicationModel import format_competencies

from .customExceptions import DatabaseException


def get_all_applicants_information(access_token, refresh_token):
    """
    Function that gets all applicants information from supabase and returns it. If the access token has expired, it will call refresh_session to get new tokens and then retry.
    For other exceptions, it raises DatabaseException.
    """
    try:
        data = get_applicants_data(access_token)
        return data, None
    except ValueError:
        raise
    except (APIError, AuthApiError) as e:
        if "JWT" in str(e) or "expired" in str(e):
            try:
                new_session = refresh_session(refresh_token)
                new_tokens = {
                    "access_token": new_session.session.access_token,
                    "refresh_token": new_session.session.refresh_token,
                }
                data = get_applicants_data(new_tokens["access_token"])
                return data, new_tokens
            except AuthApiError:
                raise ValueError("Bad refresh token")
        else:
            raise DatabaseException()


def update_application_status(status_updates, access_token, refresh_token):
    """
    Function that updates application status in supabase. If the access token has expired, it will call refresh_session to get new tokens and then retry.
    For other exceptions, it raises DatabaseException.
    """
    try:
        response = upsert_application_status_updates(status_updates, access_token)
        return response, None
    except ValueError:
        raise
    except (APIError, AuthApiError) as e:
        if "JWT" in str(e) or "expired" in str(e):
            try:
                new_session = refresh_session(refresh_token)
                new_tokens = {
                    "access_token": new_session.session.access_token,
                    "refresh_token": new_session.session.refresh_token,
                }
                response = upsert_application_status_updates(
                    status_updates, new_tokens["access_token"]
                )
                return response, new_tokens
            except AuthApiError:
                raise ValueError("Bad refresh token")
        else:
            raise DatabaseException() from e
    except Exception as e:
        raise DatabaseException() from e

def get_recruiter_application(person_id, access_token, refresh_token):
    try:
        application = get_application(access_token, person_id)
        # keep only availabilities in the latest year
        application["availability"] = extract_latest_year_availability(application["availability"])
        # recruiter also needs competencies formatted like the applicant endpoint
        application["competencies"] = format_competencies(application["competencies"])
        return application, None
    except APIError as e:
        msg = str(e)

        if "JWT" in msg or "expired" in msg:
            new_tokens = handle_jwt_expired(refresh_token)
            application = get_application(new_tokens["access_token"], person_id)
            application["availability"] = extract_latest_year_availability(application["availability"])
            application["competencies"] = format_competencies(application["competencies"])
            return application, new_tokens

        else:
            raise DatabaseException()

def extract_latest_year_availability(availabilities):
    latest_year = max([datetime.strptime(a["from_date"], "%Y-%m-%d") for a in availabilities]).year
    future_availabilities = []
    for availability in availabilities:
        from_date = datetime.strptime(availability["from_date"], "%Y-%m-%d")
        if from_date.year == latest_year:
            future_availabilities.append(availability)
    return future_availabilities