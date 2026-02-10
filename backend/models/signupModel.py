from integration.integration import add_person

from .customExceptions import DatabaseException, ValidationError


def signup(person_information):
    """Signup function that hashes a password, and then attempts to add that user to the database.
    Catches Error if a field that is required to be unique in the database isn't and raises it with a specialized message
    """
    try:
        add_person(person_information)
        return "Account created successfully"
    except ValidationError as e:
        details = e.details

        if details["email"] == False:
            raise ValueError("Email is not unique")
        elif details["pnr"] == False:
            raise ValueError("Person number is not unique")
        elif details["username"] == False:
            raise ValueError("Username is not unique")

    except ValueError as e:
        raise DatabaseException(e)
