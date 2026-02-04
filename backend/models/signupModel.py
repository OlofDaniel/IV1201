import bcrypt
from integration.integration import add_person

from .customExceptions import DatabaseException


def hash_password(password):
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password_bytes, salt)
    return hashed_password.decode()


def signup(person_information):
    try:
        person_information["password"] = hash_password(person_information["password"])
        add_person(person_information)
        return "Account created successfully"
    except ValueError as e:
        error_data = e.args[0] if e.args else {}

        if isinstance(error_data, dict) and error_data.get("code") == "23505":
            details = error_data.get("details", "").lower()

            if "pnr" in details:
                raise ValueError(
                    "Could not signup, person number not unique in database"
                )
            elif "email" in details:
                raise ValueError("Could not signup, email not unique in database")
            elif "username" in details:
                raise ValueError("Could not signup, username not unique in database")

        else:
            raise DatabaseException()
