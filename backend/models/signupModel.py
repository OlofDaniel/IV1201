from integration.integration import add_person

from .customExceptions import DatabaseException, ValidationError


def signup(person_information):
    """
    Function that signs up user by adding it to supabase.
    Catches Error if a field that is required to be unique in the database isn't and raises it with a specialized message
    """
    try:
        return add_person(person_information)
    except ValidationError:
        raise

    except DatabaseException:
        raise
