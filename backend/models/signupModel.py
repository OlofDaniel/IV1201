from integration.integration import add_person

from .customExceptions import DatabaseException, ValidationError


def signup(person_information):
    """
    Function that signs up user by adding it to supabase.
    Catches Error if a field that is required to be unique in the database isn't and raises it with a specialized message
    """
    try:
        sign_up_response = add_person(person_information)
        formatted_response = {
            "access_token": sign_up_response.session.access_token,
            "refresh_token": sign_up_response.session.refresh_token,
            "user": sign_up_response.user.user_metadata,
        }
        return formatted_response
    
    except ValidationError:
        raise

    except DatabaseException:
        raise
