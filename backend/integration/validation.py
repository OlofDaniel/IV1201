

def validate_tokens(access_token=None, refresh_token=None):
    """
    Validates access and/or refresh token.
    Only checks tokens that are provided (not None).
    """
    if access_token is not None:
        if not isinstance(access_token, str) or not access_token:
            raise ValueError("Invalid access token")

    if refresh_token is not None:
        if not isinstance(refresh_token, str) or not refresh_token:
            raise ValueError("Invalid refresh token")



def validate_unique(username, email, pnr, supabase):
    """
    Function that checks if username, email and person number is unique. Returns a dict with a boolean value for each of these. True indicates unique, false is not unique.
    """
    unique_status = {
        "email": not bool(
            supabase.table("person_add_to_auth")
            .select("id")
            .eq("email", email)
            .execute()
            .data
        ),
        "username": not bool(
            supabase.table("person_add_to_auth")
            .select("id")
            .eq("username", username)
            .execute()
            .data
        ),
        "pnr": not bool(
            supabase.table("person_add_to_auth")
            .select("id")
            .eq("pnr", pnr)
            .execute()
            .data
        ),
    }
    return unique_status

def validate_person_info(person_information):
    """
    Validates that all required fields exist and have correct type/format.
    """

    required_fields = [
        "username",
        "email",
        "password",
        "first_name",
        "surname",
        "person_number",
    ]

    for field in required_fields:
        if field not in person_information:
            raise ValueError(f"Missing required field: {field}")
        if not isinstance(person_information[field], str) or not person_information[field].strip():
            raise ValueError(f"Invalid or empty {field}")

    email = person_information["email"]
    if "@" not in email:
        raise ValueError("Invalid email format")


def validate_application_data(availability_list, competencies_list, person_id):

    """
    Validates availability_list and competencies_list by validating the format and the content.
    """

    if not isinstance(availability_list, list):
        raise ValueError("availability_list must be a list")
    for entry in availability_list:
        if not isinstance(entry, dict):
            raise ValueError("Each availability entry must be a dict")
        required_fields = ["person_id", "from_date", "to_date"]
        for field in required_fields:
            if field not in entry:
                raise ValueError(f"Missing {field} in availability entry")
            if field == "person_id" and entry[field] != person_id:
                raise ValueError("person_id mismatch in availability entry")
            if field in ["from_date", "to_date"] and not isinstance(entry[field], str):
                raise ValueError(f"{field} must be a string in ISO format")

    if not isinstance(competencies_list, list):
        raise ValueError("competencies_list must be a list")
    for entry in competencies_list:
        if not isinstance(entry, dict):
            raise ValueError("Each competency entry must be a dict")
        required_fields = ["person_id", "competence_id", "years_of_experience"]
        for field in required_fields:
            if field not in entry:
                raise ValueError(f"Missing {field} in competency entry")
        if entry["person_id"] != person_id:
            raise ValueError("person_id mismatch in competency entry")
        if not isinstance(entry["competence_id"], int):
            raise ValueError("competence_id must be an int")
        if not isinstance(entry["years_of_experience"], (int, float)):
            raise ValueError("years_of_experience must be a number")


def validate_status_updates(status_updates):
    """
    Validates the list of application status updates.
    """

    if not isinstance(status_updates, list):
        raise ValueError("status_updates must be a list")

    allowed_statuses = {"Accepted", "Rejected", "Unhandled"}

    for i, update in enumerate(status_updates):
        if not isinstance(update, dict):
            raise ValueError(f"Each status update must be a dict, but item {i} is {type(update)}")

        person_id = update.get("person_id")
        if not isinstance(person_id, str) or not person_id.strip():
            raise ValueError(f"Invalid person_id in status update {i}")

        status = update.get("application_status")
        if status not in allowed_statuses:
            raise ValueError(f"Invalid application_status in status update {i}: {status}")



