from datetime import datetime, timedelta

from integration.integration import upsert_application

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
    try:
        for range in application_data.availability_ranges:
            range.from_date = range.from_date.split("T")[0]
            range.to_date = range.to_date.split("T")[0]
            range.from_date = datetime.strptime(range.from_date, "%Y-%m-%d")
            range.to_date = datetime.strptime(range.to_date, "%Y-%m-%d")
            range.from_date = range.from_date + timedelta(days=1)
            range.to_date = range.to_date + timedelta(days=1)

        application_data_competencies = {
            competency_id_map[k]: v for k, v in application_data.competencies.items()
        }

        upsert_application(
            application_data.availability_ranges,
            application_data_competencies,
            access_token,
            refresh_token,
            application_data.person_id,
        )

    except InvalidTokenError:
        raise
    except DatabaseException:
        raise
    except ValueError:
        raise
