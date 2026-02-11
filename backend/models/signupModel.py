from integration.integration import add_person

from .customExceptions import DatabaseException, ValidationError


def signup(person_information):
    """Signup function that hashes a password, and then attempts to add that user to the database.
    Catches Error if a field that is required to be unique in the database isn't and raises it with a specialized message
    """
    try:
        return add_person(person_information)
    except ValidationError as e:
        details = e.details

        non_unique = [k for k, v in details.items() if v == False]

        raise ValueError("The following credential were not unique:", non_unique)

    except ValueError as e:
        raise DatabaseException(e)
