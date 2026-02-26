from datetime import datetime, timedelta

from integration.integration import (
    get_previous_applications,
    upsert_application,
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
    """Model function for sending application, just calls database function to attempt sending application and catches possible errors, raising them to the caller"""

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


def add_application(application_data, access_token):
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

    upsert_application(
        availability_list,
        competencies_list,
        access_token,
        application_data.person_id,
    )


def format_availability_ranges(application_data):
    for range in application_data.availability_ranges:
        range.from_date = range.from_date.split("T")[0]
        range.to_date = range.to_date.split("T")[0]
        range.from_date = datetime.strptime(range.from_date, "%Y-%m-%d")
        range.to_date = datetime.strptime(range.to_date, "%Y-%m-%d")
        range.from_date = range.from_date + timedelta(days=1)
        range.to_date = range.to_date + timedelta(days=1)
