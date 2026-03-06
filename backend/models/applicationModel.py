from datetime import datetime, timedelta

from supabase_auth.errors import AuthApiError

from integration.integration import (
    get_previous_applications,
    upsert_application,
    get_application
)
from postgrest.exceptions import APIError
from utils.utils import handle_jwt_expired

from models.customExceptions import (
    DatabaseException,
    InvalidTokenError,
)

competency_id_map = {
    "ticket-sales": 1,
    "lotteries": 2,
    "roller-coaster": 3,
}


def send_application(application_data, access_token, refresh_token):
    """
    Model function for sending application, checks if the user already has an application that ends in the future, 
    if they do a ValueError is raised. If they don't then it formats the availability ranges and competencies and sends the 
    application to the database, handling token refreshing if needed, if any other error occurs it will raises a DatabaseException
    """

    format_availability_ranges(application_data)

    try:
        prev_availability = get_previous_applications(
            access_token, application_data.person_id
        )

        if len(prev_availability.data) != 0:
            sorted_dates = sorted(
                prev_availability.data, key=lambda x: x["from_date"], reverse=True
            )
            year = datetime.now().year
            if int(sorted_dates[0]["from_date"][:4]) >= year:
                raise ValueError("Application already exist for user")

        add_application(application_data, access_token)
        return "Successfully added application", None
    except APIError as e:
        msg = str(e)

        if "JWT" in msg or "expired" in msg:
            new_tokens = handle_jwt_expired(refresh_token)
            add_application(application_data, new_tokens["access_token"])
            return "Successfully added application", new_tokens
        else:
            raise DatabaseException()

    except InvalidTokenError:
        raise
    except DatabaseException:
        raise
    except ValueError:
        raise


def add_application(application_data, access_token):
    """
    Helper function for adding application, formats the lists  of availabilites and competencies needed for
    application data and calls integration layer function to insert, raises DatabaseException if any error occurs
    """
    application_data_competencies = {
        competency_id_map[k]: v for k, v in application_data.competencies.items()
    }

    availability_list = []

    for range in application_data.availability_ranges:
        availability_list.append(
            {
                "person_id": application_data.person_id,
                "from_date": range.from_date.isoformat(),
                "to_date": range.to_date.isoformat(),
            }
        )

    competencies_list = []

    for compentence_id, years in application_data_competencies.items():
        if years is None:
            continue
        competencies_list.append(
            {
                "person_id": application_data.person_id,
                "competence_id": compentence_id,
                "years_of_experience": years,
            }
        )

    try:
        upsert_application(
            availability_list,
            competencies_list,
            access_token,
            application_data.person_id,
        )
    except AuthApiError, APIError:
        raise
    except DatabaseException:
        raise
    except ValueError:
        raise


def format_availability_ranges(application_data):
    """Formats availiabilty to be only the date"""
    for range in application_data.availability_ranges:
        range.from_date = range.from_date.split("T")[0]
        range.to_date = range.to_date.split("T")[0]
        range.from_date = datetime.strptime(range.from_date, "%Y-%m-%d")
        range.to_date = datetime.strptime(range.to_date, "%Y-%m-%d")
        range.from_date = range.from_date + timedelta(days=1)
        range.to_date = range.to_date + timedelta(days=1)

def get_latest_application(person_id, access_token, refresh_token):
    """
    Function that returns future availabilities and competencies for a user, 
    raises ValueError if no future availability is found for the user.
    Handles retry if token is expired, if any other error occurs it raises a DatabaseException
    """
    try:
        application = get_application(access_token, person_id)
        application["availability"] = extract_future_availability(application["availability"])
        if(len(application["availability"]) == 0):
            raise ValueError("No future availability found for user")
           
        application["competencies"] = format_competencies(application["competencies"])
        return application, None
    except APIError as e:
        msg = str(e)

        if "JWT" in msg or "expired" in msg:
            new_tokens = handle_jwt_expired(refresh_token)
            application = get_application(new_tokens["access_token"], person_id)
            application["availability"] = extract_future_availability(application["availability"])
            if(len(application["availability"]) == 0):
                raise ValueError("No future availability found for user")
            application["competencies"] = format_competencies(application["competencies"])
            return application, new_tokens

        else:
            raise DatabaseException()

    except InvalidTokenError:
        raise
    except DatabaseException:
        raise
    except ValueError:
        raise

def format_competencies(competencies):
    user_competencies = {}
    reverse_competency_map = {v: k for k, v in competency_id_map.items()}
    for competency in competencies:
        user_competencies[reverse_competency_map[competency["competence_id"]]] = competency["years_of_experience"]
    return user_competencies

def extract_future_availability(availabilities):
    """
    Helper function to extract only future availability from a list of availabilities, 
    returns a list of future availability, 
    if no future availability is found an empty list is returned
    """
    future_availability = []
    current_date = datetime.now().date()

    for availability in availabilities:
        to_date = datetime.strptime(availability["to_date"], "%Y-%m-%d").date()

        if to_date >= current_date:
            future_availability.append(availability)

    return future_availability
        